import type {
    AuthResponse,
    RegisterForm,
    LoginForm,
    Studio,
    Seat,
    BookingResponse,
    OnlineBookingForm,
    OfflineBookingForm,
    ValidationResponse,
    Booking,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
    private getHeaders(includeAuth = false): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (includeAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'An error occurred' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    
    async register(data: RegisterForm): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse<AuthResponse>(response);
    }

    async login(data: LoginForm): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse<AuthResponse>(response);
    }

   
    async getStudios(): Promise<Studio[]> {
        const response = await fetch(`${API_BASE_URL}/cinema/studios`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Studio[]>(response);
    }

    async getStudioSeats(studioId: number): Promise<Seat[]> {
        const response = await fetch(`${API_BASE_URL}/cinema/studios/${studioId}/seats`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Seat[]>(response);
    }

    
    async createOnlineBooking(data: OnlineBookingForm): Promise<BookingResponse> {
        const response = await fetch(`${API_BASE_URL}/booking/online`, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(data),
        });
        return this.handleResponse<BookingResponse>(response);
    }

    async createOfflineBooking(data: OfflineBookingForm): Promise<BookingResponse> {
        const response = await fetch(`${API_BASE_URL}/booking/offline`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse<BookingResponse>(response);
    }

    async validateBooking(bookingCode: string): Promise<ValidationResponse> {
        const response = await fetch(`${API_BASE_URL}/booking/validate`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ bookingCode }),
        });
        return this.handleResponse<ValidationResponse>(response);
    }

    async getMyBookings(): Promise<Booking[]> {
        const response = await fetch(`${API_BASE_URL}/booking/my-bookings`, {
            headers: this.getHeaders(true),
        });
        return this.handleResponse<Booking[]>(response);
    }
}

export const apiClient = new ApiClient();
