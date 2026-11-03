import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { getProductBySlug, getProducts } from '../api';
import { useCartStore } from '../store/cartStore';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductCard } from '../components/ProductCard';
import { generateProductSchema } from '../utils/jsonLd';
import { useTranslation } from '../utils/translations';
import { 
  Minus, 
  Plus, 
  ShoppingCart, 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Zap, 
  ArrowRight,
  PackageCheck,
  Flame,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

const teluguDict: Record<string, string> = {
  'pachadi': 'పచ్చడి', 'gongura': 'గోంగూర', 'allam': 'అల్లం', 'mixed': 'మిక్స్డ్', 
  'vegetable': 'వెజిటబుల్', 'tomato': 'టమాటా', 'mango': 'మామిడికాయ', 'sweet': 'స్వీట్',
  'sweets': 'స్వీట్లు', 'snacks': 'స్నాక్స్', 'chicken': 'చికెన్', 'mutton': 'మటన్', 
  'pickle': 'పచ్చడి', 'pickles': 'పచ్చళ్ళు', 'garlic': 'వెల్లుల్లి', 'avakaya': 'ఆవకాయ',
  'non': 'నాన్', 'veg': 'వెజ్', 'prawns': 'రొయ్యల', 'fish': 'చేపల', 'bellam': 'బెల్లం',
  'nuvvula': 'నువ్వుల', 'palli': 'పల్లి', 'chekkalu': 'చెక్కలు', 'sakinalu': 'సకినాలు',
  'karam': 'కారం', 'chintakaya': 'చింతకాయ', 'usirikaya': 'ఉసిరికాయ', 'podi': 'పొడి',
  'kandi': 'కంది', 'munagaku': 'మునగాకు', 'karivepaku': 'కరివేపాకు'
};

const getTeluguTranslation = (englishName: string) => {
  return englishName.split(' ').map(word => {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    return teluguDict[w] || word;
  }).join(' ');
};

export const ProductDetail = () => {
  const { t, getProductName, getCategoryName, isTelugu } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'about' | 'ingredients' | 'storage'>('about');
  const addItem = useCartStore(state => state.addItem);

  // Fetch current product
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug!),
    enabled: !!slug,
  });

  // Fetch all products to showcase related category items
  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const [isAdded, setIsAdded] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const weightOptions = [
    { label: '500g', value: '500g', weightKg: 0.5, tag: 'Min Order' },
    { label: '1 KG', value: '1kg', weightKg: 1.0, tag: 'Most Popular' },
    { label: '1.5 KG', value: '1.5kg', weightKg: 1.5 },
    { label: '2 KG', value: '2kg', weightKg: 2.0, tag: 'Family Pack' },
    { label: '2.5 KG', value: '2.5kg', weightKg: 2.5 },
    { label: '3 KG', value: '3kg', weightKg: 3.0, tag: 'Max Order' },
  ];

  const currentWeightObj = weightOptions.find(w => w.value === selectedWeight) || weightOptions[0];
  const unitPrice = product ? Math.round(product.price * currentWeightObj.weightKg) : 0;
  const totalPrice = unitPrice * quantity;
  const currentTotalItemWeight = Number((currentWeightObj.weightKg * quantity).toFixed(1));
  const maxAllowedQuantity = Math.max(1, Math.floor(3.0 / currentWeightObj.weightKg));

  const primaryCategory = (product?.categories && product.categories.length > 0)
    ? product.categories[0]
    : { id: 5, name: 'Hot Snacks', slug: 'hot-snacks' };

  // Related Category Items (Amazon standard)
  const relatedProducts = useMemo(() => {
    if (!allProducts || !product) return [];
    const catId = primaryCategory?.id;
    const catName = primaryCategory?.name?.toLowerCase();

    const sameCat = allProducts.filter((p) => {
      if (p.id === product.id || p.isVisible === false) return false;
      if (catId && p.categories?.some((c) => c.id === catId)) return true;
      if (catName && p.categories?.some((c) => c.name?.toLowerCase() === catName)) return true;
      return false;
    });

    if (sameCat.length < 4) {
      const otherItems = allProducts.filter(
        (p) => p.id !== product.id && p.isVisible !== false && !sameCat.some((sc) => sc.id === p.id)
      );
      return [...sameCat, ...otherItems].slice(0, 4);
    }
    return sameCat.slice(0, 4);
  }, [allProducts, product, primaryCategory]);

  const handleWeightChange = (val: string) => {
    setSelectedWeight(val);
    const newWeightObj = weightOptions.find(w => w.value === val) || weightOptions[0];
    const newMaxQty = Math.max(1, Math.floor(3.0 / newWeightObj.weightKg));
    if (quantity > newMaxQty) {
      setQuantity(newMaxQty);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    setFeedbackError(null);
    const res = addItem(product, selectedWeight, quantity);
    if (!res.success) {
      setFeedbackError(res.message || 'Maximum 3 KG limit exceeded per item.');
      return;
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    setFeedbackError(null);
    const res = addItem(product, selectedWeight, quantity);
    if (!res.success) {
      setFeedbackError(res.message || 'Maximum 3 KG limit exceeded per item.');
      return;
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-16 bg-[#FDFBF7] text-[#260A04]">
        <div className="w-10 h-10 border-3 border-[#8B1E0F] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-sm tracking-wide">Loading authentic product details...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] pt-32 pb-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-4 shadow-sm">
          <Sparkles size={28} />
        </div>
        <h2 className="text-2xl font-black text-[#260A04] mb-2">Product Not Found</h2>
        <p className="text-gray-600 text-sm mb-6 max-w-md">The requested delicacy could not be found or has moved.</p>
        <Link 
          to="/categories" 
          className="bg-[#8B1E0F] hover:bg-amber-800 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md transition"
        >
          Browse All Categories
        </Link>
      </div>
    );
  }

  const fallbackImage = "/images/premium_snacks.jpg";
  const imageToUse = product.imageUrl ? product.imageUrl : fallbackImage;

  const categoryTitle = getCategoryName(primaryCategory?.name || 'Traditional Delicacy');

  const breadcrumbItems = [
    { name: t('nav.categories'), url: '/categories' },
    ...(primaryCategory ? [{ name: categoryTitle, url: `/category/${primaryCategory.id}` }] : []),
    { name: isTelugu ? getProductName(product.name) : product.name, url: `/product/${product.slug}` }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#FDFBF7] min-h-screen pt-28 sm:pt-32 pb-20"
    >
      <SEO
        title={product.name}
        description={product.description || product.shortDescription || `Buy authentic handcrafted ${product.name} online from Sri Telangana Ruchulu.`}
        image={product.imageUrl}
        ogType="product"
        canonical={`/product/${product.slug}`}
        jsonLd={generateProductSchema(product)}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumbs Navigation */}
        <div className="mb-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Back Link */}
        <div className="mb-6">
          <Link 
            to={primaryCategory ? `/category/${primaryCategory.id}` : '/categories'} 
            className="inline-flex items-center text-xs sm:text-sm font-bold text-[#8B1E0F] hover:text-amber-800 transition group"
          >
            <ArrowLeft size={16} className="mr-1.5 transform group-hover:-translate-x-1 transition" /> 
            {t('prod.backTo')} {categoryTitle}
          </Link>
        </div>

        {/* Main Product Showcase Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-amber-900/10 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            
            {/* Left: Product Image & Heritage Badges */}
            <div className="flex flex-col">
              <div className="relative rounded-2xl overflow-hidden bg-amber-50/40 border border-amber-900/10 aspect-square flex items-center justify-center p-4 group">
                <img 
                  src={imageToUse} 
                  alt={product.name} 
                  onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
                  className="w-full h-full object-cover rounded-xl transition duration-500 ease-out group-hover:scale-105" 
                />

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-white/20 shadow-xs">
                    <Sparkles size={12} className="text-amber-300" /> {t('trust.traditional')}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#8B1E0F]/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    <Flame size={12} className="text-amber-300" /> {t('trust.warangal')}
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-amber-100 text-[#8B1E0F] border border-amber-300 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                    500g - 3 KG
                  </span>
                </div>
              </div>

              {/* Trust Badges under Image */}
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-2.5">
                  <Award size={18} className="text-[#8B1E0F] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-gray-800 block">{t('trust.coldPressed')}</span>
                </div>
                <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-2.5">
                  <ShieldCheck size={18} className="text-emerald-700 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-gray-800 block">{t('trust.zeroPreservatives')}</span>
                </div>
                <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-2.5">
                  <PackageCheck size={18} className="text-amber-700 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-gray-800 block">{t('trust.multiLayer')}</span>
                </div>
              </div>
            </div>

            {/* Right: Buy Box & Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#8B1E0F] bg-amber-100/70 border border-amber-200 px-3 py-0.5 rounded-full">
                    {categoryTitle}
                  </span>
                </div>

                {/* Titles */}
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black text-[#260A04] tracking-tight leading-tight mb-1 ${isTelugu ? 'font-telugu' : ''}`}>
                  {isTelugu ? getProductName(product.name) : product.name}
                </h1>
                <p className="text-sm sm:text-base text-amber-800 font-bold mb-4">
                  {isTelugu ? product.name : getTeluguTranslation(product.name)}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-gray-100">
                  <span className="text-3xl sm:text-4xl font-black text-[#260A04]">
                    ₹{totalPrice}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 font-bold">
                    ({currentWeightObj.label} @ ₹{product.price}/KG)
                  </span>
                  {product.regularPrice > product.price && (
                    <span className="text-base text-gray-400 line-through">
                      ₹{Math.round(product.regularPrice * currentWeightObj.weightKg * quantity)}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 font-medium">
                  {product.shortDescription || product.description || 'Authentic traditional recipe crafted with care and premium ingredients in Warangal.'}
                </p>

                {/* Weight / Pack Variant Selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-extrabold text-[#5C2B10] uppercase tracking-wider">
                      {t('prod.selectPack')}
                    </label>
                    <span className="text-xs text-[#8B1E0F] font-bold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                      Selected: {currentWeightObj.label} ({quantity} pack = {currentTotalItemWeight} KG)
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {weightOptions.map((opt) => {
                      const isSelected = selectedWeight === opt.value;
                      const optPrice = Math.round(product.price * opt.weightKg);
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleWeightChange(opt.value)}
                          className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#8B1E0F] bg-[#8B1E0F] text-white font-bold shadow-xs'
                              : 'border-gray-200 bg-gray-50 hover:bg-amber-50/60 text-gray-800 font-semibold'
                          }`}
                        >
                          <div className="text-xs sm:text-sm font-extrabold">{opt.label}</div>
                          <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-200' : 'text-gray-500'}`}>
                            ₹{optPrice}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5 font-medium">
                    * {t('prod.weightDesc')}
                  </p>
                </div>

                {/* Stock Status */}
                <div className="mb-5 flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${product.isInStock ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <span className={`font-bold text-xs sm:text-sm ${product.isInStock ? 'text-emerald-700' : 'text-red-600'}`}>
                    {product.isInStock ? t('prod.inStock') : t('prod.outOfStock')}
                  </span>
                </div>

                {feedbackError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                    ⚠️ {feedbackError}
                  </div>
                )}

                {/* Quantity & CTA Buttons (Amazon Standard) */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white h-12 w-32 flex-shrink-0">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full hover:bg-gray-100 transition flex items-center justify-center text-gray-700 cursor-pointer"
                      disabled={!product.isInStock || quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="flex-1 text-center font-black text-sm">{quantity}</div>
                    <button 
                      onClick={() => {
                        if (quantity < maxAllowedQuantity) {
                          setQuantity(quantity + 1);
                        } else {
                          alert(`Cannot exceed 3 KG for this product. Maximum is ${maxAllowedQuantity} pack(s) of ${currentWeightObj.label}.`);
                        }
                      }}
                      className="w-10 h-full hover:bg-gray-100 transition flex items-center justify-center text-gray-700 cursor-pointer"
                      disabled={!product.isInStock || quantity >= maxAllowedQuantity}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={handleAddToCart}
                    disabled={!product.isInStock}
                    className={`flex-1 h-12 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                      product.isInStock 
                        ? isAdded 
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#8B1E0F] hover:bg-[#72180C] text-white active:scale-98'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={18} /> {t('prod.added')} {currentTotalItemWeight} KG!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} /> {t('prod.addToCart')} (₹{totalPrice})
                      </>
                    )}
                  </button>

                  {/* Buy Now Button (Amazon Style) */}
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.isInStock}
                    className="h-12 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Zap size={16} /> {t('prod.buyNow')}
                  </button>
                </div>

                {/* Delivery Information Callout */}
                <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3.5 text-xs text-gray-800 space-y-1.5">
                  <div className="font-extrabold flex items-center gap-1.5 text-[#5C2B10]">
                    <Truck size={15} className="text-[#8B1E0F]" /> {t('prod.deliveryPromise')}
                  </div>
                  <p>• {t('prod.deliveryLocal')}</p>
                  <p>• {t('prod.deliveryAllIndia')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs: About, Ingredients & Storage Instructions */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex gap-4 border-b border-gray-200 pb-3">
              <button
                onClick={() => setActiveTab('about')}
                className={`text-sm font-extrabold pb-2 border-b-2 transition cursor-pointer ${
                  activeTab === 'about' 
                    ? 'border-[#8B1E0F] text-[#8B1E0F]' 
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {t('prod.tab.about')}
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`text-sm font-extrabold pb-2 border-b-2 transition cursor-pointer ${
                  activeTab === 'ingredients' 
                    ? 'border-[#8B1E0F] text-[#8B1E0F]' 
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {t('prod.tab.ingredients')}
              </button>
              <button
                onClick={() => setActiveTab('storage')}
                className={`text-sm font-extrabold pb-2 border-b-2 transition cursor-pointer ${
                  activeTab === 'storage' 
                    ? 'border-[#8B1E0F] text-[#8B1E0F]' 
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {t('prod.tab.storage')}
              </button>
            </div>

            <div className="pt-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              {activeTab === 'about' && (
                <div className="space-y-2">
                  <p>{t('prod.tab.aboutDesc1')}</p>
                  <p>{t('prod.tab.aboutDesc2')}</p>
                </div>
              )}
              {activeTab === 'ingredients' && (
                <div className="space-y-2">
                  <p>{t('prod.tab.ingDesc')}</p>
                </div>
              )}
              {activeTab === 'storage' && (
                <div className="space-y-2">
                  <p>• {t('prod.tab.storageDesc1')}</p>
                  <p>• {t('prod.tab.storageDesc2')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RELATED CATEGORY ITEMS (Amazon standard: Customers Also Viewed / More from this category) */}
        {relatedProducts.length > 0 && (
          <section className="mt-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#8B1E0F] bg-amber-100/70 border border-amber-200 px-3 py-1 rounded-full">
                  {t('prod.related.tag')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#260A04] tracking-tight mt-2">
                  {t('prod.related.title')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                  {isTelugu
                    ? `ఈ ${getProductName(product.name)} ని ఇష్టపడినవారు వీటిని కూడా ఆర్డర్ చేశారు.`
                    : `Customers who loved ${product.name} also ordered these authentic ${primaryCategory?.name || 'favorites'}.`}
                </p>
              </div>

              {primaryCategory && (
                <Link 
                  to={`/category/${primaryCategory.id}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8B1E0F] hover:text-amber-800 transition group self-start sm:self-auto"
                >
                  {t('prod.viewAll')} {categoryTitle} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {/* 4-Item Related Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}

      </div>
    </motion.div>
  );
};
