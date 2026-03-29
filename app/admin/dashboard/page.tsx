import AdminDashboard from "@/components/landing/admin/adminDasboard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/admin");
  }

  // Get users/admins data to show in dashboard
  const admins = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      sessions: {
        orderBy: { updatedAt: 'desc' },
        take: 1
      }
    }
  });

  // Fetch counts
  let planesCount = 0;
  
  try {
    const db: any = prisma;
    const pCount = await db.planGroup.count();
    if (typeof pCount === 'number') planesCount = pCount;
  } catch (error) {}

  const sectoresCount = await prisma.barrio.count();

  return <AdminDashboard session={session} admins={admins} stats={{ planesCount, sectoresCount }} />;
}
