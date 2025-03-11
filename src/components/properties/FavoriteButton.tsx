'use client';

import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { TOGGLE_FAVORITE, CHECK_IS_FAVORITE } from '@/lib/graphql/favorites';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ propertyId, className = '' }) => {
  const { data: session } = useSession();
  
  const { data, loading } = useQuery(CHECK_IS_FAVORITE, {
    variables: { propertyId },
    skip: !session?.user,
  });

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE, {
    variables: { propertyId },
    refetchQueries: ['CheckIsFavorite', 'GetUserFavorites'],
  });

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent event bubbling to parent links
    
    if (!session?.user) {
      toast.error('Please sign in to save favorites',{
        position: "top-center", // Position of the toast
        duration: 4000,
        style: {
        zIndex: 99999,
        }
      });
      return;
    }

    
      await toggleFavorite();
      toast.success(data?.isFavorite ? 'Removed from favorites' : 'Added to favorites',{
        position: "top-center", // Position of the toast
        duration: 4000,
        style: {
        zIndex: 99999,
        }
      });
    
  };

  if (!session?.user) {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-full bg-white/80 hover:bg-white transition-colors ${className}`}
        aria-label="Add to favorites"
      >
        <Heart className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  if (loading) {
    return (
      <button className={`p-2 rounded-full bg-white/80 ${className}`} disabled>
        <Heart className="w-5 h-5 text-gray-400" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full bg-white/80 hover:bg-white transition-colors ${className}`}
      aria-label={data?.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`w-5 h-5 ${data?.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
      />
    </button>
  );
}; 