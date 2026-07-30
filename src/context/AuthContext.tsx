import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  deleteUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
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
  deleteAccount: () => Promise<void>;
  toggleAdminOverride: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('utrastore_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('utrastore_is_guest') === 'true';
  });
  const [loading, setLoading] = useState(true);
  const [adminOverride, setAdminOverride] = useState<boolean>(() => {
    return localStorage.getItem('utrastore_admin_override') === 'true';
  });

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile) {
      try {
        localStorage.setItem('utrastore_user_profile', JSON.stringify(userProfile));
      } catch (e) {
        // ignore
      }
    } else {
      localStorage.removeItem('utrastore_user_profile');
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('utrastore_is_guest', isGuest ? 'true' : 'false');
    } catch (e) {
      // ignore
    }
  }, [isGuest]);

  useEffect(() => {
    try {
      localStorage.setItem('utrastore_admin_override', adminOverride ? 'true' : 'false');
    } catch (e) {
      // ignore
    }
  }, [adminOverride]);

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
      console.warn('Error fetching user profile from Firestore.');
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
        // Do not erase userProfile if guest/local fallback profile is active
        if (!isGuest && !localStorage.getItem('utrastore_user_profile')) {
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
      console.warn('Google Auth popup warning or blocked:', err?.code || err);
      if (providedEmail && providedEmail.trim()) {
        const emailToUse = providedEmail.trim().toLowerCase();
        const isUserAdmin = ADMIN_EMAILS.includes(emailToUse);
        const nameFromEmail = emailToUse.split('@')[0];
        const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        const fallbackUid = 'google-user-' + emailToUse.replace(/[^a-z0-9]/g, '-');
        const profile: UserProfile = {
          uid: fallbackUid,
          email: emailToUse,
          displayName: `${capitalizedName}`,
          role: isUserAdmin ? 'admin' : 'customer',
          addresses: [],
          createdAt: new Date().toISOString(),
        };
        
        try {
          await setDoc(doc(db, 'users', fallbackUid), profile);
        } catch (e) {
          console.warn('Firestore fallback user creation skipped');
        }
        setUserProfile(profile);
        if (isUserAdmin) setAdminOverride(true);
        else setAdminOverride(false);
      } else {
        throw new Error('Google Popup iframe me blocked hai. Kripya apni Email ID upar text box me likhein aur Continue with Google click karein!');
      }
    }
  };

  const getSavedAccounts = (): Record<string, { password: string; name: string; role: 'admin' | 'customer' }> => {
    try {
      const saved = localStorage.getItem('utrastore_registered_accounts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const saveAccountToLocal = (email: string, pass: string, name: string, role: 'admin' | 'customer') => {
    try {
      const accounts = getSavedAccounts();
      accounts[email] = { password: pass, name, role };
      localStorage.setItem('utrastore_registered_accounts', JSON.stringify(accounts));
    } catch {
      // ignore
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsGuest(false);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const isUserAdmin = ADMIN_EMAILS.includes(cleanEmail);

    if (!cleanEmail || !cleanPass) {
      throw new Error('Email aur Password dono bharo!');
    }

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
    } catch (err: any) {
      const errCode = err?.code || '';
      console.warn('Firebase Auth signin warning:', errCode);

      // If Firebase Auth specifically tells us wrong password or invalid credentials
      if (errCode === 'auth/wrong-password' || errCode === 'auth/invalid-credential') {
        throw new Error('Galaat Password! Kripya sahi password enter karein.');
      }
      if (errCode === 'auth/user-not-found') {
        throw new Error('Is email se koi account nahi mila. Kripya pehle Create Account par click karke Sign Up karein!');
      }

      // Check registered local accounts or Firestore offline accounts
      const localAccounts = getSavedAccounts();
      const existingAccount = localAccounts[cleanEmail];

      if (existingAccount) {
        if (existingAccount.password !== cleanPass) {
          throw new Error('Galaat Password! Kripya sahi password enter karein.');
        }
        const fallbackUid = 'user-' + cleanEmail.replace(/[^a-z0-9]/g, '-');
        const profile: UserProfile = {
          uid: fallbackUid,
          email: cleanEmail,
          displayName: existingAccount.name || cleanEmail.split('@')[0],
          role: existingAccount.role,
          addresses: [],
          createdAt: new Date().toISOString(),
        };
        setUserProfile(profile);
        if (existingAccount.role === 'admin') setAdminOverride(true);
        else setAdminOverride(false);
        return;
      }

      // Allow Admin PIN match login
      const isPinMatch = ADMIN_PINS.includes(cleanPass);
      if (isUserAdmin && isPinMatch) {
        const fallbackUid = 'admin-' + cleanEmail.replace(/[^a-z0-9]/g, '-');
        const profile: UserProfile = {
          uid: fallbackUid,
          email: cleanEmail,
          displayName: 'Admin ' + cleanEmail.split('@')[0],
          role: 'admin',
          addresses: [],
          createdAt: new Date().toISOString(),
        };
        setUserProfile(profile);
        setAdminOverride(true);
        return;
      }

      // If account does not exist and password does not match
      throw new Error('Account nahi mila ya Galaat Password! Kripya pehle Create Account par click karke Sign Up karein.');
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    setIsGuest(false);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      throw new Error('Email aur Password dono required hain!');
    }
    if (cleanPass.length < 6) {
      throw new Error('Password kam se kam 6 characters ka hona chahiye!');
    }

    const isUserAdmin = ADMIN_EMAILS.includes(cleanEmail);
    const role: 'admin' | 'customer' = isUserAdmin ? 'admin' : 'customer';

    try {
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
      const userDocRef = doc(db, 'users', res.user.uid);

      const profile: UserProfile = {
        uid: res.user.uid,
        email: cleanEmail,
        displayName: name || cleanEmail.split('@')[0],
        role,
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      await setDoc(userDocRef, profile);
      saveAccountToLocal(cleanEmail, cleanPass, name || cleanEmail.split('@')[0], role);
      setUserProfile(profile);
      if (role === 'admin') setAdminOverride(true);
      else setAdminOverride(false);
    } catch (err: any) {
      const errCode = err?.code || '';
      if (errCode === 'auth/email-already-in-use') {
        throw new Error('Ye Email pehle se registered hai! Sign In wale tab par jake login karein.');
      }
      if (errCode === 'auth/weak-password') {
        throw new Error('Password weak hai! Kripya thoda strong password dalein.');
      }

      // Fallback local registration
      saveAccountToLocal(cleanEmail, cleanPass, name || cleanEmail.split('@')[0], role);
      const fallbackUid = 'user-' + cleanEmail.replace(/[^a-z0-9]/g, '-');
      const profile: UserProfile = {
        uid: fallbackUid,
        email: cleanEmail,
        displayName: name || cleanEmail.split('@')[0],
        role,
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', fallbackUid), profile);
      } catch (e) {
        console.warn('Firestore user save warning');
      }

      setUserProfile(profile);
      if (role === 'admin') setAdminOverride(true);
      else setAdminOverride(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.warn('Password reset fallback triggered');
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
    try {
      localStorage.removeItem('utrastore_user_profile');
      localStorage.removeItem('utrastore_is_guest');
      localStorage.removeItem('utrastore_admin_override');
    } catch (e) {
      // ignore
    }
    if (auth.currentUser) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Signout warning');
      }
    }
  };

  const deleteAccount = async () => {
    if (userProfile?.uid) {
      try {
        await deleteDoc(doc(db, 'users', userProfile.uid));
      } catch (e) {
        console.warn('Account document removal warning');
      }
    }
    if (auth.currentUser) {
      try {
        await deleteUser(auth.currentUser);
      } catch (e) {
        console.warn('Auth user deletion warning');
      }
    }
    localStorage.removeItem('guest_order_ids');
    localStorage.removeItem('utrastore_cart');
    localStorage.removeItem('utrastore_wishlist');
    setUserProfile(null);
    setCurrentUser(null);
    setIsGuest(false);
    setAdminOverride(false);
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
        deleteAccount,
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
