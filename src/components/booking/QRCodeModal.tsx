import React from 'react';
import { X, Download, CheckCircle2, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { BookingResponse } from '../../types';
import { formatDate } from '../../lib/utils';

interface QRCodeModalProps {
    booking: BookingResponse | null;
    onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ booking, onClose }) => {
    if (!booking) return null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = booking.qrCode;
        link.download = `tiket-${booking.booking.booking_code}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleViewBookings = () => {
        window.location.href = '/my-bookings';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-lg border-2 shadow-2xl animate-fade-in relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 space-y-6">

                    <div className="text-center space-y-3">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full gradient-primary mx-auto shadow-lg shadow-primary/50">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">Pemesanan Berhasil!</h2>
                        <p className="text-muted-foreground">
                            Tiket Anda telah berhasil dipesan
                        </p>
                    </div>


                    <div className="flex justify-center p-6 bg-white rounded-xl">
                        <img
                            src={booking.qrCode}
                            alt="Kode QR"
                            className="w-64 h-64"
                        />
                    </div>


                    <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Studio</p>
                                <p className="font-semibold">Studio {booking.booking.studio_id}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Kursi</p>
                                <p className="font-semibold">
                                    {booking.booking.seat_ids.length} kursi
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Tanggal Pemesanan</p>
                                <p className="font-semibold">{formatDate(booking.booking.created_at)}</p>
                            </div>
                        </div>
                    </div>


                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-sm text-muted-foreground text-center mb-1">Kode Booking</p>
                        <p className="font-mono text-center font-semibold break-all">
                            {booking.booking.booking_code}
                        </p>
                    </div>


                    <div className="flex gap-3">
                        <Button
                            onClick={handleDownload}
                            variant="outline"
                            className="flex-1"
                            size="lg"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Unduh QR
                        </Button>
                        <Button
                            onClick={handleViewBookings}
                            className="flex-1"
                            size="lg"
                        >
                            Lihat Tiket Saya
                        </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                        Tunjukkan kode QR ini di pintu masuk untuk mengakses kursi Anda
                    </p>
                </div>
            </Card>
        </div>
    );
};