import React from 'react';
import { motion } from 'motion/react';
import { products } from '../data/products';
import { useAppContext } from '../context/AppContext';
import { formatPrice } from '../lib/utils';
import { Plus } from 'lucide-react';

export default function Home() {
  const { addToCart } = useAppContext();

  return (
    <div className="min-h-screen pb-20">
      <div className="py-16 sm:py-24 px-4 text-center max-w-3xl mx-auto">
        <motion.h1 
          className="text-4xl sm:text-5xl font-serif text-youth-heading mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          售卖我的青春
        </motion.h1>
        <motion.p 
          className="text-youth-text opacity-70 text-lg leading-relaxed italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          这里有一些看不见摸不着，却无比珍贵的商品。<br className="hidden sm:block" />
          买下一份回忆，或者给未来的自己留一点光芒。
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-youth-card backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-white/60 flex flex-col"
            >
              <div className="relative p-6 pt-6 pb-0">
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-[#fdfbf7] rounded-2xl">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-white/80 px-2 py-1 rounded-full text-[10px] uppercase tracking-tighter text-youth-text z-10">虚拟资产</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-serif text-youth-heading">{product.name}</h3>
                  <span className="font-serif font-medium text-youth-primary">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <p className="text-youth-text opacity-70 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex-1" />
                <p className="text-youth-text opacity-50 text-xs mb-6 line-clamp-3">
                  {product.longDescription}
                </p>
                
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-3 px-4 bg-white border border-youth-primary/30 text-youth-primary rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-youth-primary hover:text-white active:scale-[0.98] transition-all"
                >
                  <Plus size={18} />
                  <span>放入时光机 (加入购物车)</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
