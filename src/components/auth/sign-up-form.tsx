import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { GithubIcon, GoogleIcon } from "src/components/ui/icons";
import { useAppForm } from "src/lib/form";
import { SignUpSchema } from "src/services/auth.schema";
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
import { Spinner } from "../ui/spinner";

const signUp = async (data: SignUpSchema) => {
  const { error } = await authClient.signUp.email({
    email: data.email,
    password: data.password,
    name: data.username,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const SignUpForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("You have successfully signed up.");

      queryClient.resetQueries();
      router.invalidate();
    },
  });

  const form = useAppForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as SignUpSchema,
    onSubmit: async ({ value }) => {
      await signUpMutation.mutateAsync(value);
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
      <Card className="z-50 rounded-md rounded-t-none max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <form.AppField
                  name="username"
                  children={(field) => (
                    <field.TextField
                      label="Name"
                      required
                      placeholder="Tyler Durden"
                    />
                  )}
                />
              </div>
            </div>

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
              <form.AppField
                name="password"
                children={(field) => (
                  <field.TextField
                    label="Password"
                    required
                    type="password"
                    placeholder="Password"
                  />
                )}
              />
            </div>

            <div className="grid gap-2">
              <form.AppField
                name="confirmPassword"
                children={(field) => (
                  <field.TextField
                    label="Confirm Password"
                    required
                    type="password"
                    placeholder="Confirm Password"
                  />
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending && <Spinner />}
              Create an account
            </Button>
          </div>

          <Link
            to="/sign-in"
            className={buttonVariants({
              variant: "link",
              className: "text-left pl-0 w-fit my-2.5",
            })}
          >
            Already have an account? Sign in
          </Link>

          <div className="space-y-2">
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              type="button"
              // onClick={handleGoogleLogin}
              // disabled={googleLoginMutation.isPending}
            >
              {
                // googleLoginMutation.isPending

                false ? <Spinner /> : <GoogleIcon />
              }
              Sign up with Google
            </Button>
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              type="button"
              // onClick={handleGithubLogin}
              // disabled={githubLoginMutation.isPending}
            >
              {
                // githubLoginMutation.isPending

                false ? <Spinner /> : <GithubIcon />
              }
              Sign up with Github
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
