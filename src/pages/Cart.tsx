import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatPrice } from '../lib/utils';
import toast from 'react-hot-toast';

export default function Cart() {
  const { 
    cart, 
    user, 
    removeFromCart, 
    updateQuantity, 
    toggleItemSelection, 
    toggleAllSelection 
  } = useAppContext();
  
  const navigate = useNavigate();

  const selectedItems = useMemo(() => cart.filter(item => item.selected), [cart]);
  const allSelected = cart.length > 0 && selectedItems.length === cart.length;
  
  const totalAmount = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [selectedItems]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag size={48} className="text-youth-text opacity-30 mb-6" />
        <h2 className="text-2xl font-serif text-youth-heading mb-2">购物车是空的</h2>
        <p className="text-youth-text opacity-70 mb-8 text-center max-w-sm">
          你需要先登录，才能将青春碎片装进购物车。
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="bg-youth-heading text-white px-8 py-3 rounded-2xl shadow-lg shadow-youth-heading/20 font-medium hover:opacity-90 transition active:scale-[0.98]"
        >
          去登录 / 注册
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag size={48} className="text-youth-text opacity-30 mb-6" />
        <h2 className="text-2xl font-serif text-youth-heading mb-2">购物车空空如也</h2>
        <p className="text-youth-text opacity-70 mb-8 text-center max-w-sm">
          去市集逛逛吧，买下一些关于未来的梦。
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-youth-heading text-white px-8 py-3 rounded-2xl shadow-lg shadow-youth-heading/20 font-medium hover:opacity-90 transition active:scale-[0.98]"
        >
          回到市集
        </button>
      </div>
    );
  }

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('请至少选择一件商品');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-serif text-youth-heading mb-8">我的购物车</h1>
      
      <div className="bg-youth-card backdrop-blur-xl rounded-3xl shadow-sm border border-white/60 overflow-hidden mb-8">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-youth-primary/20 flex items-center justify-between bg-white/20">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => toggleAllSelection(e.target.checked)}
                className="peer appearance-none w-5 h-5 border-2 border-youth-text/30 rounded checked:bg-youth-primary checked:border-youth-primary transition-all cursor-pointer"
              />
              <div className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span className="text-youth-text font-medium select-none">全选</span>
          </label>
        </div>

        {/* List */}
        <div className="divide-y divide-youth-primary/10">
          {cart.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={item.id} 
              className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:bg-white/30 transition-colors"
            >
              <label className="flex items-center gap-3 cursor-pointer pt-2 sm:pt-0">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleItemSelection(item.id)}
                    className="peer appearance-none w-5 h-5 border-2 border-youth-text/30 rounded checked:bg-youth-primary checked:border-youth-primary transition-all cursor-pointer"
                  />
                  <div className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </label>

              <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-white/60">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-serif text-youth-heading mb-1">{item.product.name}</h3>
                <p className="text-sm text-youth-text opacity-70 line-clamp-1">{item.product.description}</p>
                <div className="mt-2 text-youth-primary font-serif">
                  {formatPrice(item.product.price)}
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 mt-4 sm:mt-0">
                <div className="flex items-center bg-white/50 rounded-full border border-white/60">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-youth-text opacity-50 hover:opacity-100 disabled:opacity-30"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-youth-text select-none">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-youth-text opacity-50 hover:opacity-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-youth-text opacity-40 hover:text-youth-primary hover:opacity-100 transition-colors p-2"
                  title="移除商品"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Checkout Bar */}
      <div className="sticky bottom-4 sm:bottom-8 bg-youth-card backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-youth-text w-full sm:w-auto">
          <span>已选 <span className="font-semibold">{selectedItems.length}</span> 件商品，</span>
          <span className="text-sm uppercase tracking-widest opacity-60">总计成本</span>
          <span className="text-2xl font-serif font-bold text-youth-primary">
            {formatPrice(totalAmount)}
          </span>
        </div>
        
        <button
          onClick={handleCheckout}
          disabled={selectedItems.length === 0}
          className="w-full sm:w-auto bg-youth-heading shadow-lg shadow-youth-heading/20 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98]"
        >
          <span>结算青春 (立即下单)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
