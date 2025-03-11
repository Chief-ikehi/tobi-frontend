import { gql } from '@apollo/client';

export const GET_INVESTMENT_PROPERTIES = gql`
  query GetInvestmentProperties {
    investmentProperties {
      id
      title
      description
      images
      price
      minInvestment
      maxInvestment
      expectedRoi
      totalInvestment
      remainingInvestmentCapacity
      isFullyFunded
      investmentDuration
    }
  }
`;

export const GET_USER_INVESTMENTS = gql`
  query GetUserInvestments {
    userInvestments {
      id
      amount
      createdAt
      status
      property {
        id
        title
        expectedRoi
        investmentDuration
      }
    }
  }
`;

export const GET_INVESTMENT = gql`
  query GetInvestment($id: ID!) {
    investment(id: $id) {
      id
      amount
      createdAt
      status
      property {
        id
        title
        expectedRoi
        investmentDuration
      }
    }
  }
`;

export const CREATE_INVESTMENT = gql`
  mutation CreateInvestment($input: CreateInvestmentInput!) {
    createInvestment(input: $input) {
      id
      amount
      createdAt
      status
      property {
        id
        title
        expectedRoi
        investmentDuration
      }
    }
  }
`; 