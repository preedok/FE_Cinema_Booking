import React, { useState, useRef } from 'react';
import { QrCode, CheckCircle2, XCircle, Loader2, Search, MapPin, Users, User, RefreshCw, Camera, X, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { apiClient } from '../../lib/api';
import type { ValidationResponse } from '../../types';

const QRScanner = ({ onScan, onError, onClose }: {
    onScan: (data: string) => void;
    onError: (error: string) => void;
    onClose: () => void;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationRef = useRef<number | null>(null);

    React.useEffect(() => {
        let mounted = true;

        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: 'environment' },
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                });

                if (!mounted) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();

                    videoRef.current.onloadedmetadata = () => {
                        if (mounted) {
                            setTimeout(() => {
                                startScanning();
                            }, 1000);
                        }
                    };
                }
            } catch (err) {
                console.error('Camera error:', err);
                if (mounted) {
                    onError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
                }
            }
        };

        const startScanning = () => {
            const scanFrame = () => {
                if (!mounted || !videoRef.current || !canvasRef.current) {
                    return;
                }

                const video = videoRef.current;
                const canvas = canvasRef.current;

                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    if (!ctx) return;

                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    if (typeof (window as any).jsQR !== 'undefined') {
                        const code = (window as any).jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: 'attemptBoth',
                        });

                        if (code && code.data && mounted) {
                            console.log('✅ QR Code detected:', code.data);
                            onScan(code.data);
                            return; 
                        }
                    }
                }

                if (mounted) {
                    animationRef.current = requestAnimationFrame(scanFrame);
                }
            };

            scanFrame();
        };

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/jsqr@1.4.0/dist/jsQR.js';
        script.async = true;
        script.onload = () => {
            console.log('jsQR library loaded');
            initCamera();
        };
        script.onerror = () => {
            console.error('Failed to load jsQR library');
            if (mounted) {
                onError('Gagal memuat library scanner');
            }
        };
        document.head.appendChild(script);

        return () => {
            mounted = false;
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            document.head.removeChild(script);
        };
    }, [onScan, onError]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-lg border-2 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                <div className="p-6 space-y-4">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">Pindai Kode QR</h3>
                        <p className="text-sm text-muted-foreground">
                            Arahkan kamera ke kode QR booking
                        </p>
                    </div>

                    <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            playsInline
                            muted
                            autoPlay
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative w-64 h-64">
                                <div className="absolute inset-0 border-2 border-white/30 rounded-2xl"></div>
                                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-500 rounded-tl-2xl animate-pulse"></div>
                                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-green-500 rounded-tr-2xl animate-pulse"></div>
                                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-green-500 rounded-bl-2xl animate-pulse"></div>
                                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-500 rounded-br-2xl animate-pulse"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-white text-xs bg-black/70 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                        Posisikan QR code di dalam kotak
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-green-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-medium">Memindai kode QR...</span>
                    </div>

                    <div className="text-center text-xs text-muted-foreground">
                        💡 Tip: Pastikan QR code terlihat jelas dan pencahayaan cukup
                    </div>
                </div>
            </Card>
        </div>
    );
};

interface ValidateBookingProps {
    onValidationSuccess?: (result: ValidationResponse) => void;
}

export const ValidateBooking: React.FC<ValidateBookingProps> = ({ onValidationSuccess }) => {
    const [bookingCode, setBookingCode] = useState('');
    const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showScanner, setShowScanner] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleQRScan = (data: string) => {
        console.log('QR Scanned:', data);
        setShowScanner(false);

        try {
            const parsed = JSON.parse(data);
            const code = parsed.bookingCode || parsed.booking_code || parsed.code || parsed.id;

            if (code) {
                console.log('Extracted booking code:', code);
                setBookingCode(code);
                handleValidate(code);
            } else {
                console.log('No booking code found, using raw data');
                setBookingCode(data.trim());
                handleValidate(data.trim());
            }
        } catch {
            console.log('Not JSON, using raw data');
            setBookingCode(data.trim());
            handleValidate(data.trim());
        }
    };

    const handleScanError = (errorMsg: string) => {
        setScanError(errorMsg);
        setShowScanner(false);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setScanError(null);
        setError(null);

        try {
            const image = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                image.src = e.target?.result as string;
            };

            image.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) {
                    setLoading(false);
                    return;
                }

                const context = canvas.getContext('2d', { willReadFrequently: true });
                if (!context) {
                    setLoading(false);
                    return;
                }

                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                const scanImage = () => {
                    if (typeof (window as any).jsQR !== 'undefined') {
                        const code = (window as any).jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: 'attemptBoth',
                        });

                        if (code && code.data) {
                            handleQRScan(code.data);
                        } else {
                            setScanError('Tidak dapat membaca QR code dari gambar. Pastikan gambar jelas dan QR code terlihat.');
                            setLoading(false);
                        }
                    } else {
                        const script = document.createElement('script');
                        script.src = 'https://unpkg.com/jsqr@1.4.0/dist/jsQR.js';
                        script.onload = () => scanImage();
                        script.onerror = () => {
                            setScanError('Gagal memuat library scanner');
                            setLoading(false);
                        };
                        document.head.appendChild(script);
                    }
                };

                scanImage();
            };

            image.onerror = () => {
                setScanError('Gagal memuat gambar');
                setLoading(false);
            };

            reader.readAsDataURL(file);
        } catch (err) {
            console.error('File upload error:', err);
            setScanError('Gagal memproses gambar');
            setLoading(false);
        }

        event.target.value = '';
    };

    const handleValidate = async (code?: string) => {
        const codeToValidate = code || bookingCode;

        if (!codeToValidate.trim()) {
            setError('Silakan masukkan kode booking');
            return;
        }

        setLoading(true);
        setError(null);
        setScanError(null);
        setValidationResult(null);

        try {
            console.log('Validating code:', codeToValidate);
            const result = await apiClient.validateBooking(codeToValidate.trim());
            console.log('Validation result:', result);
            setValidationResult(result);
            onValidationSuccess?.(result);
        } catch (err) {
            console.error('Validation error:', err);
            setError(err instanceof Error ? err.message : 'Validasi gagal');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleValidate();
        }
    };

    const resetValidation = () => {
        setBookingCode('');
        setValidationResult(null);
        setError(null);
        setScanError(null);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
         
            <div className="text-center space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 gradient-mesh opacity-20 blur-3xl rounded-full"></div>
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl gradient-primary mx-auto shadow-glow">
                        <QrCode className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h2 className="text-4xl font-bold">Validasi Booking</h2>
                <p className="text-muted-foreground">
                    Pindai atau masukkan kode booking untuk validasi masuk
                </p>
            </div>

            
            <Card className="border-2 glass-card">
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Kode Booking
                        </label>
                        <Input
                            type="text"
                            placeholder="Masukkan kode booking..."
                            value={bookingCode}
                            onChange={(e) => setBookingCode(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="text-center font-mono text-sm"
                            disabled={loading}
                        />
                    </div>

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

                    {scanError && (
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm animate-fade-in backdrop-blur-xl">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs">!</span>
                                </div>
                                <p>{scanError}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            onClick={() => {
                                setScanError(null);
                                setError(null);
                                setShowScanner(true);
                            }}
                            disabled={loading}
                            variant="outline"
                            size="lg"
                            className="w-full"
                        >
                            <Camera className="w-5 h-5 mr-2" />
                            Pindai
                        </Button>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                            variant="outline"
                            size="lg"
                            className="w-full"
                        >
                            <Upload className="w-5 h-5 mr-2" />
                            Upload
                        </Button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleValidate()}
                            disabled={loading || !bookingCode.trim()}
                            className="flex-1"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Memvalidasi...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5 mr-2" />
                                    Validasi
                                </>
                            )}
                        </Button>
                        {validationResult && (
                            <Button
                                onClick={resetValidation}
                                variant="outline"
                                size="lg"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

           
            {showScanner && (
                <QRScanner
                    onScan={handleQRScan}
                    onError={handleScanError}
                    onClose={() => setShowScanner(false)}
                />
            )}

          
            <canvas ref={canvasRef} className="hidden" />

        
            {validationResult && (
                <Card className={`border-2 animate-scale-in backdrop-blur-xl ${validationResult.valid
                    ? 'border-green-500/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30'
                    : 'border-red-500/50 bg-gradient-to-br from-red-50/50 to-rose-50/50 dark:from-red-950/30 dark:to-rose-950/30'
                    }`}>
                    <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${validationResult.valid ? 'bg-green-500/10' : 'bg-red-500/10'
                            }`}>
                            {validationResult.valid ? (
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            ) : (
                                <XCircle className="w-8 h-8 text-red-600" />
                            )}
                        </div>
                        <CardTitle className={`text-2xl ${validationResult.valid ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {validationResult.valid ? '✓ Booking Valid' : '✗ Booking Tidak Valid'}
                        </CardTitle>
                    </CardHeader>

                    {validationResult.valid && (
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pelanggan</p>
                                        <p className="font-semibold">{validationResult.booking.customerName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Studio</p>
                                        <p className="font-semibold">Studio {validationResult.booking.studioId}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Kursi</p>
                                        <p className="font-semibold">
                                            {validationResult.booking.seatIds.length} kursi
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                <p className="text-xs text-muted-foreground text-center mb-1">Tipe Booking</p>
                                <p className="font-semibold text-center capitalize">
                                    {validationResult.booking.bookingType === 'online' ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            )}
        </div>
    );
};