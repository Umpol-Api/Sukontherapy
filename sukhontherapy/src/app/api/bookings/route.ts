import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const isAdmin = (session.user as any).role === "ADMIN";

    const bookings = await prisma.booking.findMany({
        where: isAdmin ? {} : { userId },
        include: { service: true, staff: true, user: { select: { name: true, email: true, phone: true } } },
        orderBy: { datetime: "desc" },
    });

    return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { serviceId, staffId, datetime, durationMins, useCoupon, couponId } = await req.json();
        const userId = (session.user as any).id;

        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });

        const durations: { mins: number; price: number }[] = JSON.parse(service.durations);
        const durOpt = durations.find((d) => d.mins === durationMins);
        if (!durOpt) return NextResponse.json({ error: "Invalid duration." }, { status: 400 });

        // If using coupon, validate
        let couponUsed = false;
        let finalCouponId: string | undefined;
        if (useCoupon && couponId) {
            const coupon = await prisma.couponPackage.findFirst({
                where: { id: couponId, userId, serviceId, isActive: true },
            });
            if (!coupon || coupon.usedSessions >= coupon.totalSessions) {
                return NextResponse.json({ error: "Invalid or exhausted coupon." }, { status: 400 });
            }
            couponUsed = true;
            finalCouponId = couponId;
        }

        // Resolve staffId — auto-assign if not provided
        let assignedStaffId = staffId || null;
        if (!assignedStaffId) {
            const staff = await prisma.staff.findFirst({ where: { isActive: true } });
            assignedStaffId = staff?.id || null;
        }

        const booking = await prisma.booking.create({
            data: {
                userId,
                serviceId,
                staffId: assignedStaffId,
                datetime: new Date(datetime),
                durationMins,
                price: couponUsed ? 0 : durOpt.price,
                status: "PENDING_PAYMENT",
                couponUsed,
                couponId: finalCouponId || null,
            },
            include: { service: true, staff: true },
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (err) {
        console.error("Booking error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
