import React, { useEffect, useState } from 'react';
import { Armchair, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { apiClient } from '../../lib/api';
import { useBookingStore } from '../../lib/stores/booking';
import { groupSeatsByRow } from '../../lib/utils';
import type { Seat } from '../../types';
import { cn } from '../../lib/utils';

export const SeatSelector: React.FC = () => {
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(false);
    const { selectedStudio, selectedSeats, toggleSeat } = useBookingStore();

    useEffect(() => {
        if (selectedStudio) {
            loadSeats();
        }
    }, [selectedStudio]);

    const loadSeats = async () => {
        if (!selectedStudio) return;

        setLoading(true);
        try {
            const data = await apiClient.getStudioSeats(selectedStudio);
            setSeats(data);
        } catch (error) {
            console.error('Failed to load seats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!selectedStudio) {
        return (
            <Card className="border-2 border-dashed">
                <CardContent className="p-12 text-center">
                    <Armchair className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">
                        Please select a studio first
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="animate-pulse space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex gap-2">
                                {[...Array(20)].map((_, j) => (
                                    <div key={j} className="w-10 h-10 bg-muted rounded" />
                                ))}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const groupedSeats = groupSeatsByRow(seats);
    const rows = Array.from(groupedSeats.keys()).sort();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                    <Armchair className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Select Seats</h2>
                    <p className="text-sm text-muted-foreground">
                        {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
                    </p>
                </div>
            </div>

            <Card className="overflow-hidden">
                <CardContent className="p-8">
                    
                    <div className="mb-8">
                        <div className="h-2 gradient-primary rounded-full mx-auto max-w-3xl shadow-lg shadow-primary/50" />
                        <p className="text-center text-sm text-muted-foreground mt-2">SCREEN</p>
                    </div>

                    
                    <div className="space-y-3 max-w-fit mx-auto">
                        {rows.map((row) => (
                            <div key={row} className="flex items-center gap-2">
                                <span className="w-6 text-center font-semibold text-muted-foreground">
                                    {row}
                                </span>
                                <div className="flex gap-2">
                                    {groupedSeats.get(row)?.map((seat) => {
                                        const isSelected = selectedSeats.includes(seat.id);
                                        const isAvailable = seat.is_available;

                                        return (
                                            <button
                                                key={seat.id}
                                                onClick={() => isAvailable && toggleSeat(seat.id)}
                                                disabled={!isAvailable}
                                                className={cn(
                                                    'w-10 h-10 rounded-lg transition-all relative group',
                                                    'flex items-center justify-center',
                                                    isAvailable
                                                        ? isSelected
                                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/50 scale-110'
                                                            : 'bg-muted hover:bg-muted/80 hover:scale-105'
                                                        : 'bg-destructive/20 cursor-not-allowed opacity-50'
                                                )}
                                                title={`${seat.seat_number} - ${isAvailable ? 'Available' : 'Occupied'}`}
                                            >
                                                {isSelected ? (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                ) : !isAvailable ? (
                                                    <XCircle className="w-5 h-5 text-destructive" />
                                                ) : (
                                                    <Armchair className="w-5 h-5" />
                                                )}

                                                
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                    {seat.seat_number}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    
                    <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                <Armchair className="w-4 h-4" />
                            </div>
                            <span className="text-sm">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="text-sm">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center opacity-50">
                                <XCircle className="w-4 h-4 text-destructive" />
                            </div>
                            <span className="text-sm">Occupied</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};