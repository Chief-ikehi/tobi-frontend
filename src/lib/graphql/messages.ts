import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      content
      senderId
      recipientId
      propertyId
      createdAt
      isRead
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      id
      content
      senderId
      recipientId
      propertyId
      createdAt
      isRead
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
      property {
        id
        title
        images
      }
    }
  }
`;

export const MARK_MESSAGE_READ = gql`
  mutation MarkMessageRead($id: String!) {
    markMessageRead(id: $id) {
      id
      isRead
    }
  }
`; 