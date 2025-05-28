import { Link, redirect } from "@tanstack/react-router";
import { Layout } from "src/components/layout";
import { SignInForm } from "src/components/auth/sign-in-form";
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
    <Layout className="items-center gap-2 max-w-md">
      <SignInForm />
      <small>
        <Link to="/sign-up" className="group">
          Do you want to create an account instead?{" "}
          <span className="underline group-hover:no-underline">Sign Up</span>
        </Link>
      </small>
    </Layout>
  );
}
