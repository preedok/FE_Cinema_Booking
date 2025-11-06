import React, { useState } from 'react';
import { QrCode, CheckCircle2, XCircle, Loader2, Search, MapPin, Users, User, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { apiClient } from '../../lib/api';
import type { ValidationResponse } from '../../types';

interface ValidateBookingProps {
    onValidationSuccess?: (result: ValidationResponse) => void;
}

export const ValidateBooking: React.FC<ValidateBookingProps> = ({ onValidationSuccess }) => {
    const [bookingCode, setBookingCode] = useState('');
    const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleValidate = async () => {
        if (!bookingCode.trim()) {
            setError('Please enter a booking code');
            return;
        }

        setLoading(true);
        setError(null);
        setValidationResult(null);

        try {
            const result = await apiClient.validateBooking(bookingCode.trim());
            setValidationResult(result);
            onValidationSuccess?.(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Validation failed');
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
                <h2 className="text-4xl font-bold">Validate Booking</h2>
                <p className="text-muted-foreground">
                    Scan or enter booking code to validate entry
                </p>
            </div>

         
            <Card className="border-2 glass-card">
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Booking Code
                        </label>
                        <Input
                            type="text"
                            placeholder="Enter booking code..."
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

                    <div className="flex gap-2">
                        <Button
                            onClick={handleValidate}
                            disabled={loading || !bookingCode.trim()}
                            className="flex-1"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Validating...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5 mr-2" />
                                    Validate
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
                            {validationResult.valid ? '✓ Valid Booking' : '✗ Invalid Booking'}
                        </CardTitle>
                    </CardHeader>

                    {validationResult.valid && (
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Customer</p>
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
                                        <p className="text-sm text-muted-foreground">Seats</p>
                                        <p className="font-semibold">
                                            {validationResult.booking.seatIds.length} seat{validationResult.booking.seatIds.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                <p className="text-xs text-muted-foreground text-center mb-1">Booking Type</p>
                                <p className="font-semibold text-center capitalize">
                                    {validationResult.booking.bookingType}
                                </p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            )}
        </div>
    );
};