import React, { useState } from 'react';
import { Ticket, Loader2, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { apiClient } from '../../lib/api';
import { useBookingStore } from '../../lib/stores/booking';
import { useAuthStore } from '../../lib/stores/auth';
import { getSupabaseToken } from '../../lib/supabase';
import type { BookingResponse } from '../../types';

interface BookingSummaryProps {
    onSuccess?: (booking: BookingResponse) => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { selectedStudio, selectedSeats, clearSelection } = useBookingStore();
    const { user } = useAuthStore();

    const handleBooking = async () => {
        if (!selectedStudio || selectedSeats.length === 0) {
            setError('Silakan pilih studio dan kursi');
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const supabaseToken = await getSupabaseToken();
            const localToken = localStorage.getItem('token');

            const booking = await apiClient.createOnlineBooking({
                studioId: selectedStudio,
                seatIds: selectedSeats,
            });

            console.log('Booking success:', booking);
            onSuccess?.(booking);
            clearSelection();
        } catch (err) {
            console.error('Booking error:', err);
            setError(err instanceof Error ? err.message : 'Pemesanan gagal');
        } finally {
            setLoading(false);
        }
    };

    const canBook = selectedStudio && selectedSeats.length > 0 && user;

    return (
        <Card className="sticky top-4 border-2">
            <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg gradient-primary">
                        <Ticket className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Ringkasan Pemesanan</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive text-sm animate-fade-in">
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

                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-muted-foreground">Pelanggan</span>
                        <span className="font-medium">{user?.name || 'Tamu'}</span>
                    </div>
                </div>

                {!user && (
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/50 text-amber-600 dark:text-amber-400 text-sm">
                        Silakan masuk untuk menyelesaikan pemesanan Anda
                    </div>
                )}

                <Button
                    onClick={handleBooking}
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
                            Konfirmasi Pemesanan
                        </>
                    )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    Anda akan menerima kode QR setelah pemesanan
                </p>
            </CardContent>
        </Card>
    );
};