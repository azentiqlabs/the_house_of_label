export default async function AdminModulePlaceholder({
  params,
}: {
  params: Promise<{ module: string[] }>;
}) {
  const { module } = await params;
  const title = module.map((part) => part.replace(/-/g, " ")).join(" / ");
  return (
    <div className="card p-8">
      <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
        Admin module
      </p>
      <h1 className="mt-3 text-3xl font-extrabold capitalize">{title}</h1>
      <p className="muted mt-3 max-w-2xl leading-7">
        This module's page is scaffolded. Add authenticated server-side data
        access, validated create/edit forms, pagination, error handling and
        authorization before using it.
      </p>
    </div>
  );
}
