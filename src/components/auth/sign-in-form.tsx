import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, GithubIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppForm } from "src/lib/form";
import { SignInSchema } from "src/services/auth.schema";
import { authClient } from "~/lib/auth/client";
import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { GoogleIcon } from "../ui/icons";
import { Spinner } from "../ui/spinner";

const signIn = async (data: SignInSchema) => {
  const { error, data: response } = await authClient.signIn.email({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return response;
};

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: (response) => {
      toast.success(`Hey ${response.user.name}, welcome back!`);

      queryClient.resetQueries();
      navigate({ to: "/" });
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: import.meta.env.VITE_DEFAULT_USER_EMAIL ?? "",
      password: import.meta.env.VITE_DEFAULT_USER_PASSWORD ?? "",
    } as SignInSchema,
    onSubmit: async ({ value }) => {
      await signInMutation.mutateAsync(value);
    },
  });

  return (
    <form
      className="w-full h-svh flex items-center justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email"
                    required
                    type="email"
                    placeholder="tylerdurden@fight.club"
                  />
                )}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                {/* <Link
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                  tabIndex={-1}
                >
                  Forgot your password?
                </Link> */}
              </div>

              <div className="flex gap-1">
                <form.AppField
                  name="password"
                  children={(field) => (
                    <field.TextField
                      label="Password"
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                  )}
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  size="icon"
                  tabIndex={-1}
                  className="px-2 mt-auto"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? <Spinner /> : "Login"}
            </Button>
          </div>

          <Link
            to="/signup"
            className={buttonVariants({
              variant: "link",
              className: "text-left pl-0 w-fit my-2.5",
            })}
          >
            Don't have an account? Sign up
          </Link>
          <div
            className={cn(
              "w-full gap-2 flex items-center",
              "justify-between flex-col",
            )}
          >
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              type="button"
              // onClick={handleGoogleLogin}
              // disabled={googleLoginMutation.isPending}
            >
              {
                // googleLoginMutation.isPending ?
                false ? <Spinner /> : <GoogleIcon />
              }
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              type="button"
              // onClick={handleGithubLogin}
              // disabled={githubLoginMutation.isPending}
            >
              {
                // githubLoginMutation.isPending ?
                false ? <Spinner /> : <GithubIcon />
              }
              Sign in with Github
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
