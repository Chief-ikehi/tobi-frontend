import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        email
        firstName
        lastName
        role
        avatarUrl
        isEmailVerified
        phoneNumber
      }
      accessToken
    }
  }
`;

export const SIGN_IN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        firstName
        lastName
        role
        avatarUrl
        isEmailVerified
        phoneNumber
      }
      accessToken
    }
  }
`;

export const GOOGLE_AUTH = gql`
  mutation GoogleAuth($input: GoogleAuthInput!) {
    googleAuth(input: $input) {
      user {
        id
        email
        firstName
        lastName
        role
        image
      }
      token
    }
  }
`; 