import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function getSeatRow(seatNumber: string): string {
    return seatNumber.charAt(0);
}

export function getSeatColumn(seatNumber: string): number {
    return parseInt(seatNumber.slice(1));
}

export function groupSeatsByRow(seats: any[]): Map<string, any[]> {
    const grouped = new Map<string, any[]>();

    seats.forEach((seat) => {
        const row = getSeatRow(seat.seat_number);
        if (!grouped.has(row)) {
            grouped.set(row, []);
        }
        grouped.get(row)!.push(seat);
    });

    
    grouped.forEach((rowSeats) => {
        rowSeats.sort((a, b) =>
            getSeatColumn(a.seat_number) - getSeatColumn(b.seat_number)
        );
    });

    return grouped;
}