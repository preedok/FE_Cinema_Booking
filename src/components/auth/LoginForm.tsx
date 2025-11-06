import React, { useState, useEffect } from 'react';
import { LogIn, Mail, Lock, Loader2, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { supabase } from '../../lib/supabase';
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
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const login = useAuthStore((state) => state.login);

    useEffect(() => {
   
        checkGoogleSession();

        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');

            if (event === 'SIGNED_IN' && session) {
            
                const isGoogleAuth = session.user.app_metadata.provider === 'google';

                if (isGoogleAuth) {
                    console.log('=== Google OAuth Sign In ===');
                    console.log('User email:', session.user.email);
                    console.log('Supabase token:', session.access_token.substring(0, 30) + '...');

                    const userData = {
                        id: session.user.id,
                        email: session.user.email!,
                        name: session.user.user_metadata.full_name || session.user.user_metadata.name || session.user.email!.split('@')[0],
                        role: 'customer' as const,
                        google_id: session.user.user_metadata.sub,
                        avatar: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
                        created_at: session.user.created_at,
                        updated_at: new Date().toISOString(),
                    };

                   
                    login(userData, session.access_token);

                    console.log('✓ Token stored:', localStorage.getItem('token')?.substring(0, 30) + '...');

                    setIsGoogleLoading(false);

                
                    setTimeout(() => {
                        window.location.href = '/booking';
                    }, 1000);
                }
            } else if (event === 'SIGNED_OUT') {
                console.log('User signed out');
                setIsGoogleLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const checkGoogleSession = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error getting session:', error);
                return;
            }

            if (session?.user) {
        
                const isGoogleAuth = session.user.app_metadata.provider === 'google';

                if (isGoogleAuth) {
                    console.log('Existing Google session found:', session.user.email);
                    console.log('Supabase token:', session.access_token.substring(0, 20) + '...');

                    try {
                  
                        const backendAuth = await apiClient.exchangeSupabaseToken(session.access_token);

                        console.log('Backend token received:', backendAuth.token.substring(0, 20) + '...');

                     
                        login(backendAuth.user, backendAuth.token);

                    
                        console.log('Token stored in localStorage:', localStorage.getItem('token')?.substring(0, 20) + '...');

                        window.location.href = '/booking';
                    } catch (error) {
                        console.error('Token exchange failed:', error);
                     
                        await supabase.auth.signOut();
                    }
                }
            }
        } catch (err) {
            console.error('Error checking session:', err);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        setError(null);

        try {
            console.log('Initiating Google OAuth...');
            console.log('Current URL:', window.location.href);
            console.log('Origin:', window.location.origin);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/auth',
                    skipBrowserRedirect: false,
                }
            });

            if (error) {
                console.error('OAuth error:', error);
                throw error;
            }

            console.log('OAuth response:', data);

    

        } catch (err) {
            console.error('Google login error:', err);
            setError(err instanceof Error ? err.message : 'Gagal memulai login Google');
            setIsGoogleLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
     
            const response = await apiClient.loginManual({
                email: formData.email,
                password: formData.password,
            });

            if (response.user && response.token) {
                login(response.user, response.token);
                onSuccess?.();
                window.location.href = '/booking';
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Login gagal. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-indigo-600/20 blur-3xl animate-pulse opacity-50"></div>

            <Card className="relative w-full max-w-md backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-2 border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden animate-scale-in">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"></div>

                <CardHeader className="space-y-6 pb-8 pt-10">
                    <div className="relative mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
                        <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 shadow-xl transform hover:scale-110 transition-transform duration-500">
                            <LogIn className="w-12 h-12 text-white" strokeWidth={2.5} />
                            <Sparkles className="w-5 h-5 text-white absolute -top-2 -right-2 animate-bounce" />
                        </div>
                    </div>

                    <div className="text-center space-y-3">
                        <CardTitle className="text-5xl font-black bg-gradient-to-r from-slate-900 via-violet-800 to-purple-900 dark:from-white dark:via-violet-200 dark:to-purple-200 bg-clip-text text-transparent">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                            Masuk untuk melanjutkan petualangan Anda
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                    {isGoogleLoading && (
                        <div className="mb-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm text-center">
                            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                            <p>Menghubungkan ke Google...</p>
                        </div>
                    )}

                
                  

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border-2 border-red-500/50 p-4 animate-shake">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <span className="text-white text-sm font-bold">!</span>
                                    </div>
                                    <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                Alamat Email
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'email' ? 'opacity-30' : ''}`}></div>
                                <div className="relative">
                                    <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'email' ? 'text-violet-600 scale-110' : 'text-slate-400'}`} />
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="nama@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="pl-14 h-14 text-base rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-500 transition-all bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'password' ? 'opacity-30' : ''}`}></div>
                                <div className="relative">
                                    <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'password' ? 'text-violet-600 scale-110' : 'text-slate-400'}`} />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="pl-14 pr-14 h-14 text-base rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-500 transition-all bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div className="relative group pt-2">
                            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                            <Button
                                type="submit"
                                className="relative w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-95 transition-all duration-300"
                                disabled={isLoading || isGoogleLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Masuk Sekarang</span>
                                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>

                       
                    </form>
                    <div className="relative py-4 mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-6 py-1 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-500 rounded-full">
                                atau masuk dengan email
                            </span>
                        </div>
                    </div>
                    <div className="mb-6">
                        <Button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading || isLoading}
                            className="w-full h-14 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {isGoogleLoading ? (
                                <>
                                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                    <span className="font-semibold">Menghubungkan...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="font-semibold text-white">Masuk dengan Google</span>
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Belum punya akun?{' '}
                            <button
                                type="button"
                                onClick={onToggleForm}
                                className="font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors hover:underline inline-flex items-center gap-1"
                            >
                                Daftar gratis
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};