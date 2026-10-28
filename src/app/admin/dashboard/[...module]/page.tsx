import { ResourceManager } from "@/components/admin/resource-manager";

const supportedModules = new Set([
  "products",
  "categories",
  "machines",
  "industries",
  "gallery",
  "brands",
  "inquiries",
  "pages",
  "seo",
  "settings",
]);

export default async function AdminModulePage({
  params,
}: {
  params: Promise<{ module: string[] }>;
}) {
  const { module } = await params;
  const resource = module[0];
  if (module.length !== 1 || !supportedModules.has(resource)) {
    return (
      <div className="card p-8">
        <h1 className="text-2xl font-bold">Module not found</h1>
        <p className="muted mt-2">Choose a module from the sidebar.</p>
      </div>
    );
  }
  return <ResourceManager resource={resource} />;
}
