export interface User {
    id: number | string;
    email: string;
    name: string;
    role: 'customer' | 'cashier' | 'admin';
    google_id?: string; 
    avatar?: string;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface Studio {
    id: number;
    name: string;
    total_seats: number;
    created_at: string;
    updated_at: string;
}

export interface Seat {
    id: number;
    studio_id: number;
    seat_number: string;
    is_available: boolean;
    studio?: Studio;
    studio_name: string;
    created_at: string;
    updated_at: string;
}

export interface Booking {
    id: number;
    booking_code: string;
    user_id: number | null;
    user_name: string;
    user_email: string;
    studio_id: number;
    seat_ids: number[];
    qr_code: string;
    booking_type: 'online' | 'offline';
    status: 'active' | 'used' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface BookingResponse {
    booking: Booking;
    qrCode: string;
}

export interface ValidationResponse {
    valid: boolean;
    booking: {
        bookingCode: string;
        bookingType: string;
        customerName: string;
        seatIds: number[];
        studioId: number;
    };
}

export interface RegisterForm {
    email: string;
    password: string;
    name: string;
}

export interface LoginForm {
    email: string;
    password: string;
}

export interface OnlineBookingForm {
    studioId: number;
    seatIds: number[];
}

export interface OfflineBookingForm {
    studioId: number;
    seatIds: number[];
    customerName: string;
    customerEmail: string;
}

export interface GoogleAuthRequest {
    code: string;
}

export interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    initAuth: () => void;
}

export interface BookingStore {
    selectedStudio: number | null;
    selectedSeats: number[];
    setSelectedStudio: (studioId: number | null) => void;
    toggleSeat: (seatId: number) => void;
    clearSelection: () => void;
}