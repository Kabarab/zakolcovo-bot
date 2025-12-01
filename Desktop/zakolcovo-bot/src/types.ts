
export type Flow = 'IDLE' | 'BOOKING' | 'ORDERING' | 'CHECKOUT';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface BookingDetails {
  guests?: string;
  date?: string;
  time?: string;
  name?: string;
  phone?: string;
}

export type BookingStep = keyof BookingDetails;

export interface UserState {
  flow: Flow;
  bookingDetails: BookingDetails;
  bookingStep: BookingStep | 'CONFIRMED' | null;
  cart: CartItem[];
}
