import { Outlet, redirect, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { authQueries } from "~/services/queries";

export const Route = createFileRoute({
  component: RouteComponent,

  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(authQueries.user());
    if (!user) {
      throw redirect({
        to: "/signin",
        reloadDocument: true,
      });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const isAuthExpired = currentTime >= user.session.expiresAt.getTime();

    if (isAuthExpired) {
      localStorage.removeItem("auth-token");
      throw redirect({
        to: "/signin",
        reloadDocument: true,
      });
    }

    return { user };
  },

  errorComponent: (error) => {
    const router = useRouter();

    if (error.error instanceof Error) {
      router.navigate({
        to: "/signin",
        reloadDocument: true,
      });

      return null;
    }

    console.log("error", error);

    return (
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-96">
          <p className="text-destructive text-2xl font-bold mb-2">
            {/* {error.json().stringify()} */}
          </p>
          <p className="text-destructive">
            Something went wrong, Try refreshing the page.
          </p>
        </div>
      </div>
    );
  },
});

function RouteComponent() {
  const { data: user, isError } = useSuspenseQuery(authQueries.user());
  const router = useRouter();

  const redirectToLogin = () => {
    localStorage.removeItem("auth-token");
    router.navigate({
      to: "/signin",
      reloadDocument: true,
    });
  };

  // I have to make auth related checks on beforeLoad
  // and also on component here becuase beforeLoad
  // is not reactive and will not update when the query
  // data is updated
  if (isError) {
    redirectToLogin();
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const isAuthExpired = currentTime >= user?.session?.expiresAt?.getTime()!;

  if (isAuthExpired) {
    redirectToLogin();

    return null;
  }

  const hasNoActiveOrganization = !user;

  if (hasNoActiveOrganization && !location.pathname.includes("/")) {
    router.navigate({
      to: "/",
    });

    return null;
  }

  return <Outlet />;
}
