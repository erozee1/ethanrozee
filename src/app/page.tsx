import ProfileSidebar from "@/components/ProfileSidebar";
import PinnedWork from "@/components/PinnedWork";
import ContribGraph from "@/components/ContribGraph";
import ActivityFeed from "@/components/ActivityFeed";
import { workItems } from "@/data/work";
import { fetchContribData, fetchActivityGroups } from "@/lib/github";

export default async function Home() {
  const [contribData, activityGroups] = await Promise.all([
    fetchContribData(),
    fetchActivityGroups(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <ProfileSidebar />

        <div className="flex-1 min-w-0">
          <PinnedWork items={workItems} />

          <section
            className="mb-8 rounded-lg border p-5"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
          >
            <ContribGraph data={contribData} />
          </section>

          <section>
            <ActivityFeed groups={activityGroups} />
          </section>
        </div>
      </div>
    </div>
  );
}
