import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
    useCallback,
  } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  export interface Product {
    id: string | number; // Consistent with ProductDetail and WishlistScreen
    name: string;
    price: number;
    image?: string;
    description?: string; // Included for ProductDetail compatibility
  }
  
  interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string | number) => void;
    isWishlisted: (productId: string | number) => boolean;
    clearWishlist: () => void;
  }
  
  const WISHLIST_STORAGE_KEY = '@app_wishlist';
  
  const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
  
  interface WishlistProviderProps {
    children: ReactNode;
  }
  
  export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const loadWishlist = async () => {
        try {
          const storedWishlist = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
          if (storedWishlist) {
            const parsed = JSON.parse(storedWishlist);
            // Validate IDs to prevent type mismatches
            const validatedWishlist = parsed.filter(
              (item: any) => item.id !== undefined && item.id !== null
            );
            setWishlist(validatedWishlist);
          }
        } catch (error) {
          console.error('Failed to load wishlist from storage:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadWishlist();
    }, []);
  
    useEffect(() => {
      if (!isLoading) {
        const saveWishlist = async () => {
          try {
            await AsyncStorage.setItem(
              WISHLIST_STORAGE_KEY,
              JSON.stringify(wishlist)
            );
          } catch (error) {
            console.error('Failed to save wishlist to storage:', error);
          }
        };
        saveWishlist();
      }
    }, [wishlist, isLoading]);
  
    const addToWishlist = useCallback((product: Product) => {
      setWishlist((prevWishlist) => {
        // Prevent duplicates and ensure valid ID
        if (
          product.id &&
          !prevWishlist.some((item) => item.id === product.id)
        ) {
          return [...prevWishlist, product];
        }
        return prevWishlist;
      });
    }, []);
  
    const removeFromWishlist = useCallback((productId: string | number) => {
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.id !== productId)
      );
    }, []);
  
    const isWishlisted = useCallback(
      (productId: string | number): boolean => {
        return wishlist.some((item) => item.id === productId);
      },
      [wishlist]
    );
  
    const clearWishlist = useCallback(() => {
      setWishlist([]);
    }, []);
  
    if (isLoading) {
      return null; // Prevent rendering until wishlist is loaded
    }
  
    return (
      <WishlistContext.Provider
        value={{
          wishlist,
          addToWishlist,
          removeFromWishlist,
          isWishlisted,
          clearWishlist,
        }}
      >
        {children}
      </WishlistContext.Provider>
    );
  };
  
  export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
      throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
  };