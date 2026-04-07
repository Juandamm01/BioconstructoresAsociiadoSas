import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db: any = prisma;
    let schedule = await db.planSchedule.findUnique({ where: { id: 1 } });
    if (!schedule) {
      schedule = await db.planSchedule.create({ data: { id: 1 } });
    }

    const groups = await db.planGroup.findMany({
      orderBy: { order: "asc" },
      include: { items: { orderBy: { order: "asc" } } }
    });

    return NextResponse.json({ schedule, groups }, { status: 200 });
  } catch (error) {
    console.error("GET /api/plans error:", error);
    return NextResponse.json({ error: "No se pudieron obtener los planes" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schedule, groups } = await req.json();
    const db: any = prisma;

    await db.$transaction(async (tx: any) => {
      if (schedule) {
        await tx.planSchedule.upsert({
          where: { id: 1 },
          update: {
            dia1: schedule.dia1, hora1: schedule.hora1,
            dia2: schedule.dia2, hora2: schedule.hora2,
            dia3: schedule.dia3, hora3: schedule.hora3
          },
          create: {
            id: 1,
            dia1: schedule.dia1, hora1: schedule.hora1,
            dia2: schedule.dia2, hora2: schedule.hora2,
            dia3: schedule.dia3, hora3: schedule.hora3
          }
        });
      }

      if (groups) {
        // Delete existing data first
        await tx.planItem.deleteMany();
        await tx.planGroup.deleteMany();

        // Create all groups in a single batch and get their IDs back
        // Note: createManyAndReturn returns rows in insertion order, matching gi index
        const createdGroups = await tx.planGroup.createManyAndReturn({
          data: groups.map((g: any, gi: number) => ({
            title: g.title,
            subtitle: g.subtitle || "",
            badge: g.badge || "",
            isPremium: g.isPremium || false,
            order: gi
          }))
        });

        // Build all plan items referencing the newly created group IDs
        const allItems: any[] = [];
        for (let gi = 0; gi < groups.length; gi++) {
          const g = groups[gi];
          const groupId = createdGroups[gi].id;
          if (g.items && g.items.length > 0) {
            for (let ii = 0; ii < g.items.length; ii++) {
              allItems.push({
                name: g.items[ii].name,
                price: g.items[ii].price,
                order: ii,
                planGroupId: groupId
              });
            }
          }
        }

        // Insert all items in a single batch
        if (allItems.length > 0) {
          await tx.planItem.createMany({ data: allItems });
        }
      }
    }, { timeout: 15000 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/plans error:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
