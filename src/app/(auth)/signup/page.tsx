'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GoogleIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { GithubIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { getOrigin } from '@/lib/constants';
import { toast } from 'sonner';
/**
 * Signup page component that handles user registration
 */
export default function SignupPage() {
    const router = useRouter();
    const callbackURL = getOrigin();

    // useLoggedInRedirect();

    const signUpMutation = useMutation({
        mutationFn: async (data: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            image?: string;
        }) => {
            // const response = await authClient.signUp.email({
            //     email: data.email,
            //     password: data.password,
            //     name: `${data.firstName} ${data.lastName}`,
            //     callbackURL,
            // });

            // return handleAuthResponse(response);
        },
        onSuccess: () => {
            toast("A verification email has been sent to your email address.", {
                description: "Please verify your email.",
            });

            router.push("/");
        },
    });

    // const googleLoginMutation = useGoogleLoginMutation({
    //     callbackURL,
    // });

    // const githubLoginMutation = useGithubLoginMutation({
    //     callbackURL,
    // });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const passwordConfirmation = formData.get("passwordConfirmation") as string;
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;

        if (password !== passwordConfirmation) {
            toast.error("Passwords do not match");
            return;
        }

        signUpMutation.mutate({
            firstName,
            lastName,
            email,
            password,
        });
    };

    const handleGoogleLogin = () => {
        // googleLoginMutation.mutate();
    };

    const handleGithubLogin = () => {
        // githubLoginMutation.mutate();
    };

    return (
        <form
            className="w-full h-svh flex items-center justify-center"
            onSubmit={handleSubmit}
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                    id="first-name"
                                    placeholder="John"
                                    required
                                    name="firstName"
                                    autoFocus
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Snow"
                                    required
                                    name="lastName"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                name="email"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Password"
                                name="password"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="passwordConfirmation"
                                autoComplete="new-password"
                                placeholder="Confirm Password"
                                required
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
                        href="/login"
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
                            onClick={handleGoogleLogin}
                        // disabled={googleLoginMutation.isPending}
                        >
                            {/* {googleLoginMutation.isPending ? <Spinner /> : <GoogleIcon />} */}
                            Sign up with Google
                        </Button>
                        <Button
                            variant="outline"
                            className={cn("w-full gap-2")}
                            type="button"
                            onClick={handleGithubLogin}
                        // disabled={githubLoginMutation.isPending}
                        >
                            {/* {githubLoginMutation.isPending ? <Spinner /> : <GithubIcon />} */}
                            Sign up with Github
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
} 