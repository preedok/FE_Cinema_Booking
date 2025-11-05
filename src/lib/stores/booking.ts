import { create } from 'zustand';
import type { BookingStore } from '../../types';

export const useBookingStore = create<BookingStore>((set) => ({
    selectedStudio: null,
    selectedSeats: [],

    setSelectedStudio: (studioId) => {
        set({ selectedStudio: studioId, selectedSeats: [] });
    },

    toggleSeat: (seatId) => {
        set((state) => {
            const isSelected = state.selectedSeats.includes(seatId);

            if (isSelected) {
                return {
                    selectedSeats: state.selectedSeats.filter((id) => id !== seatId),
                };
            } else {
                return {
                    selectedSeats: [...state.selectedSeats, seatId],
                };
            }
        });
    },

    clearSelection: () => {
        set({ selectedStudio: null, selectedSeats: [] });
    },
}));