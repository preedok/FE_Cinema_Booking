import React, { useState } from 'react';
import { Ticket, MapPin, Users, Calendar, QrCode, Download, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Booking } from '../../types';
import { formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface BookingCardProps {
    booking: Booking;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
    const [showQR, setShowQR] = useState(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = booking.qr_code;
        link.download = `tiket-${booking.booking_code}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const statusColors = {
        active: 'bg-green-500/10 text-green-600 border-green-500/20',
        used: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
    };

    const statusTranslation = {
        active: 'Aktif',
        used: 'Terpakai',
        cancelled: 'Dibatalkan',
    };

    return (
        <>
            <Card className="border-2 hover:shadow-xl transition-all">
                <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg gradient-primary">
                                <Ticket className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Studio {booking.studio_id}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {booking.booking_type === 'online' ? 'Pemesanan Online' : 'Pemesanan Offline'}
                                </p>
                            </div>
                        </div>

                        <span className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium border capitalize',
                            statusColors[booking.status]
                        )}>
                            {statusTranslation[booking.status]}
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Studio</p>
                                <p className="text-sm font-medium">Studio {booking.studio_id}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Kursi</p>
                                <p className="text-sm font-medium">{booking.seat_ids.length} kursi</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 col-span-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Dipesan pada</p>
                                <p className="text-sm font-medium">{formatDate(booking.created_at)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Kode Booking</p>
                        <p className="font-mono text-xs break-all">{booking.booking_code}</p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => setShowQR(true)}
                            variant="outline"
                            className="flex-1"
                            size="sm"
                        >
                            <QrCode className="w-4 h-4 mr-2" />
                            Lihat QR
                        </Button>
                        <Button
                            onClick={handleDownload}
                            variant="outline"
                            size="sm"
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>


            {showQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <Card className="w-full max-w-md border-2 shadow-2xl relative">
                        <button
                            onClick={() => setShowQR(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 space-y-4">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-2">Tiket Anda</h3>
                                <p className="text-sm text-muted-foreground">Tunjukkan kode QR ini di pintu masuk</p>
                            </div>

                            <div className="flex justify-center p-6 bg-white rounded-xl">
                                <img
                                    src={booking.qr_code}
                                    alt="Kode QR"
                                    className="w-64 h-64"
                                />
                            </div>

                            <div className="p-3 rounded-lg bg-muted/50">
                                <p className="text-xs text-muted-foreground text-center mb-1">Kode Booking</p>
                                <p className="font-mono text-sm text-center break-all">{booking.booking_code}</p>
                            </div>

                            <Button
                                onClick={handleDownload}
                                className="w-full"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Unduh Kode QR
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};