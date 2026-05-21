import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, MapPin, Phone, User as UserIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatPrice } from '../lib/utils';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, user, createOrder } = useAppContext();
  const navigate = useNavigate();

  // Filter selected items
  const selectedItems = cart.filter(item => item.selected);
  
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const [formData, setFormData] = useState({
    name: user?.username || '',
    phone: user?.phone || '',
    address: '记忆深处大街 1900 号虚拟信箱'
  });

  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if empty or not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/profile');
    } else if (selectedItems.length === 0 && !isSuccess) {
      navigate('/cart');
    }
  }, [user, selectedItems, navigate, isSuccess]);

  if (!user || (selectedItems.length === 0 && !isSuccess)) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('请填写完整收信信息');
      return;
    }

    createOrder({
      items: selectedItems,
      totalAmount,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    });
    
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-youth-card backdrop-blur-xl border border-white/60 p-8 sm:p-12 rounded-3xl shadow-sm text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-serif text-youth-heading mb-4">下单成功</h2>
          <p className="text-youth-text opacity-70 mb-8 leading-relaxed">
            你购买的青春记忆已打包完毕，<br/>
            预计将于你下一次梦中送达你的心底。
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-youth-heading text-white px-6 py-3.5 rounded-xl font-medium shadow-lg shadow-youth-heading/20 hover:opacity-90 transition"
            >
              查看我的订单
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white/50 text-youth-text px-6 py-3.5 rounded-xl font-medium hover:bg-white/80 transition"
            >
              继续逛逛
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-serif text-youth-heading mb-8">确认订单</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Form */}
        <div className="flex-1 space-y-6">
          <div className="bg-youth-card backdrop-blur-xl border border-white/60 p-6 sm:p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-medium text-youth-heading mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-youth-primary" />
              <span>收信信息</span>
            </h2>
            
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-youth-text opacity-70 mb-2">收件人姓名</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-youth-text/40">
                    <UserIcon size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-youth-primary/50 focus:bg-white outline-none transition"
                    placeholder="你的名字"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-youth-text opacity-70 mb-2">联系电话</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-youth-text/40">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-youth-primary/50 focus:bg-white outline-none transition"
                    placeholder="11位手机号码"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-youth-text opacity-70 mb-2">投递地址</label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="block w-full p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-youth-primary/50 focus:bg-white outline-none transition resize-none"
                  placeholder="详细地址"
                />
                <p className="mt-2 text-xs text-youth-text opacity-50">
                  *虚拟商品，地址仅用于增添投递的仪式感。
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-youth-card backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm sticky top-24">
            <h2 className="text-xl font-medium text-youth-heading mb-6">订单清单</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white/30 p-3 rounded-xl border border-white/40">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-white/60"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-serif text-youth-heading">{item.product.name}</h3>
                    <div className="text-xs text-youth-text opacity-50 mt-1">数量：x{item.quantity}</div>
                    <div className="text-sm text-youth-primary font-medium mt-1">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-youth-primary/20 pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-youth-text opacity-70 text-sm">
                <span>商品总额</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-youth-text opacity-70 text-sm">
                <span>时空运费</span>
                <span>¥0.00</span>
              </div>
              <div className="flex justify-between items-end pt-3">
                <span className="font-medium text-youth-text text-sm uppercase tracking-widest opacity-60">实付款</span>
                <span className="text-2xl font-serif font-bold text-youth-primary">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="w-full bg-youth-heading text-white py-4 rounded-2xl font-medium transition-all shadow-lg shadow-youth-heading/20 hover:opacity-90 active:scale-[0.98]"
            >
              提交订单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
