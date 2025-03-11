import { gql } from '@apollo/client';

export const CREATE_GIFT = gql`
  mutation CreateGift($input: CreateGiftInput!) {
    createGift(input: $input) {
      id
      recipientEmail
      redemptionCode
      status
      message
      startDate
      endDate
      property {
        id
        title
        images
      }
      sender {
        id
        fullName
        email
      }
      recipient {
        id
        fullName
        email
      }
    }
  }
`;

export const REDEEM_GIFT = gql`
  mutation RedeemGift($input: RedeemGiftInput!) {
    redeemGift(input: $input) {
      id
      status
      startDate
      endDate
      property {
        id
        title
        images
      }
      sender {
        id
        fullName
      }
    }
  }
`;

export const GET_SENT_GIFTS = gql`
  query GetSentGifts {
    sentGifts {
      id
      recipientEmail
      status
      message
      startDate
      endDate
      property {
        id
        title
        images
      }
      recipient {
        id
        fullName
        email
      }
    }
  }
`;

export const GET_RECEIVED_GIFTS = gql`
  query GetReceivedGifts {
    receivedGifts {
      id
      status
      message
      startDate
      endDate
      property {
        id
        title
        images
      }
      sender {
        id
        fullName
        email
      }
    }
  }
`;

export const GET_GIFT = gql`
  query GetGift($id: ID!) {
    gift(id: $id) {
      id
      recipientEmail
      redemptionCode
      status
      message
      startDate
      endDate
      property {
        id
        title
        description
        images
        address
        city
        state
        amenities
      }
      sender {
        id
        fullName
        email
      }
      recipient {
        id
        fullName
        email
      }
    }
  }
`; 