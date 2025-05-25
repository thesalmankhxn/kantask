'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GithubIcon, GoogleIcon } from "@/components/ui/icons";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { useGithubLoginMutation } from '@/queries/authentication';
import { useGoogleLoginMutation } from '@/queries/authentication';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

/**
 * Login page component that handles user authentication
 */
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const googleLoginMutation = useGoogleLoginMutation();

    const githubLoginMutation = useGithubLoginMutation();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement login logic
        console.log('Login attempt:', { email, password });
    };

    const handleGoogleLogin = () => {
        googleLoginMutation.mutate();
    };

    const handleGithubLogin = () => {
        githubLoginMutation.mutate();
    };

    return (
        <form
            className="w-full h-svh flex items-center justify-center"
        // onSubmit={handleUserPasswordLogin}
        >
            <Card className="max-w-sm w-full">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                    tabIndex={-1}
                                >
                                    Forgot your password?
                                </Link>
                            </div>

                            <div className="flex gap-1">
                                <Input
                                    id="password"
                                    // type={showPassword ? "text" : "password"}
                                    placeholder="password"
                                    autoComplete="password"
                                    name="password"
                                    required
                                />
                                <Button
                                    variant="outline"
                                    type="button"
                                    // onClick={() => setShowPassword(!showPassword)}
                                    size="icon"
                                    tabIndex={-1}
                                    className="px-2"
                                >
                                    {/* {showPassword ? <Eye /> : <EyeOff />} */}
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                        // disabled={userPasswordLoginMutation.isPending}
                        >
                            {/* {userPasswordLoginMutation.isPending ? <Spinner /> : "Login"} */}
                            Login
                        </Button>
                    </div>

                    <Link
                        href="/signup"
                        className={buttonVariants({
                            variant: "link",
                            className: "text-left pl-0 w-fit my-2.5",
                        })}
                    >
                        Don&apos;t have an account? Sign up
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
                            onClick={handleGoogleLogin}
                            disabled={googleLoginMutation.isPending}
                        >
                            {googleLoginMutation.isPending ? <Spinner /> : <GoogleIcon />}
                            Sign in with Google
                        </Button>
                        <Button
                            variant="outline"
                            className={cn("w-full gap-2")}
                            type="button"
                            onClick={handleGithubLogin}
                            disabled={githubLoginMutation.isPending}
                        >
                            {githubLoginMutation.isPending ? <Spinner /> : <GithubIcon />}
                            Sign in with Github
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
} 