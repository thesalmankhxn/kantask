import { Link, redirect } from "@tanstack/react-router";
import { SignUpForm } from "src/components/auth/sign-up-form";
import { PublicRouteLayout } from "~/components/public-route-layout";
import { authQueries } from "~/services/queries";

export const Route = createFileRoute({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const userSession = await context.queryClient.fetchQuery(
      authQueries.user(),
    );
    if (userSession) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <PublicRouteLayout className="items-center gap-2 max-w-md">
      <SignUpForm />
    </PublicRouteLayout>
  );
}
