import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, Loader2, Stars, ArrowRight, Eye, EyeOff, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { apiClient } from '../../lib/api';
import { useAuthStore } from '../../lib/stores/auth';
import type { RegisterForm as RegisterFormType } from '../../types';

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
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await apiClient.register(formData);
            login(response.user, response.token);
            onSuccess?.();
            window.location.href = '/booking';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'medium' : 'weak';

    return (
        <div className="relative">
     
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl animate-pulse opacity-50"></div>

            <Card className="relative w-full max-w-md backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-2 border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden animate-scale-in">
               
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

                <CardHeader className="space-y-6 pb-8 pt-10">
                 
                    <div className="relative mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
                        <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-xl transform hover:scale-110 transition-transform duration-500">
                            <UserPlus className="w-12 h-12 text-white" strokeWidth={2.5} />
                            <Stars className="w-5 h-5 text-white absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                    </div>

                  
                    <div className="text-center space-y-3">
                        <CardTitle className="text-5xl font-black bg-gradient-to-r from-slate-900 via-purple-800 to-pink-900 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                            Bergabung Sekarang
                        </CardTitle>
                        <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                            Buat akun dan nikmati pengalaman booking terbaik
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                     
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
                                Nama Lengkap
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'name' ? 'opacity-30' : ''}`}></div>
                                <div className="relative">
                                    <User className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'name' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`} />
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        className="pl-14 h-14 text-base rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                       
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                Alamat Email
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'email' ? 'opacity-30' : ''}`}></div>
                                <div className="relative">
                                    <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'email' ? 'text-purple-600 scale-110' : 'text-slate-400'}`} />
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="nama@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="pl-14 h-14 text-base rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-500 transition-all bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
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
                                <div className={`absolute inset-0 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'password' ? 'opacity-30' : ''}`}></div>
                                <div className="relative">
                                    <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'password' ? 'text-pink-600 scale-110' : 'text-slate-400'}`} />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="pl-14 pr-14 h-14 text-base rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-pink-500 dark:focus:border-pink-500 transition-all bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                         
                            {formData.password && (
                                <div className="space-y-2 mt-3">
                                    <div className="flex gap-2">
                                        <div className={`h-1.5 flex-1 rounded-full transition-all ${formData.password.length > 0 ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                        <div className={`h-1.5 flex-1 rounded-full transition-all ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                        <div className={`h-1.5 flex-1 rounded-full transition-all ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <CheckCircle2 className={`w-4 h-4 ${formData.password.length >= 6 ? 'text-green-500' : 'text-slate-300'}`} />
                                        <span className={formData.password.length >= 6 ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}>
                                            Minimal 6 karakter
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                      
                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800">
                            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Data Anda dilindungi dengan enkripsi tingkat enterprise
                            </p>
                        </div>

                     
                        <div className="relative group pt-2">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                            <Button
                                type="submit"
                                className="relative w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-95 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <span>Membuat akun...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Daftar Sekarang</span>
                                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>

                     
                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-slate-200 dark:border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-6 py-1 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-500 rounded-full">
                                    atau
                                </span>
                            </div>
                        </div>

                     
                        <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 border border-slate-200 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Sudah punya akun?{' '}
                                <button
                                    type="button"
                                    onClick={onToggleForm}
                                    className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors hover:underline inline-flex items-center gap-1"
                                >
                                    Masuk di sini
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};