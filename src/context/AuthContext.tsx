import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserProfile } from '../types';

const ADMIN_EMAIL = 'jigardubey811@gmail.com';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isGuest: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  toggleAdminOverride: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminOverride, setAdminOverride] = useState(false);

  // Sync user profile from Firestore or create default
  const syncUserProfile = async (user: User) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      const isUserAdmin = user.email === ADMIN_EMAIL;

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setUserProfile(data);
      } else {
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Customer',
          photoURL: user.photoURL || '',
          role: isUserAdmin ? 'admin' : 'customer',
          addresses: [],
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.warn('Error fetching user profile from Firestore:', err);
      // Fallback local profile
      setUserProfile({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Customer',
        role: user.email === ADMIN_EMAIL ? 'admin' : 'customer',
        addresses: [],
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsGuest(false);
        await syncUserProfile(user);
      } else {
        setCurrentUser(null);
        if (!isGuest) {
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isGuest]);

  const loginWithGoogle = async () => {
    setIsGuest(false);
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsGuest(false);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    setIsGuest(false);
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const userDocRef = doc(db, 'users', res.user.uid);
    const isUserAdmin = email === ADMIN_EMAIL;

    const profile: UserProfile = {
      uid: res.user.uid,
      email,
      displayName: name,
      role: isUserAdmin ? 'admin' : 'customer',
      addresses: [],
      createdAt: new Date().toISOString(),
    };

    await setDoc(userDocRef, profile);
    setUserProfile(profile);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const loginAsGuest = () => {
    setIsGuest(true);
    setCurrentUser(null);
    setUserProfile({
      uid: 'guest-' + Math.random().toString(36).substring(2, 9),
      email: 'guest@store.com',
      displayName: 'Guest Shopper',
      role: 'customer',
      addresses: [],
      createdAt: new Date().toISOString(),
    });
  };

  const logout = async () => {
    setIsGuest(false);
    setUserProfile(null);
    setAdminOverride(false);
    if (auth.currentUser) {
      await signOut(auth);
    }
  };

  const toggleAdminOverride = () => {
    setAdminOverride((prev) => !prev);
  };

  const calculatedIsAdmin =
    adminOverride ||
    userProfile?.role === 'admin' ||
    currentUser?.email === ADMIN_EMAIL ||
    userProfile?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin: calculatedIsAdmin,
        isGuest,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resetPassword,
        loginAsGuest,
        logout,
        toggleAdminOverride,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
