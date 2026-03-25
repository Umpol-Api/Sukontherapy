export function parseSlots(
    startTime: string,
    endTime: string,
    durationMins: number
): string[] {
    const slots: string[] = [];
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    let current = sh * 60 + sm;
    const end = eh * 60 + em;

    while (current + durationMins <= end) {
        const h = Math.floor(current / 60);
        const m = current % 60;
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
        current += 60; // hourly slots
    }
    return slots;
}

export function formatPrice(thb: number): string {
    return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
        minimumFractionDigits: 0,
    }).format(thb);
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date));
}

export function formatTime(time: string): string {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export function getDayName(dayIndex: number): string {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
}
