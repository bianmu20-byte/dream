import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Phone, LogOut, Package, Clock, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatPrice } from '../lib/utils';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login, logout, orders } = useAppContext();
  const [isLoginHovered, setIsLoginHovered] = useState(false);

  // Login Form State
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !phone.trim()) {
      toast.error('请填写完整信息');
      return;
    }
    // simple fake validation
    if (phone.length < 11) {
      toast.error('请输入正确的手机号');
      return;
    }
    login(username, phone);
  };

  const userOrders = user ? orders.filter(o => o.userId === user.id) : [];

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-youth-card backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-sm border border-white/60"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-youth-heading mb-3">登录你的专属时空</h2>
            <p className="text-youth-text opacity-50 text-sm">连接电波，留住每一份想要珍藏的记忆。</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-youth-text opacity-70 mb-2">你的称呼</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-youth-text/40">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-youth-primary/50 focus:bg-white outline-none transition"
                  placeholder="如：夏日旅人"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-youth-text opacity-70 mb-2">联系方式 (模拟)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-youth-text/40">
                  <Phone size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-youth-primary/50 focus:bg-white outline-none transition"
                  placeholder="随便填个11位数字即可"
                />
              </div>
            </div>

            <button
              type="submit"
              onMouseEnter={() => setIsLoginHovered(true)}
              onMouseLeave={() => setIsLoginHovered(false)}
              className="relative w-full bg-youth-heading text-white py-3.5 rounded-xl font-medium shadow-lg shadow-youth-heading/20 overflow-hidden transition-transform active:scale-[0.98]"
            >
              <AnimatePresence>
                {isLoginHovered && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 bg-white rounded-xl"
                  />
                )}
              </AnimatePresence>
              <span className="relative">开启时光机</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Profile Header */}
      <div className="bg-youth-card backdrop-blur-xl rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-sm border border-white/60 mb-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full border border-white/40 p-0.5 bg-youth-pink/30 flex items-center justify-center text-white shadow-inner">
             <div className="w-full h-full rounded-full bg-youth-primary flex items-center justify-center text-xl font-serif">
                {user.username.charAt(0)}
             </div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-serif text-youth-heading mb-1 italic">{user.username}</h1>
            <p className="text-youth-text opacity-60 text-xs uppercase tracking-widest flex items-center gap-2 justify-center sm:justify-start">
              <Phone size={14} />
              <span>{user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-youth-text opacity-50 hover:opacity-100 hover:text-[#f2a7b5] rounded-xl transition-colors border border-transparent hover:bg-white/40"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">退出登录</span>
        </button>
      </div>

      {/* Orders Section */}
      <h2 className="text-xl font-serif text-youth-heading mb-6 flex items-center gap-2">
        <Package size={22} className="text-youth-primary" />
        <span>我的时光行囊 ({userOrders.length})</span>
      </h2>

      {userOrders.length === 0 ? (
        <div className="bg-white/20 rounded-3xl border border-dashed border-white/60 p-12 text-center text-youth-text opacity-50">
          <p>你还没有买下任何记忆，去市集看看吧。</p>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={order.id} 
              className="bg-youth-card backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-youth-primary/20">
                <div className="text-xs sm:text-sm text-youth-text opacity-50 space-y-1 font-serif">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>下单时间: {new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span className="line-clamp-1">{order.name} · {order.address}</span>
                  </div>
                </div>
                <div className="text-xs uppercase tracking-widest px-3 py-1 bg-white/40 text-youth-heading border border-white/60 rounded-full w-fit">
                  已送达记忆深处
                </div>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white/30 p-3 rounded-xl border border-white/40">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/60">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-youth-heading font-serif truncate">{item.product.name}</h3>
                      <p className="text-youth-text opacity-50 text-xs">x{item.quantity}</p>
                    </div>
                    <div className="text-right text-youth-heading font-medium whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-youth-primary/20 flex justify-end items-end gap-3">
                <span className="text-youth-text uppercase tracking-widest text-xs opacity-60">实付金额</span>
                <span className="text-xl font-serif font-bold text-youth-primary">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
