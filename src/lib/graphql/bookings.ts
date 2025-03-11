import { gql } from '@apollo/client';

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      checkInDate
      checkOutDate
      totalPrice
      status
      paymentStatus
      additionalServices
      specialRequests
      property {
        id
        title
        images
      }
    }
  }
`;

export const GET_USER_BOOKINGS = gql`
  query GetUserBookings($filters: BookingFilterInput) {
    bookings(filters: $filters) {
      id
      checkInDate
      checkOutDate
      totalPrice
      status
      paymentStatus
      additionalServices
      specialRequests
      property {
        id
        title
        images
      }
    }
  }
`;

export const GET_BOOKING = gql`
  query GetBooking($id: String!) {
    booking(id: $id) {
      id
      checkInDate
      checkOutDate
      totalPrice
      status
      paymentStatus
      additionalServices
      additionalServicesPrice
      specialRequests
      property {
        id
        title
        images
        price
        address
        city
        state
      }
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: String!) {
    cancelBooking(id: $id) {
      id
      status
      paymentStatus
    }
  }
`; 