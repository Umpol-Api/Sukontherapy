import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { status } = await req.json();
    const userId = (session.user as any).id;
    const isAdmin = (session.user as any).role === "ADMIN";

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    if (!isAdmin && booking.userId !== userId) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const validStatuses = ["PENDING_PAYMENT", "AWAITING_CONFIRMATION", "CONFIRMED", "CANCELLED", "COMPLETED"];
    if (!validStatuses.includes(status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

    const updated = await prisma.booking.update({ where: { id }, data: { status } });

    // If confirming a coupon booking, deduct session
    if (status === "CONFIRMED" && updated.couponUsed && updated.couponId) {
        await prisma.couponPackage.update({
            where: { id: updated.couponId },
            data: { usedSessions: { increment: 1 } },
        });
    }

    return NextResponse.json(updated);
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const booking = await prisma.booking.findUnique({
        where: { id },
        include: { service: true, staff: true, user: { select: { name: true, email: true, phone: true } } },
    });

    if (!booking) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const userId = (session.user as any).id;
    const isAdmin = (session.user as any).role === "ADMIN";
    if (!isAdmin && booking.userId !== userId) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    return NextResponse.json(booking);
}
