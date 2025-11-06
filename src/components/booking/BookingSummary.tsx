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
            setError('Please select studio and seats');
            return;
        }

        setLoading(true);
        setError(null);

        try {
          
            const supabaseToken = await getSupabaseToken();
            const localToken = localStorage.getItem('token');

            // console.log('=== Booking Debug ===');
            // console.log('User:', user);
            // console.log('Supabase token:', supabaseToken ? supabaseToken.substring(0, 20) + '...' : 'null');
            // console.log('Local token:', localToken ? localToken.substring(0, 20) + '...' : 'null');
            // console.log('Selected studio:', selectedStudio);
            // console.log('Selected seats:', selectedSeats);

            const booking = await apiClient.createOnlineBooking({
                studioId: selectedStudio,
                seatIds: selectedSeats,
            });

            console.log('Booking success:', booking);
            onSuccess?.(booking);
            clearSelection();
        } catch (err) {
            console.error('Booking error:', err);
            setError(err instanceof Error ? err.message : 'Booking failed');
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
                    <CardTitle>Booking Summary</CardTitle>
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
                            {selectedStudio ? `Studio ${selectedStudio}` : 'Not selected'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-muted-foreground">Seats</span>
                        <span className="font-medium">
                            {selectedSeats.length || 0} seat{selectedSeats.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-muted-foreground">Customer</span>
                        <span className="font-medium">{user?.name || 'Guest'}</span>
                    </div>
                </div>

                {!user && (
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/50 text-amber-600 dark:text-amber-400 text-sm">
                        Please login to complete your booking
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
                            Processing...
                        </>
                    ) : (
                        <>
                            <Ticket className="mr-2 h-4 w-4" />
                            Confirm Booking
                        </>
                    )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    You'll receive a QR code after booking
                </p>
            </CardContent>
        </Card>
    );
};