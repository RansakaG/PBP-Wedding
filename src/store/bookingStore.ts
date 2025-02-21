import { create } from 'zustand';
import { Package, Booking, PhotoStatus } from '../types';

interface BookingStore {
  packages: Package[];
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  updatePhotoStatus: (bookingId: string, photoId: string, status: PhotoStatus) => void;
  togglePhotoSelection: (bookingId: string, photoId: string) => void;
  updatePhotoCount: (bookingId: string, type: 'printed' | 'delivered', count: number) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  packages: [
    {
      id: 'basic-digital-engagement',
      name: 'Basic Digital Engagement Package',
      category: 'Engagement',
      description: 'A perfect package for couples looking for digital memories of their engagement.',
      features: [
        'Pre-engagement couple shoot',
        'Full engagement function coverage',
        '6 hours exclusive coverage',
        '30 professionally edited couple photos',
        'One 12x18 classic wooden enlargement',
        'Lifetime warranty on album prints',
        'Digital album within two months',
        'Professional editing and enhancement',
        'High-resolution digital files'
      ]
    },
    {
      id: 'standard-engagement-album',
      name: 'Standard Engagement Package with Album',
      category: 'Engagement',
      description: 'Complete engagement coverage with premium printed album and digital memories.',
      features: [
        'Pre-engagement couple shoot',
        'Full engagement function coverage',
        '6 hours exclusive coverage',
        'Premium 10x24 magazine album (40 pages)',
        'Album box or leather pouch included',
        'All digital soft copies',
        'Professionally designed album prints',
        'Lifetime warranty on prints',
        'Professional editing and enhancement'
      ]
    },
    {
      id: 'premium-wedding-full',
      name: 'Premium Wedding Full Package',
      category: 'Wedding',
      description: 'A complete wedding day package with premium coverage and deliverables.',
      features: [
        'Full day coverage (10 hours)',
        'Bride & groom couple shoot',
        'Two active photographers',
        'Main photographer: Prauda Buwaneka',
        'Wedding magazine album (12x30 or 16x24, 50 pages)',
        'Album with wood box or leather pouch',
        '100 thanking cards (4x6)',
        'One 16x24 wooden enlargement OR two 12x18',
        'All edited photos on USB drive',
        'Professional pre- and post-processing',
        'High-resolution digital files'
      ]
    }
  ],
  bookings: [],
  addBooking: (booking) => set((state) => ({
    bookings: [...state.bookings, booking]
  })),
  updateBookingStatus: (id, status) => set((state) => ({
    bookings: state.bookings.map((booking) =>
      booking.id === id ? { ...booking, status } : booking
    )
  })),
  updatePhotoStatus: (bookingId, photoId, status) => set((state) => ({
    bookings: state.bookings.map((booking) =>
      booking.id === bookingId
        ? {
            ...booking,
            photos: booking.photos.map((photo) =>
              photo.id === photoId ? { ...photo, status } : photo
            )
          }
        : booking
    )
  })),
  togglePhotoSelection: (bookingId, photoId) => set((state) => ({
    bookings: state.bookings.map((booking) =>
      booking.id === bookingId
        ? {
            ...booking,
            photos: booking.photos.map((photo) =>
              photo.id === photoId ? { ...photo, selected: !photo.selected } : photo
            ),
            selectedPhotos: booking.photos.reduce(
              (count, photo) => count + (photo.id === photoId ? (photo.selected ? -1 : 1) : 0),
              booking.selectedPhotos
            )
          }
        : booking
    )
  })),
  updatePhotoCount: (bookingId, type, count) => set((state) => ({
    bookings: state.bookings.map((booking) =>
      booking.id === bookingId
        ? {
            ...booking,
            [type === 'printed' ? 'printedPhotos' : 'deliveredPhotos']: count
          }
        : booking
    )
  }))
}));