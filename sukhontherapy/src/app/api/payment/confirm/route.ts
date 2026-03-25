import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// This endpoint simulates a PromptPay webhook or mock auto-confirm
export async function POST(req: NextRequest) {
    try {
        const { bookingId } = await req.json();
        if (!bookingId) return NextResponse.json({ error: "bookingId required." }, { status: 400 });

        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
        });

        if (updated.couponUsed && updated.couponId) {
            await prisma.couponPackage.update({
                where: { id: updated.couponId },
                data: { usedSessions: { increment: 1 } },
            });
        }

        return NextResponse.json({ success: true, booking: updated });
    } catch (err) {
        console.error("Payment confirm error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
