import React, { useState } from 'react';
import { LogIn, Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { apiClient } from '../../lib/api';
import { useAuthStore } from '../../lib/stores/auth';
import type { LoginForm as LoginFormType } from '../../types';

interface LoginFormProps {
    onSuccess?: () => void;
    onToggleForm?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onToggleForm }) => {
    const [formData, setFormData] = useState<LoginFormType>({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await apiClient.login(formData);
            login(response.user, response.token);
            onSuccess?.();
            window.location.href = '/booking';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Card className="w-full max-w-md glass-card animate-scale-in">
            <CardHeader className="space-y-4 pb-6">
                <div className="relative">
                    <div className="absolute inset-0 gradient-mesh opacity-20 blur-3xl rounded-full"></div>
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl gradient-primary mx-auto shadow-glow">
                        <LogIn className="w-10 h-10 text-white" />
                        <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-1 animate-pulse" />
                    </div>
                </div>
                <CardTitle className="text-center text-4xl">Welcome Back</CardTitle>
                <CardDescription className="text-center text-base">
                    Sign in to continue your journey
                </CardDescription>
            </CardHeader>
            <CardContent>
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
                            />
                        </div>
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
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn className="h-5 w-5" />
                                Sign In
                            </>
                        )}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-slate-900 text-slate-500">or</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={onToggleForm}
                                className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
                            >
                                Sign up free
                            </button>
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};