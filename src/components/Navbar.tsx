import React, { useEffect, useState } from 'react';
import { Film, User, LogOut, Ticket, Menu, X, Sparkles, QrCode, ChevronDown, CreditCard, Smartphone } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuthStore } from '../lib/stores/auth';

export const Navbar: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [bookingDropdownOpen, setBookingDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, isAuthenticated, logout, initAuth } = useAuthStore();

    useEffect(() => {
        initAuth();
        setMounted(true);

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    if (!mounted) {
        return (
            <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-2xl gradient-primary">
                                <Film className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-2xl">CinemaBook</span>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'glass backdrop-blur-2xl shadow-xl border-b border-slate-200/50 dark:border-slate-700/50'
            : 'bg-transparent border-b border-transparent'
            }`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">

                    <a href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 gradient-primary opacity-20 blur-xl rounded-full group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative p-2.5 rounded-2xl gradient-primary group-hover:scale-110 transition-transform shadow-glow">
                                <Film className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <span className="font-bold text-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            CinemaBook
                        </span>
                        <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
                    </a>


                    <div className="hidden md:flex items-center gap-2">

                        <div className="relative">
                            <button
                                onClick={() => setBookingDropdownOpen(!bookingDropdownOpen)}
                                className="px-5 py-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium flex items-center gap-2 hover-lift"
                            >
                                <Ticket className="w-4 h-4" />
                                Pesan Tiket
                                <ChevronDown className={`w-4 h-4 transition-transform ${bookingDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {bookingDropdownOpen && (
                                <div className="absolute top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-fade-in">
                                    <a
                                        href="/booking"
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        onClick={() => setBookingDropdownOpen(false)}
                                    >
                                        <Smartphone className="w-4 h-4 text-primary" />
                                        <div>
                                            <div className="font-medium">Pemesanan Online</div>
                                            <div className="text-xs text-muted-foreground">Pesan tiket secara online</div>
                                        </div>
                                    </a>
                                    <a
                                        href="/booking-offline"
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        onClick={() => setBookingDropdownOpen(false)}
                                    >
                                        <CreditCard className="w-4 h-4 text-primary" />
                                        <div>
                                            <div className="font-medium">Pemesanan Offline</div>
                                            <div className="text-xs text-muted-foreground">Pembelian langsung</div>
                                        </div>
                                    </a>
                                </div>
                            )}
                        </div>

                        <a
                            href="/validate"
                            className="px-5 py-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium flex items-center gap-2 hover-lift"
                        >
                            <QrCode className="w-4 h-4" />
                            Validasi
                        </a>
                        {isAuthenticated ? (
                            <>
                                <a
                                    href="/my-bookings"
                                    className="px-5 py-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium flex items-center gap-2 hover-lift"
                                >
                                    <Ticket className="w-4 h-4" />
                                    Tiket Saya
                                </a>

                                <div className="flex items-center gap-3 pl-4 ml-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                                        </div>
                                        <span className="text-sm font-semibold max-w-[120px] truncate">{user?.name}</span>
                                    </div>

                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Keluar
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 ml-2">
                                <Button
                                    onClick={() => window.location.href = '/auth'}
                                    variant="ghost"
                                    size="sm"
                                >
                                    Masuk
                                </Button>
                                <Button
                                    onClick={() => window.location.href = '/auth?register=true'}
                                    size="sm"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Daftar Sekarang
                                </Button>
                            </div>
                        )}
                    </div>


                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>


                {mobileMenuOpen && (
                    <div className="md:hidden py-6 space-y-3 border-t border-slate-200 dark:border-slate-700 animate-fade-in">

                        <div className="px-5 space-y-2">
                            <div className="text-sm font-semibold text-muted-foreground mb-2">Pesan Tiket</div>
                            <a
                                href="/booking"
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
                            >
                                <Smartphone className="w-4 h-4" />
                                Pemesanan Online
                            </a>
                            <a
                                href="/booking-offline"
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
                            >
                                <CreditCard className="w-4 h-4" />
                                Pemesanan Offline
                            </a>
                        </div>

                        <a
                            href="/validate"
                            className=" px-5 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium flex items-center gap-2"
                        >
                            <QrCode className="w-4 h-4" />
                            Validasi
                        </a>

                        {isAuthenticated ? (
                            <>
                                <a
                                    href="/my-bookings"
                                    className=" px-5 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium flex items-center gap-2"
                                >
                                    <Ticket className="w-4 h-4" />
                                    Tiket Saya
                                </a>

                                <div className="px-5 py-4 space-y-4 border-t border-slate-200 dark:border-slate-700 mt-4 pt-6">
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{user?.name}</p>
                                            <p className="text-xs text-slate-500">Online</p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Keluar
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="px-5 space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <Button
                                    onClick={() => window.location.href = '/auth'}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Masuk
                                </Button>
                                <Button
                                    onClick={() => window.location.href = '/auth?register=true'}
                                    className="w-full"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Daftar Sekarang
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};