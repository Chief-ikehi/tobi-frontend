import { gql } from '@apollo/client';

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($propertyId: String!) {
    toggleFavorite(propertyId: $propertyId) {
      id
      userId
      propertyId
      createdAt
    }
  }
`;

export const GET_USER_FAVORITES = gql`
  query GetUserFavorites {
    userFavorites {
      id
      propertyId
      createdAt
    }
  }
`;

export const CHECK_IS_FAVORITE = gql`
  query CheckIsFavorite($propertyId: String!) {
    isFavorite(propertyId: $propertyId)
  }
`; 