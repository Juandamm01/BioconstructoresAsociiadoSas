import AdminPolicyDashboard from "@/components/landing/admin/adminPolicy";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminPolicyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/admin");
  }

  // Obtenemos la configuración, si no existe devolvemos un defaultValue visual
  const config = await (prisma as any).policyConfig.findUnique({
    where: { id: 1 },
  });

  return <AdminPolicyDashboard initialConfig={config} />;
}
