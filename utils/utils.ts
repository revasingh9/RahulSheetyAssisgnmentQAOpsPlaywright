


const enum BookingStatus  {
  CONFIRMED='confirmed',
  PENDING = 'pending',
  CANCELLED ='cancelled'
};
 
export interface BookingPayload {
  name: string;
  email: string;
  phone: string;
  ticketCount: number;
  status: BookingStatus;
  createdAt: string;
}
export function buildBookingPayload
(name: string,
     email: string,
    phone: string,
    ticketCount: number,
    status: BookingStatus) :
  BookingPayload{
    return {
    name,
    email,
    phone,
    ticketCount,
    status,
    createdAt: new Date().toISOString()
  };
}
 
export function isConfirmed(payload: BookingPayload): boolean {
  return payload.status === BookingStatus.CONFIRMED;
}
 
