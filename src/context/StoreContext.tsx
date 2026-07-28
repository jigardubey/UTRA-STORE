import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Category, Brand, Order, Coupon, Banner, Review, StoreSettings } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
} from '../data/initialCatalog';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  orders: Order[];
  coupons: Coupon[];
  banners: Banner[];
  reviews: Review[];
  settings: StoreSettings;
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBrand: (brand: Omit<Brand, 'id'>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], trackingNo?: string) => Promise<void>;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Firestore Seed Helper if collection is empty
  useEffect(() => {
    const seedInitialDataIfNeeded = async () => {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        if (prodSnap.empty) {
          for (const p of INITIAL_PRODUCTS) {
            await setDoc(doc(db, 'products', p.id), p);
          }
        }

        const catSnap = await getDocs(collection(db, 'categories'));
        if (catSnap.empty) {
          for (const c of INITIAL_CATEGORIES) {
            await setDoc(doc(db, 'categories', c.id), c);
          }
        }

        const brandSnap = await getDocs(collection(db, 'brands'));
        if (brandSnap.empty) {
          for (const b of INITIAL_BRANDS) {
            await setDoc(doc(db, 'brands', b.id), b);
          }
        }

        const couponSnap = await getDocs(collection(db, 'coupons'));
        if (couponSnap.empty) {
          for (const cp of INITIAL_COUPONS) {
            await setDoc(doc(db, 'coupons', cp.id), cp);
          }
        }

        const bannerSnap = await getDocs(collection(db, 'banners'));
        if (bannerSnap.empty) {
          for (const bn of INITIAL_BANNERS) {
            await setDoc(doc(db, 'banners', bn.id), bn);
          }
        }

        const settingsSnap = await getDocs(collection(db, 'settings'));
        if (settingsSnap.empty) {
          await setDoc(doc(db, 'settings', 'global'), INITIAL_SETTINGS);
        }
      } catch (err) {
        console.warn('Firestore seed/read check skipped or offline:', err);
      }
    };

    seedInitialDataIfNeeded();
  }, []);

  // Firestore Subscriptions
  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(list);
      }
    });

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(list);
      }
    });

    const unsubBrands = onSnapshot(collection(db, 'brands'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Brand));
        setBrands(list);
      }
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(list);
    });

    const unsubCoupons = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Coupon));
        setCoupons(list);
      }
    });

    const unsubBanners = onSnapshot(collection(db, 'banners'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Banner));
        setBanners(list);
      }
    });

    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(list);
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as StoreSettings);
      }
      setLoading(false);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubBrands();
      unsubOrders();
      unsubCoupons();
      unsubBanners();
      unsubReviews();
      unsubSettings();
    };
  }, []);

  // Store Actions
  const addProduct = async (prodData: Omit<Product, 'id' | 'createdAt'>) => {
    const id = 'prod-' + Date.now();
    const newProd: Product = {
      ...prodData,
      id,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'products', id), newProd);
    } catch {
      setProducts((prev) => [newProd, ...prev]);
    }
  };

  const updateProduct = async (id: string, prodData: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', id), prodData);
    } catch {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...prodData } : p)));
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const addCategory = async (catData: Omit<Category, 'id'>) => {
    const id = 'cat-' + Date.now();
    const newCat = { ...catData, id };
    try {
      await setDoc(doc(db, 'categories', id), newCat);
    } catch {
      setCategories((prev) => [...prev, newCat]);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const addBrand = async (brandData: Omit<Brand, 'id'>) => {
    const id = 'brand-' + Date.now();
    const newBrand = { ...brandData, id };
    try {
      await setDoc(doc(db, 'brands', id), newBrand);
    } catch {
      setBrands((prev) => [...prev, newBrand]);
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'brands', id));
    } catch {
      setBrands((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const id = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = 'TRK' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const newOrder: Order = {
      ...orderData,
      id,
      trackingNumber,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'orders', id), newOrder);
      // Reduce product stock
      for (const item of orderData.items) {
        const targetProd = products.find((p) => p.id === item.productId);
        if (targetProd && targetProd.stock >= item.quantity) {
          updateProduct(targetProd.id, { stock: targetProd.stock - item.quantity });
        }
      }
    } catch {
      setOrders((prev) => [newOrder, ...prev]);
    }

    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order['orderStatus'],
    trackingNo?: string
  ) => {
    const updatePayload: Partial<Order> = { orderStatus: status };
    if (trackingNo) updatePayload.trackingNumber = trackingNo;

    try {
      await updateDoc(doc(db, 'orders', orderId), updatePayload);
    } catch {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...updatePayload } : o))
      );
    }
  };

  const addCoupon = async (cpData: Omit<Coupon, 'id'>) => {
    const id = 'cp-' + Date.now();
    const newCp = { ...cpData, id };
    try {
      await setDoc(doc(db, 'coupons', id), newCp);
    } catch {
      setCoupons((prev) => [...prev, newCp]);
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', id));
    } catch {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const addBanner = async (bnData: Omit<Banner, 'id'>) => {
    const id = 'banner-' + Date.now();
    const newBn = { ...bnData, id };
    try {
      await setDoc(doc(db, 'banners', id), newBn);
    } catch {
      setBanners((prev) => [...prev, newBn]);
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'banners', id));
    } catch {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const id = 'rev-' + Date.now();
    const newReview: Review = {
      ...reviewData,
      id,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'reviews', id), newReview);
    } catch {
      setReviews((prev) => [newReview, ...prev]);
    }
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await setDoc(doc(db, 'settings', 'global'), updated);
    } catch (err) {
      console.warn('Failed to update Firestore settings:', err);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        brands,
        orders,
        coupons,
        banners,
        reviews,
        settings,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        addBrand,
        deleteBrand,
        placeOrder,
        updateOrderStatus,
        addCoupon,
        deleteCoupon,
        addBanner,
        deleteBanner,
        addReview,
        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
