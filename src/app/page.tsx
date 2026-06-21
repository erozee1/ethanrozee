import ProfileSidebar from "@/components/ProfileSidebar";
import PinnedWork from "@/components/PinnedWork";
import ContribGraph from "@/components/ContribGraph";
import CombinedFeed from "@/components/CombinedFeed";
import { workItems } from "@/data/work";
import { publications } from "@/data/research";
import { linkedInPosts } from "@/data/linkedin";
import { manualPosts } from "@/data/posts";
import { fetchContribData, fetchActivityGroups } from "@/lib/github";
import { fetchArticles } from "@/lib/articles";

export default async function Home() {
  const [contribData, activityGroups, articles] = await Promise.all([
    fetchContribData(),
    fetchActivityGroups(),
    fetchArticles(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="shrink-0 self-start md:sticky md:top-14">
          <ProfileSidebar />
        </div>

        <div className="flex-1 min-w-0">
          <PinnedWork items={workItems} />

          <section
            className="mb-8 rounded-lg border p-5"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
          >
            <ContribGraph data={contribData} />
          </section>

          <section>
            <CombinedFeed
              activityGroups={activityGroups}
              articles={articles}
              publications={publications}
              linkedInPosts={linkedInPosts}
              manualPosts={manualPosts}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
