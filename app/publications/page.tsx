import { getPublications } from "@/lib/publications";
import PublicationsList from "./PublicationsList";

export default async function PublicationsPage() {
  const { records: publications, sourcePath } = await getPublications();

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.4em] text-[color:var(--muted)]">
          Publications
        </p>
        <h2 className="text-3xl font-semibold text-[color:var(--foreground)]">
          Peer-reviewed research and other writing.
        </h2>
        <p className="text-base text-[color:var(--muted)]">
          The JSON file under <code>{sourcePath}</code> is regenerated via <code>npm run sync-publications</code> and retains the latest metadata.
        </p>
      </div>
      <PublicationsList publications={publications} />
    </section>
  );
}
