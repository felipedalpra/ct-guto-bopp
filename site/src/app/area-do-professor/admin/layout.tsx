import { exigirLider } from "@/lib/supabase/perfil";

export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigirLider();

  return <div className="mx-auto flex max-w-4xl flex-col gap-8">{children}</div>;
}
