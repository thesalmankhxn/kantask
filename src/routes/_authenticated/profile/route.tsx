import { redirect } from "@tanstack/react-router";
import { ProfileCard } from "src/components/profile-card";
import { Layout } from "~/components/layout";
import { authQueries } from "~/services/queries";

export const Route = createFileRoute({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const userSession = await context.user;
    if (!userSession) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <Layout>
      <ProfileCard />
    </Layout>
  );
}
