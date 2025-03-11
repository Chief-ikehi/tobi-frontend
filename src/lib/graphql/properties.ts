import { gql } from '@apollo/client';

export const SEARCH_PROPERTIES = gql`
  query SearchProperties($filters: PropertyFilterInput) {
    properties(filters: $filters) {
      id
      title
      description
      price
      propertyType
      listingType
      address
      city
      state
      zipCode
      bedrooms
      bathrooms
      squareFootage
      amenities
      images
      isFeatured
      isAvailable
      latitude
      longitude
      safetyRating
      virtualTourUrl
      nearbyAttractions
      expectedRoi
      occupancyRate
      monthlyExpenses
      monthlyRevenue
      viewCount
      createdAt
      owner {
        id
        fullName
        email
      }
    }
  }
`;

export const PROPERTY_DETAIL = gql`
  query GetProperty($id: String!) {
    property(id: $id) {
      id
      title
      description
      price
      propertyType
      listingType
      address
      city
      state
      zipCode
      bedrooms
      bathrooms
      squareFootage
      amenities
      images
      isFeatured
      isAvailable
      latitude
      longitude
      safetyRating
      virtualTourUrl
      nearbyAttractions
      expectedRoi
      occupancyRate
      propertyDocuments
      monthlyExpenses
      monthlyRevenue
      viewCount
      createdAt
      owner {
        id
        fullName
        email
      }
    }
  }
`; 