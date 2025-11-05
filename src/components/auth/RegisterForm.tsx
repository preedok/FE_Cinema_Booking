import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Lock, User, Loader2, Stars } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { useAuthStore } from '../../lib/stores/auth';
import type { RegisterForm as RegisterFormType } from '../../types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL || '',
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''
);

interface RegisterFormProps {
    onSuccess?: () => void;
    onToggleForm?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onToggleForm }) => {
    const [formData, setFormData] = useState<RegisterFormType>({
        email: '',
        password: '',
        name: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                const user = {
                    id: session.user.id,
                    email: session.user.email!,
                    name: session.user.user_metadata.full_name ||
                        session.user.user_metadata.name ||
                        session.user.email!.split('@')[0],
                    avatar: session.user.user_metadata.avatar_url ||
                        session.user.user_metadata.picture,
                    role: 'customer' as const,
                    created_at: session.user.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                login(user, session.access_token);
                onSuccess?.();
                window.location.href = '/booking';
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const { data, error: supabaseError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                    }
                }
            });

            if (supabaseError) throw supabaseError;

            if (data.user && data.session) {
                const user = {
                    id: data.user.id,
                    email: data.user.email!,
                    name: formData.name,
                    avatar: data.user.user_metadata.avatar_url,
                    role: 'customer' as const,
                    created_at: data.user.created_at,
                    updated_at: new Date().toISOString(),
                };

                login(user, data.session.access_token);
                onSuccess?.();
                window.location.href = '/booking';
            } else {
                setError('Please check your email to confirm your account');
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/booking`
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGithubLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/booking`
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDiscordLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'discord',
                options: {
                    redirectTo: `${window.location.origin}/booking`
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Card className="w-full max-w-md glass-card animate-scale-in">
            <CardHeader className="space-y-4 pb-6">
                <div className="relative">
                    <div className="absolute inset-0 gradient-mesh opacity-20 blur-3xl rounded-full"></div>
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl gradient-accent mx-auto shadow-glow">
                        <UserPlus className="w-10 h-10 text-white" />
                        <Stars className="w-4 h-4 text-white absolute -top-1 -right-1 animate-pulse" />
                    </div>
                </div>
                <CardTitle className="text-center text-4xl">Create Account</CardTitle>
                <CardDescription className="text-center text-base">
                    Start your cinema booking journey today
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full group hover:border-blue-500 dark:hover:border-blue-400 transition-all"
                            size="lg"
                            onClick={handleGoogleLogin}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-slate-900 text-slate-500">or register with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm animate-fade-in backdrop-blur-xl">
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-white text-xs">!</span>
                                    </div>
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="pl-14"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-14"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-14"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                Minimum 6 characters required
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5" />
                                    Create Account
                                </>
                            )}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={onToggleForm}
                                    className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
};