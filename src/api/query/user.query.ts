// src/queries/useUserData.js
import { useQuery } from '@tanstack/react-query';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '@/config/firebase';

const fetchUserData = async (userId: string) => {
  const db = getFirestore();
  const userDoc = doc(db, 'users', userId);
  const snapshot = await getDoc(userDoc);

  if (!snapshot.exists()) {
    throw new Error('User not found');
  }

  return snapshot.data();
};

export const useUserData = () => {
  const userId = auth.currentUser?.uid || '';

  return useQuery({
    queryKey: ['userData', userId],
    queryFn: () => fetchUserData(userId),
    enabled: !!userId, // Fetch only when userId exists
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};
