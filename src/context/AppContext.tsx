import React, { createContext, useContext, ReactNode } from 'react';
import { User, CartItem, Order, Product } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../lib/utils';
import toast from 'react-hot-toast';

interface AppContextType {
  user: User | null;
  login: (username: string, phone: string) => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleItemSelection: (itemId: string) => void;
  toggleAllSelection: (selected: boolean) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'userId'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('youth_user', null);
  const [cart, setCart] = useLocalStorage<CartItem[]>('youth_cart', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('youth_orders', []);

  const login = (username: string, phone: string) => {
    setUser({ id: generateId(), username, phone });
    toast.success('登录成功，欢迎回来！');
  };

  const logout = () => {
    setUser(null);
    setCart([]); // Clear cart on logout
    toast.success('已退出登录。');
  };

  const addToCart = (product: Product) => {
    if (!user) {
      toast.error('请先登录后再购买哦~');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: generateId(), product, quantity: 1, selected: true }];
    });
    toast.success('成功放入购物车！');
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const toggleItemSelection = (itemId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleAllSelection = (selected: boolean) => {
    setCart((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const clearCart = () => setCart([]);

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    if (!user) return;
    const newOrder: Order = {
      ...orderData,
      id: generateId(),
      userId: user.id,
      createdAt: Date.now(),
      status: 'completed',
    };
    setOrders((prev) => [newOrder, ...prev]);
    // Remove ordered items from cart
    const orderedItemIds = orderData.items.map(i => i.id);
    setCart(prev => prev.filter(item => !orderedItemIds.includes(item.id)));
    toast.success('订单提交成功，谢谢你的购买！');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleItemSelection,
        toggleAllSelection,
        clearCart,
        orders,
        createOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
