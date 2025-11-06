import React, { useState } from 'react';
import { Ticket, User, Mail, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { apiClient } from '../../lib/api';
import { useBookingStore } from '../../lib/stores/booking';
import type { BookingResponse } from '../../types';

interface OfflineBookingSummaryProps {
    onSuccess?: (booking: BookingResponse) => void;
}

export const OfflineBookingSummary: React.FC<OfflineBookingSummaryProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');

    const { selectedStudio, selectedSeats, clearSelection } = useBookingStore();

    const handleOfflineBooking = async () => {
        if (!selectedStudio || selectedSeats.length === 0) {
            setError('Silakan pilih studio dan kursi');
            return;
        }

        if (!customerName.trim() || !customerEmail.trim()) {
            setError('Silakan lengkapi informasi pelanggan');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const booking = await apiClient.createOfflineBooking({
                studioId: selectedStudio,
                seatIds: selectedSeats,
                customerName: customerName.trim(),
                customerEmail: customerEmail.trim(),
            });

            onSuccess?.(booking);
            clearSelection();
            setCustomerName('');
            setCustomerEmail('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Pemesanan gagal');
        } finally {
            setLoading(false);
        }
    };

    const canBook = selectedStudio && selectedSeats.length > 0 && customerName.trim() && customerEmail.trim();

    return (
        <Card className="sticky top-4 border-2">
            <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg gradient-primary">
                        <Ticket className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Pemesanan Offline</CardTitle>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-muted-foreground">Studio</span>
                        <span className="font-medium">
                            {selectedStudio ? `Studio ${selectedStudio}` : 'Belum dipilih'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-muted-foreground">Kursi</span>
                        <span className="font-medium">
                            {selectedSeats.length || 0} kursi
                        </span>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm">Informasi Pelanggan</h4>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4" />
                                <span>Nama Pelanggan</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Masukkan nama pelanggan"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            <div className="flex items-center gap-2 mb-1">
                                <Mail className="w-4 h-4" />
                                <span>Email Pelanggan</span>
                            </div>
                            <input
                                type="email"
                                placeholder="Masukkan email pelanggan"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </label>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/50 text-blue-600 dark:text-blue-400 text-sm">
                    <p className="font-medium mb-1">Pemesanan Offline</p>
                    <p className="text-xs">Pemesanan ini akan diproses sebagai pembelian langsung</p>
                </div>

                <Button
                    onClick={handleOfflineBooking}
                    disabled={!canBook || loading}
                    className="w-full"
                    size="lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            <Ticket className="mr-2 h-4 w-4" />
                            Konfirmasi Pemesanan Offline
                        </>
                    )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    Pelanggan akan menerima konfirmasi pemesanan melalui email
                </p>
            </CardContent>
        </Card>
    );
};