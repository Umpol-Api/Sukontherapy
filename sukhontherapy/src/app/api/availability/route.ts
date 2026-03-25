import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseSlots } from "@/lib/utils";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const serviceId = searchParams.get("serviceId");
        const dateStr = searchParams.get("date");
        const durationMins = parseInt(searchParams.get("duration") || "60");

        if (!serviceId || !dateStr) {
            return NextResponse.json({ error: "serviceId and date are required." }, { status: 400 });
        }

        const date = new Date(dateStr);
        const dayOfWeek = date.getDay(); // 0=Sun ... 6=Sat

        // Get all active staff who work on this day
        const allStaff = await prisma.staff.findMany({ where: { isActive: true } });
        const availableStaff = allStaff.filter((s) => {
            const workDays: number[] = JSON.parse(s.workDays);
            return workDays.includes(dayOfWeek);
        });

        if (availableStaff.length === 0) {
            return NextResponse.json({ slots: [] });
        }

        // Get existing bookings for each staff on this date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const existingBookings = await prisma.booking.findMany({
            where: {
                datetime: { gte: startOfDay, lte: endOfDay },
                status: { not: "CANCELLED" },
            },
        });

        // Build slot availability
        const allSlots: { time: string; staffId: string; staffName: string }[] = [];

        for (const staff of availableStaff) {
            const slots = parseSlots(staff.startTime, staff.endTime, durationMins);

            for (const slot of slots) {
                const [h, m] = slot.split(":").map(Number);
                const slotDate = new Date(date);
                slotDate.setHours(h, m, 0, 0);

                // Check if this staff is booked at this time
                const isBooked = existingBookings.some((b) => {
                    if (b.staffId !== staff.id) return false;
                    const bTime = new Date(b.datetime);
                    const bEnd = new Date(bTime.getTime() + b.durationMins * 60000);
                    const sEnd = new Date(slotDate.getTime() + durationMins * 60000);
                    return slotDate < bEnd && sEnd > bTime;
                });

                if (!isBooked) {
                    allSlots.push({ time: slot, staffId: staff.id, staffName: staff.name });
                }
            }
        }

        // Deduplicate time slots & group by time
        const slotMap: Record<string, { time: string; staff: { id: string; name: string }[] }> = {};
        for (const s of allSlots) {
            if (!slotMap[s.time]) slotMap[s.time] = { time: s.time, staff: [] };
            slotMap[s.time].staff.push({ id: s.staffId, name: s.staffName });
        }

        return NextResponse.json({ slots: Object.values(slotMap).sort((a, b) => a.time.localeCompare(b.time)) });
    } catch (err) {
        console.error("Availability error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
