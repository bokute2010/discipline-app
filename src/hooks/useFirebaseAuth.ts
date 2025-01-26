// src/hooks/useFirebaseAuth.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/config/firebase';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function getUserFirebase() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        resolve(user);
      });
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      if (!currentUser?.emailVerified){
        return;
      }
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, getUserFirebase };
};
