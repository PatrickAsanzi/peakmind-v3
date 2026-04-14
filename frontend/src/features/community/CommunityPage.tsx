import { useCommunityFeed } from "./hooks/useCommunityFeed";

export default function CommunityPage() {
  const { data, isLoading, error } = useCommunityFeed();

  return (
    <div className="space-y-8">
      <section className="section-card">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Community
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Professional and peer support
          </h1>
          <p className="text-slate-600">
            Connect with colleagues, wellness coaches, and trusted advisors in
            your PeakMind community feed.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="section-card text-slate-500">
          Loading the community feed…
        </div>
      ) : error ? (
        <div className="section-card text-rose-600">
          Unable to load community posts.
        </div>
      ) : (
        <div className="space-y-4">
          {data?.map((post) => (
            <article key={post.id} className="section-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {post.author}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-slate-700">{post.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
