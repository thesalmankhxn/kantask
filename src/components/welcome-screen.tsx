"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FileText, Layout, PlusCircle } from "lucide-react";

interface WelcomeScreenProps {
  userName?: string;
  onBoardsClick?: () => void;
  onNotesClick?: () => void;
  onCreateProject?: () => void;
}

export function WelcomeScreen({
  userName = "User",
  onBoardsClick,
  onNotesClick,
  onCreateProject,
}: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6 w-full max-w-4xl mx-auto">
      <div className="text-center mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {userName}!{" "}
          <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          What would you like to work on today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <Card
          className="transition-all hover:shadow-md cursor-pointer border-2 hover:border-primary/50"
          onClick={onBoardsClick}
        >
          <CardHeader className="text-center pb-2">
            <Layout className="w-12 h-12 mx-auto mb-2 text-primary" />
            <CardTitle className="text-xl">Boards</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Manage your kanban boards
          </CardContent>
          <CardFooter className="justify-center pt-0">
            <Button variant="ghost" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Board
            </Button>
          </CardFooter>
        </Card>

        <Card
          className="transition-all hover:shadow-md cursor-pointer border-2 hover:border-primary/50"
          onClick={onNotesClick}
        >
          <CardHeader className="text-center pb-2">
            <FileText className="w-12 h-12 mx-auto mb-2 text-primary" />
            <CardTitle className="text-xl">Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Access your notes
          </CardContent>
          <CardFooter className="justify-center pt-0">
            <Button variant="ghost" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Note
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-10">
        <Button variant="outline" className="gap-2" onClick={onCreateProject}>
          <PlusCircle className="h-4 w-4" />
          Create New Project
        </Button>
      </div>
    </div>
  );
}
