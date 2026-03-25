import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const services = [
    {
        id: "svc-thai",
        name: "Traditional Thai Massage",
        description:
            "Ancient healing technique using acupressure and assisted yoga postures to release tension and restore energy flow.",
        imageUrl: "/images/thai-massage.jpg",
        durations: JSON.stringify([
            { mins: 60, price: 600 },
            { mins: 90, price: 850 },
            { mins: 120, price: 1100 },
        ]),
        category: "massage",
    },
    {
        id: "svc-oil",
        name: "Aromatherapy Oil Massage",
        description:
            "Luxurious full-body massage with premium essential oils, melting away stress and nourishing the skin.",
        imageUrl: "/images/oil-massage.jpg",
        durations: JSON.stringify([
            { mins: 60, price: 700 },
            { mins: 90, price: 950 },
            { mins: 120, price: 1200 },
        ]),
        category: "massage",
    },
    {
        id: "svc-foot",
        name: "Reflexology Foot Massage",
        description:
            "Targeted pressure on reflex points of the feet to stimulate healing throughout the entire body.",
        imageUrl: "/images/foot-massage.jpg",
        durations: JSON.stringify([
            { mins: 45, price: 400 },
            { mins: 60, price: 500 },
        ]),
        category: "massage",
    },
    {
        id: "svc-hotstone",
        name: "Hot Stone Therapy",
        description:
            "Smooth volcanic basalt stones heated to perfection, gliding over muscles to release deep tension.",
        imageUrl: "/images/hot-stone.jpg",
        durations: JSON.stringify([
            { mins: 90, price: 1100 },
            { mins: 120, price: 1400 },
        ]),
        category: "therapy",
    },
    {
        id: "svc-couples",
        name: "Couples Retreat Massage",
        description:
            "Share a blissful, synchronized massage experience with your partner in our private suite.",
        imageUrl: "/images/couples-massage.jpg",
        durations: JSON.stringify([
            { mins: 60, price: 1400 },
            { mins: 90, price: 1900 },
        ]),
        category: "specialty",
    },
    {
        id: "svc-herbal",
        name: "Herbal Compress Massage",
        description:
            "Traditional Thai herbal ball compresses steamed with lemongrass, kaffir lime, and turmeric for deep relief.",
        imageUrl: "/images/herbal-massage.jpg",
        durations: JSON.stringify([
            { mins: 90, price: 950 },
            { mins: 120, price: 1250 },
        ]),
        category: "therapy",
    },
];

const staff = [
    {
        id: "staff-1",
        name: "Nisa Thongbai",
        bio: "Certified Thai massage therapist with 8 years of experience. Specializes in traditional techniques and hot stone therapy.",
        avatarUrl: "/images/staff-nisa.jpg",
        workDays: JSON.stringify([1, 2, 3, 4, 5]),
        startTime: "10:00",
        endTime: "20:00",
    },
    {
        id: "staff-2",
        name: "Ploy Srirattana",
        bio: "Aromatherapy specialist and reflexology expert. Trained in Chiang Mai traditional healing arts.",
        avatarUrl: "/images/staff-ploy.jpg",
        workDays: JSON.stringify([2, 3, 4, 5, 6]),
        startTime: "10:00",
        endTime: "20:00",
    },
    {
        id: "staff-3",
        name: "Kanya Petcharat",
        bio: "Sports massage and deep tissue specialist. Preferred therapist for athletes and office professionals.",
        avatarUrl: "/images/staff-kanya.jpg",
        workDays: JSON.stringify([1, 3, 4, 5, 6]),
        startTime: "12:00",
        endTime: "20:00",
    },
];

const reviews = [
    {
        name: "Sarah M.",
        rating: 5,
        comment:
            "Absolutely the best Thai massage experience in Bangkok. The ambiance is stunning and Nisa is incredibly skilled. Will return monthly!",
        avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=Sarah",
    },
    {
        name: "James T.",
        rating: 5,
        comment:
            "As an expat living in Bangkok, Sukhontherapy is my regular retreat. Premium experience at a fair price. The hot stone therapy is divine.",
        avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=James",
    },
    {
        name: "Amara K.",
        rating: 5,
        comment:
            "Brought my partner for the Couples Retreat and it was romantic and deeply relaxing. The private suite is gorgeous. Highly recommend!",
        avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=Amara",
    },
    {
        name: "David L.",
        rating: 4,
        comment:
            "Phenomenal reflexology session. My feet and whole body felt lighter afterward. Very professional and clean environment.",
        avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=David",
    },
    {
        name: "Camille R.",
        rating: 5,
        comment:
            "The herbal compress massage was unlike anything I've experienced. So healing and authentic. This place is a true gem in TIPCO Tower.",
        avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=Camille",
    },
];

async function main() {
    console.log("🌺 Seeding Sukhontherapy database...");

    // Upsert services
    for (const svc of services) {
        await prisma.service.upsert({
            where: { id: svc.id },
            update: svc,
            create: svc,
        });
    }
    console.log(`✅ ${services.length} services seeded`);

    // Upsert staff
    for (const s of staff) {
        await prisma.staff.upsert({
            where: { id: s.id },
            update: s,
            create: s,
        });
    }
    console.log(`✅ ${staff.length} staff members seeded`);

    // Upsert reviews
    for (const r of reviews) {
        const existing = await prisma.review.findFirst({
            where: { name: r.name },
        });
        if (!existing) {
            await prisma.review.create({ data: r });
        }
    }
    console.log(`✅ ${reviews.length} reviews seeded`);

    // Create admin user
    const adminPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "Admin1234!",
        12
    );
    await prisma.user.upsert({
        where: { email: process.env.ADMIN_EMAIL || "admin@sukhon.com" },
        update: {},
        create: {
            name: "Admin",
            email: process.env.ADMIN_EMAIL || "admin@sukhon.com",
            passwordHash: adminPassword,
            role: "ADMIN",
        },
    });
    console.log("✅ Admin user seeded (admin@sukhon.com / Admin1234!)");

    // Create a demo customer
    const demoPassword = await bcrypt.hash("Demo1234!", 12);
    const demoUser = await prisma.user.upsert({
        where: { email: "customer@demo.com" },
        update: {},
        create: {
            name: "Demo Customer",
            email: "customer@demo.com",
            passwordHash: demoPassword,
            phone: "081-234-5678",
            role: "USER",
        },
    });

    console.log("✅ Demo customer seeded (customer@demo.com / Demo1234!)");

    // Create a demo coupon package
    const existing = await prisma.couponPackage.findFirst({
        where: { userId: demoUser.id },
    });
    if (!existing) {
        await prisma.couponPackage.create({
            data: {
                userId: demoUser.id,
                serviceId: "svc-thai",
                totalSessions: 4,
                usedSessions: 1,
                expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
            },
        });
        console.log("✅ Demo coupon package seeded");
    }

    console.log("🌺 Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
