import { useSuspenseQuery } from "@tanstack/react-query"
import { } from "@tanstack/react-router"
import { Suspense } from "react"
import { CommunityCard } from "src/components/community/community-card"
import { Layout } from "src/components/layout"
import { communityQueries } from "src/services/queries"

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: communities } = useSuspenseQuery(
    communityQueries.list({ ownCommunitiesOnly: true }),
  )

  return (
    <Layout className="items-center gap-2">
      <h1 className="text-2xl font-bold">My Communities</h1>
      <Suspense fallback="Loading communities...">
        <ul className="space-y-2 min-w-[40%] max-w-[90%]">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </ul>
      </Suspense>
    </Layout>
  )
}
