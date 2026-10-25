import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata(
  "Machines",
  "Explore the machinery and processes supporting our label solutions.",
);
export default async function MachinesPage() {
  let machines: any[] = [];
  try {
    machines = await prisma.machine.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    });
  } catch {}
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Built for precision</p>
        <h1 className="section-title mt-3">Our Machines</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {machines.length ? (
            machines.map((m) => (
              <article className="card p-5" key={m.id}>
                {m.imageUrl && (
                  <img
                    src={m.imageUrl}
                    alt={m.name}
                    className="mb-4 aspect-video w-full rounded-lg object-cover"
                  />
                )}
                <h2 className="font-bold">{m.name}</h2>
                <p className="muted mt-2 text-sm leading-6">{m.description}</p>
              </article>
            ))
          ) : (
            <p className="muted">
              Machine listings will appear here after published records are
              added.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
