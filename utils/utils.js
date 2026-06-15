const BookingStatus = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled'
};
 
function buildBookingPayload(name, email, phone, ticketCount, status) {
  return {
    name: name,
    email: email,
    phone: phone,
    ticketCount: ticketCount,
    status: status,
    createdAt: new Date().toISOString()
  };
}
 
function isConfirmed(payload) {
  return payload.status === BookingStatus.CONFIRMED;
}
 
module.exports = { BookingStatus, buildBookingPayload, isConfirmed };