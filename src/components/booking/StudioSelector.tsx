import React, { useEffect, useState } from 'react';
import { Film, Users, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { apiClient } from '../../lib/api';
import { useBookingStore } from '../../lib/stores/booking';
import type { Studio } from '../../types';
import { cn } from '../../lib/utils';

export const StudioSelector: React.FC = () => {
    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);
    const { selectedStudio, setSelectedStudio } = useBookingStore();

    useEffect(() => {
        loadStudios();
    }, []);

    const loadStudios = async () => {
        try {
            const data = await apiClient.getStudios();
            setStudios(data);
        } catch (error) {
            console.error('Failed to load studios:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(5)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-20 bg-muted rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                    <Film className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Select Studio</h2>
                    <p className="text-sm text-muted-foreground">Choose your preferred viewing room</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {studios.map((studio) => (
                    <Card
                        key={studio.id}
                        className={cn(
                            'cursor-pointer transition-all hover:scale-105 border-2',
                            selectedStudio === studio.id
                                ? 'border-primary ring-4 ring-primary/20 shadow-xl'
                                : 'border-transparent hover:border-primary/50'
                        )}
                        onClick={() => setSelectedStudio(studio.id)}
                    >
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div
                                    className={cn(
                                        'w-14 h-14 rounded-full flex items-center justify-center transition-all',
                                        selectedStudio === studio.id
                                            ? 'gradient-primary shadow-lg shadow-primary/50'
                                            : 'bg-muted'
                                    )}
                                >
                                    {selectedStudio === studio.id ? (
                                        <CheckCircle2 className="w-7 h-7 text-white" />
                                    ) : (
                                        <Film className="w-7 h-7 text-muted-foreground" />
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg">{studio.name}</h3>
                                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
                                        <Users className="w-4 h-4" />
                                        <span>{studio.total_seats} seats</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};