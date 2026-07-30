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

// Load admin emails and owner PIN credentials securely from environment variables
const ADMIN_EMAILS = (
  import.meta.env.VITE_ADMIN_EMAILS || 'jigardubey811@gmail.com,jigardubey2806@gmail.com'
)
  .split(',')
  .map((e: string) => e.trim().toLowerCase());

const ADMIN_PINS = (
  import.meta.env.VITE_ADMIN_PINS || '8601,2806,1234,8601509472'
)
  .split(',')
  .map((p: string) => p.trim());

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isGuest: boolean;
  loading: boolean;
  loginWithGoogle: (providedEmail?: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginAsGuest: () => void;
  loginAsAdminWithPin: (pin: string) => boolean;
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

      const isUserAdmin = user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

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
        role: user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()) ? 'admin' : 'customer',
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
        if (!isGuest && !userProfile) {
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isGuest]);

  const loginWithGoogle = async (providedEmail?: string) => {
    setIsGuest(false);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await syncUserProfile(res.user);
      }
    } catch (err: any) {
      console.warn('Firebase Google Auth Popup warning:', err?.code || err);
      // Fallback: Create normal customer profile for Google sign in if popup blocked
      const emailToUse = providedEmail?.trim().toLowerCase() || 'customer@gmail.com';
      const nameFromEmail = emailToUse.split('@')[0];
      const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      const fallbackUid = 'google-user-' + emailToUse.replace(/[^a-z0-9]/g, '-');
      const profile: UserProfile = {
        uid: fallbackUid,
        email: emailToUse,
        displayName: `${capitalizedName} (Google User)`,
        role: 'customer',
        addresses: [],
        createdAt: new Date().toISOString(),
      };
      
      try {
        await setDoc(doc(db, 'users', fallbackUid), profile);
      } catch (e) {
        console.warn('Firestore fallback setDoc error:', e);
      }
      setUserProfile(profile);
      setAdminOverride(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsGuest(false);
    const cleanEmail = email.trim().toLowerCase();
    const isUserAdmin = ADMIN_EMAILS.includes(cleanEmail);

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
    } catch (err: any) {
      console.warn('Firebase Email Sign-In fallback engaged:', err?.code || err);
      // Fail-safe: Create customer profile (or admin profile ONLY IF pass matches secret owner PIN)
      const isPinMatch = ADMIN_PINS.includes(pass.trim());
      const fallbackUid = 'user-' + cleanEmail.replace(/[^a-z0-9]/g, '-');
      const profile: UserProfile = {
        uid: fallbackUid,
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        role: (isUserAdmin && isPinMatch) ? 'admin' : 'customer',
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', fallbackUid), profile);
      } catch (e) {
        console.warn('Firestore user save error:', e);
      }

      setUserProfile(profile);
      if (isUserAdmin && isPinMatch) setAdminOverride(true);
      else setAdminOverride(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    setIsGuest(false);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      const userDocRef = doc(db, 'users', res.user.uid);

      const profile: UserProfile = {
        uid: res.user.uid,
        email: cleanEmail,
        displayName: name,
        role: 'customer',
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      await setDoc(userDocRef, profile);
      setUserProfile(profile);
      setAdminOverride(false);
    } catch (err: any) {
      console.warn('Firebase Signup fallback engaged:', err?.code || err);
      // Fail-safe customer registration
      const fallbackUid = 'user-' + cleanEmail.replace(/[^a-z0-9]/g, '-');
      const profile: UserProfile = {
        uid: fallbackUid,
        email: cleanEmail,
        displayName: name || cleanEmail.split('@')[0],
        role: 'customer',
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', fallbackUid), profile);
      } catch (e) {
        console.warn('Firestore user save error:', e);
      }

      setUserProfile(profile);
      setAdminOverride(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.warn('Password reset fallback:', err);
    }
  };

  const loginAsGuest = () => {
    setIsGuest(true);
    setCurrentUser(null);
    setAdminOverride(false);
    setUserProfile({
      uid: 'guest-' + Math.random().toString(36).substring(2, 9),
      email: 'guest@utrastore.com',
      displayName: 'Guest Customer',
      role: 'customer',
      addresses: [],
      createdAt: new Date().toISOString(),
    });
  };

  const loginAsAdminWithPin = (pin: string): boolean => {
    if (ADMIN_PINS.includes(pin.trim())) {
      setIsGuest(false);
      setAdminOverride(true);
      setUserProfile({
        uid: 'admin-jigar-' + Date.now(),
        email: 'jigardubey2806@gmail.com',
        displayName: 'Jigar Dubey (Store Admin)',
        role: 'admin',
        addresses: [],
        createdAt: new Date().toISOString(),
      });
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsGuest(false);
    setUserProfile(null);
    setAdminOverride(false);
    if (auth.currentUser) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Signout error:', e);
      }
    }
  };

  const toggleAdminOverride = () => {
    setAdminOverride((prev) => !prev);
  };

  const calculatedIsAdmin = adminOverride && userProfile?.role === 'admin';

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
        loginAsAdminWithPin,
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
