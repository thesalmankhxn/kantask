import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { WelcomeScreen } from "~/components/welcome-screen";
import { useAuthenticatedUser } from "~/lib/auth/client";
import { router } from "~/router";

export const Route = createFileRoute({
  component: HomeComponent,
});

function HomeComponent() {
  const session = useAuthenticatedUser();

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-linear-to-b from-background to-secondary/20">
      <main className="w-full max-w-3xl shadow-lg mt-8 flex flex-col items-center justify-center p-4">
        <WelcomeScreen
          userName={session.user.name}
          onBoardsClick={() => router.navigate({ to: "/boards" })}
          onNotesClick={() => router.navigate({ to: "/notes" })}
          onCreateProject={() => router.navigate({ to: "/projects/new" })}
        />
      </main>
    </div>
  );
}
