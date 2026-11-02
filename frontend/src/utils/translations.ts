import { useLanguageStore } from '../store/languageStore';

export const productTeluguMap: Record<string, string> = {
  // Veg Pickles
  'Mixed Vegetable Pachadi': 'మిక్స్‌డ్ వెజిటబుల్ పచ్చడి',
  'Gongura Pachadi': 'గోంగూర పచ్చడి',
  'Allam Pachadi': 'అల్లం పచ్చడి',
  'Chintakaya Pachadi': 'చింతకాయ పచ్చడి',
  'Usirikaya Pachadi': 'ఉసిరికాయ పచ్చడి',
  'Mamidikaya Pachadhi': 'మామిడికాయ ఆవకాయ పచ్చడి',
  'Nimkaya Pachadhi': 'నిమ్మకాయ పచ్చడి',
  'Tomoto Pachadi': 'టమాటా నిల్వ పచ్చడి',
  'Pulihora Pulusu': 'సాంప్రదాయ పులిహోర పులుసు',

  // Sweets
  'Thati Bellam Palli Laddu': 'తాటి బెల్లం పల్లి లడ్డు',
  'Badhusha Neyi': 'నేతి బాదుషా',
  'Madatha Kaja': 'మడత కాజా',
  'Paramannam': 'సాంప్రదాయ పరమాన్నం',
  'Chakkera Pongali': 'చక్కెర పొంగలి',
  'Poornalu': 'పూర్ణాలు / బూరెలు',
  'Boondi Achu': 'బెల్లం బూందీ అచ్చు',
  'Kobbari Burelu': 'కొబ్బరి బూరెలు',
  'Chalimidi': 'బెల్లం చలిమిడి',
  'Kova Garijalu': 'కోవా గరిజెలు',
  'Mothichur Laddu': 'మోతీచూర్ లడ్డు',
  'Avisa Laddu': 'అవిసె గింజల లడ్డు',
  'Godhuma  Gavvalu': 'గోధుమ బెల్లం గవ్వలు',
  'Neyi Maysoor Pak': 'స్వచ్ఛమైన నేతి మైసూర్ పాక్',
  'Ragi Laddu': 'రాగి లడ్డు',
  'Dry Fruit Laddu': 'డ్రై ఫ్రూట్ లడ్డు',
  'Ravva Laddu': 'రవ్వ లడ్డు',
  'Bellam Pusa': 'బెల్లం పూస',
  'Neti Ariselu': 'నేతి అరిసెలు',
  'Pineapple Halwa': 'పైనాపిల్ హల్వా',
  'Nuvvula Ariselu': 'నువ్వుల అరిసెలు',
  'Bakshalu': 'బక్షాలు / బొబ్బట్లు',
  'Milk Mysore pak': 'మిల్క్ మైసూర్ పాక్',
  'Mysore pak': 'మైసూర్ పాక్',
  'Sunnundalu': 'బెల్లం సున్నుండలు',
  'Gavvalu': 'తీపి గవ్వలు',
  'Nuvvula Laddu': 'నువ్వుల లడ్డు',
  'Palli Laddu': 'పల్లి లడ్డు',
  'Badusha': 'రుచికరమైన బాదుషా',
  'Madata Penilu': 'మడత పేణీలు',
  'Laddu': 'తిరుపతి సాంప్రదాయ లడ్డు',
  'Ariselu': 'తెలంగాణ అరిసెలు',

  // Podulu
  'Munagaku Podi': 'మునగాకు పొడి',
  'Royya Pottu Karam': 'రొయ్య పొట్టు కారం',
  'Kandi Podi': 'గుంటూరు కంది పొడి',
  'Vellulli Karam': 'వెల్లుల్లి కారం పొడి',
  'Karivepaku Podi': 'కరివేపాకు పొడి',

  // Non Veg Pickles
  'Chepala Pachadi': 'చేపల పచ్చడి',
  'Royalla Pachadi': 'రొయ్యల పచ్చడి',
  'Kheema Mutton Pachadi': 'ఖీమా మటన్ పచ్చడి',
  'Mutton Pachadi': 'మటన్ పచ్చడి',
  'Chicken Pachadi': 'చికెన్ పచ్చడి',

  // Hot Snacks
  'Ragi Garelu': 'రాగి గారెలు',
  'Ragi Murukkulu': 'రాగి మురుకులు',
  'Sarva Pindi': 'తెలంగాణ సర్వ పిండి',
  'Sana Pusa': 'కారప్పూస / సన్న పూస',
  'Madugulu': 'మడుగులు',
  'Karam Boondi': 'కారం బూందీ',
  'Chuduva': 'చుడువా / అటుకుల మిక్చర్',
  'Murukkulu': 'జంతికలు / మురుకులు',
  'Karam Sakinalu': 'కారం సకినాలు',
  'Sakinalu': 'సంప్రదాయ సకినాలు',
  'Pappu Garalu': 'పప్పు గారెలు',
  'Palli Garalu': 'పల్లి గారెలు'
};

export const categoryTeluguMap: Record<string, string> = {
  'Veg Pickles': 'శాకాహార పచ్చళ్ళు',
  'Sweets': 'మిఠాయిలు',
  'Podulu': 'కారం పొడులు',
  'Non Veg Pickles': 'మాంసాహార పచ్చళ్ళు',
  'Hot Snacks': 'పిండివంటలు & స్నాక్స్'
};

export const uiTranslations: Record<string, { en: string; te: string }> = {
  // Navigation
  'nav.home': { en: 'Home', te: 'హోమ్' },
  'nav.categories': { en: 'Categories', te: 'కేటగిరీలు' },
  'nav.about': { en: 'About Us', te: 'మా గురించి' },
  'nav.search': { en: 'Search products...', te: 'రుచులను శోధించండి...' },
  'nav.login': { en: 'Login / Sign Up', te: 'లాగిన్ / రిజిస్టర్' },
  'nav.cart': { en: 'Cart', te: 'కార్ట్' },
  'nav.admin': { en: 'Admin Dashboard', te: 'అడ్మిన్ డాష్‌బోర్డ్' },
  'nav.profile': { en: 'Profile', te: 'ప్రొఫైల్' },

  // Hero Section
  'hero.tagline': { en: 'PURE TRADITIONAL FLAVORS', te: 'అచ్చమైన సంప్రదాయ రుచులు' },
  'hero.title': { en: 'Sri Telangana Ruchulu', te: 'శ్రీ తెలంగాణ రుచులు' },
  'hero.subtitle': { 
    en: 'Authentic pickles, handcrafted sweets & crunchy traditional snacks made fresh in Warangal with pure cold-pressed oils & zero preservatives.',
    te: 'వరంగల్ సంప్రదాయ పద్ధతుల్లో, స్వచ్ఛమైన గానుగ నూనెలు మరియు ఎటువంటి ప్రిజర్వేటివ్స్ లేకుండా తయారుచేసిన తాజా పచ్చళ్ళు, తీపి మరియు పిండివంటలు.'
  },
  'hero.cta.order': { en: 'Order Fresh Delicacies', te: 'ఇప్పుడే ఆర్డర్ చేయండి' },
  'hero.cta.explore': { en: 'Explore All Categories', te: 'కేటగిరీలను చూడండి' },

  // Home Sections
  'home.hero.badge': { en: 'Authentic Telangana & Andhra Kitchen', te: 'అచ్చమైన తెలంగాణ & ఆంధ్ర కిచెన్' },
  'home.hero.explore': { en: 'Explore All Products', te: 'అన్ని రుచులను చూడండి' },
  'home.hero.heritage': { en: 'Our Heritage', te: 'మా వారసత్వం' },
  'home.slide1.title': { en: 'The Authentic Taste of Telangana', te: 'తెలంగాణ అచ్చమైన రుచులు' },
  'home.slide1.sub': { en: "Discover traditional flavours, beloved recipes, and the goodness of Telangana's food heritage.", te: 'సంప్రదాయ రుచులు, నాటి వంటకాలు మరియు తెలంగాణ ఆహార సంస్కృతిని ఆస్వాదించండి.' },
  'home.slide2.title': { en: 'Fresh & Homemade Pindi Vantalu', te: 'తాజా ఇంటి పిండివంటలు' },
  'home.slide2.sub': { en: 'Crafted with love, premium ingredients, and zero preservatives.', te: 'స్వచ్ఛమైన పదార్థాలు మరియు ప్రిజర్వేటివ్స్ లేకుండా ప్రేమతో తయారుచేసినవి.' },
  'home.slide3.title': { en: 'Delivered Across the Globe', te: 'ప్రపంచవ్యాప్తంగా డెలివరీ' },
  'home.slide3.sub': { en: 'Experience the magic of your hometown, no matter where you live.', te: 'మీరు ఎక్కడ ఉన్నా మీ సొంతూరి రుచుల మధురానుభూతిని పొందండి.' },
  'home.categories.tag': { en: 'Handcrafted Delicacies', te: 'చేతితో చేసిన ప్రత్యేక రుచులు' },
  'home.categories.title': { en: 'Explore Traditional Categories', te: 'సాంప్రదాయ కేటగిరీలు' },
  'home.categories.sub': { en: 'Fresh batches prepared in Warangal with pure traditional ingredients.', te: 'స్వచ్ఛమైన సంప్రదాయ పదార్థాలతో వరంగల్‌లో తయారైన తాజా బ్యాచ్‌లు.' },
  'home.categories.viewAll': { en: 'View All Categories', te: 'అన్ని కేటగిరీలు చూడండి' },
  'home.bestsellers.tag': { en: 'Patron Favorites', te: 'అందరికీ ఇష్టమైనవి' },
  'home.bestsellers.title': { en: 'Authentic Bestsellers & Fresh Batches', te: 'ప్రసిద్ధ బెస్ట్ సెల్లర్స్ & తాజా బ్యాచ్‌లు' },
  'home.bestsellers.subtitle': { 
    en: 'Made in Warangal with cold-pressed oil, stone-ground spices & zero preservatives.',
    te: 'గానుగ నూనె, దంచిన మసాలాలు మరియు ఎటువంటి రసాయనాలు లేకుండా వరంగల్‌లో తయారు చేయబడినవి.'
  },
  'home.browseCatalog': { en: 'Browse Full Catalog', te: 'మొత్తం రుచులను చూడండి' },
  'home.exploreCategories': { en: 'Explore Our Categories', te: 'మా ప్రత్యేక కేటగిరీలు' },
  'home.why.tag': { en: 'Uncompromising Quality', te: 'రాజీలేని నాణ్యత' },
  'home.why.title': { en: 'Why Choose Sri Telangana Ruchulu?', te: 'శ్రీ తెలంగాణ రుచులను ఎందుకు ఎంచుకోవాలి?' },
  'home.why.sub': { en: 'Experience the pinnacle of traditional culinary excellence with our carefully curated processes.', te: 'తరతరాల నాటి ప్రత్యేక పద్ధతులతో తయారుచేసిన అత్యుత్తమ రుచులను అనుభవించండి.' },
  'home.why.f1.title': { en: 'Generational Recipes', te: 'తరతరాల వంటకాలు' },
  'home.why.f1.desc': { en: 'Authentic formulas passed down through families, preserving the exact taste of the past.', te: 'కుటుంబాల ద్వారా అందించబడిన నిజమైన రుచులు మరియు పూర్వపు సాంప్రదాయం.' },
  'home.why.f2.title': { en: 'Premium Ingredients', te: 'నాణ్యమైన పదార్థాలు' },
  'home.why.f2.desc': { en: 'Zero compromises on quality. We use only the finest spices, cold-pressed oils, and farm grains.', te: 'శ్రేష్టమైన మసాలాలు, గానుగ నూనెలు మరియు పొలాల నుంచి సేకరించిన ధాన్యాలు మాత్రమే.' },
  'home.why.f3.title': { en: 'Global Delivery', te: 'గ్లోబల్ డెలివరీ' },
  'home.why.f3.desc': { en: 'Vacuum-sealed for ultimate freshness and shipped worldwide directly to your doorstep.', te: 'తాజాదనం తగ్గకుండా వాక్యూమ్ సీల్డ్ ప్యాకింగ్ చేసి మీ ఇంటి వద్దకే డెలివరీ.' },
  'home.heritage.tag': { en: 'Our Heritage', te: 'మా సంస్కృతి' },
  'home.heritage.title': { en: 'A Culinary Journey Back in Time', te: 'నాటి సంప్రదాయ రుచుల ప్రయాణం' },
  'home.heritage.years': { en: 'Years of Traditional Legacy', te: 'సంవత్సరాల సాంప్రదాయ వారసత్వం' },
  'home.heritage.btn': { en: 'Discover Our Full History', te: 'మా పూర్తి కథనం చదవండి' },
  'home.bulk.tag': { en: 'Special Occasions & Corporate', te: 'శుభకార్యాలు & కార్పొరేట్ ఈవెంట్స్' },
  'home.bulk.title': { en: 'We Accept Bulk & Corporate Orders', te: 'మేము బల్క్ & శుభకార్యాల ఆర్డర్లు తీసుకుంటాము' },
  'home.bulk.desc': { en: 'Make your weddings, corporate events, and family gatherings unforgettable with our authentic Telangana delicacies.', te: 'మీ పెళ్లిళ్లు, వేడుకలు మరియు పండుగలను మా అచ్చమైన తెలంగాణ పిండివంటలతో మరింత ప్రత్యేకంగా చేసుకోండి.' },
  'home.bulk.btn': { en: 'Enquire for Bulk Order', te: 'బల్క్ ఆర్డర్ కొరకు సంప్రదించండి' },
  'home.reviews.tag': { en: 'Customer Love', te: 'వినియోగదారుల ఆదరణ' },
  'home.reviews.title': { en: 'What Our Community Says', te: 'మా కస్టమర్లు ఏమంటున్నారు' },
  'home.reviews.sub': { en: 'Join thousands of families across the globe who trust us for their authentic cravings.', te: 'స్వచ్ఛమైన తెలంగాణ రుచుల కోసం మమ్మల్ని విశ్వసించే వేలాది కుటుంబాలలో మీరు చేరండి.' },

  // Instagram Reels Section
  'reels.tag': { en: 'Trending on Instagram', te: 'ఇన్‌స్టాగ్రామ్‌లో ట్రెండింగ్' },
  'reels.title': { en: 'Watch Our Kitchen in Action', te: 'మా వంటశాల వీడియోలు & రీల్స్' },
  'reels.subtitle': { 
    en: 'Behind-the-scenes authentic preparation of Warangal pickles, sweets, and crunchy snacks.', 
    te: 'వరంగల్ సంప్రదాయ పద్ధతుల్లో ఘుమఘుమలాడే పచ్చళ్ళు, తీపి మరియు పిండివంటల తయారీ వీడియోలు.' 
  },
  'reels.follow': { en: 'Follow @sri_telangana_ruchulu', te: 'ఇన్‌స్టాగ్రామ్‌లో ఫాలో అవ్వండి' },
  'reels.watchOnInsta': { en: 'Watch on Instagram', te: 'ఇన్‌స్టాగ్రామ్‌లో చూడండి' },
  'reels.shopDelicacy': { en: 'Shop This Delicacy', te: 'ఈ రుచిని ఆర్డర్ చేయండి' },
  'reels.views': { en: 'views', te: 'వీక్షణలు' },

  // Categories Page
  'cat.tag': { en: 'Handcrafted Heritage Collections', te: 'వారసత్వ సంప్రదాయ రుచులు' },
  'cat.title': { en: 'Explore Categories', te: 'రుచుల కేటగిరీలు' },
  'cat.subtitle': { 
    en: 'Discover our premium selection of authentic Telangana foods, made with cold-pressed oils, stone-ground spices & zero preservatives.',
    te: 'గానుగ నూనెలు, రాతి రోట్లో దంచిన మసాలాలతో ఆరోగ్యకరంగా చేసిన అచ్చమైన తెలంగాణ రుచులను ఆస్వాదించండి.'
  },
  'cat.viewCategory': { en: 'View Collection', te: 'రుచులను చూడండి' },
  'cat.view': { en: 'View', te: 'చూడండి' },
  'cat.viewProducts': { en: 'View Products', te: 'రుచులను చూడండి' },
  'cat.freshBatches': { en: 'Fresh Batches', te: 'తాజా బ్యాచ్‌లు' },
  'cat.items': { en: 'Items', te: 'రకాలు' },

  // Product Card & Detail
  'prod.addToCart': { en: 'Add to Cart', te: 'కార్ట్‌కు జోడించు' },
  'prod.added': { en: 'Added!', te: 'జోడించబడింది!' },
  'prod.buyNow': { en: 'Buy Now', te: 'ఇప్పుడే కొనండి' },
  'prod.inCart': { en: 'in Cart', te: 'కార్ట్‌లో ఉన్నాయి' },
  'prod.pack': { en: 'Pack', te: 'ప్యాక్' },
  'prod.selectPack': { en: 'Select Pack Size:', te: 'ప్యాక్ పరిమాణం ఎంచుకోండి:' },
  'prod.minOrder': { en: 'Min Order', te: 'కనిష్ట ఆర్డర్' },
  'prod.mostPopular': { en: 'Most Popular', te: 'అత్యంత ప్రజాదరణ' },
  'prod.familyPack': { en: 'Family Pack', te: 'ఫ్యామిలీ ప్యాక్' },
  'prod.maxOrder': { en: 'Max Order', te: 'గరిష్ట ఆర్డర్' },
  'prod.inStock': { en: 'In Stock • Fresh batch made ready for delivery', te: 'స్టాక్‌లో ఉంది • డెలివరీకి సిద్ధంగా ఉన్న తాజా బ్యాచ్' },
  'prod.outOfStock': { en: 'Out of Stock', te: 'స్టాక్ ముగిసింది' },
  'prod.weightDesc': { en: 'Available in packs from 500g up to 3 KG maximum order per customer.', te: '500 గ్రాముల నుండి గరిష్టంగా 3 కేజీల వరకు ఆర్డర్ చేయవచ్చు.' },
  
  // Detail Tabs
  'prod.tab.about': { en: 'About this Delicacy', te: 'ఈ రుచి గురించి' },
  'prod.tab.ingredients': { en: 'Ingredients & Spices', te: 'పదార్థాలు & మసాలాలు' },
  'prod.tab.storage': { en: 'Storage & Shelf Life', te: 'నిల్వ & వాడే విధానం' },
  'prod.deliveryPromise': { en: 'Delivery & Shipping Promise:', te: 'డెలివరీ మరియు షిప్పింగ్ హామీ:' },
  'prod.deliveryLocal': { en: 'Kazipet, Hanamkonda & Warangal: FREE Delivery on orders above 1 KG.', te: 'కాజీపేట్, హనుమకొండ & వరంగల్: 1 కేజీ పైబడిన ఆర్డర్లపై ఉచిత డెలివరీ.' },
  'prod.deliveryAllIndia': { en: 'Hyderabad & All India: Fast doorstep dispatch via express courier.', te: 'హైదరాబాద్ & భారతదేశమంతటా: ఎక్స్‌ప్రెస్ కొరియర్ ద్వారా వేగవంతమైన డెలివరీ.' },
  'prod.tab.aboutDesc1': { 
    en: 'Prepared fresh in Warangal by experienced culinary artisans using recipes perfected over generations. We follow traditional stone-mortar (Rolu) pounding techniques to retain the authentic essential oils and intense flavor profiles.', 
    te: 'తరతరాలుగా వస్తున్న పద్ధతుల్లో అనుభవజ్ఞులైన వంట కళాకారులచే వరంగల్‌లో తాజాగా తయారు చేయబడినవి. రాతి రోట్లో దంచే పద్ధతి ద్వారా సహజ నూనెలు మరియు గాఢమైన రుచి అలాగే నిలుస్తాయి.' 
  },
  'prod.tab.aboutDesc2': { 
    en: 'Zero chemical preservatives, synthetic colors, or artificial flavor enhancers are ever used. 100% genuine homemade food.', 
    te: 'ఎటువంటి కృత్రిమ రసాయనాలు, రంగులు లేదా రుచిని పెంచే పౌడర్లు ఉపయోగించలేదు. 100% నిజమైన ఇంటి వంట.' 
  },
  'prod.tab.ingDesc': { 
    en: 'Key Ingredients: Freshly sourced seasonal farm produce, Guntur & Warangal red chilies, pure wooden-mill cold pressed gingelly / sesame oil, rock salt, hand-roasted fenugreek, mustard, garlic, and ancestral masala spices.', 
    te: 'ముఖ్య పదార్థాలు: పొలాల నుండి సేకరించిన తాజా కాయగూరలు, గుంటూరు & వరంగల్ ఎండు మిరపకాయలు, స్వచ్ఛమైన చెక్క గానుగ నువ్వుల నూనె, సైంధవ లవణం, వేయించిన మెంతులు, ఆవాలు, వెల్లుల్లి మరియు సాంప్రదాయ మసాలాలు.' 
  },
  'prod.tab.storageDesc1': { 
    en: 'Shelf Life: 6 to 12 months from the packaging date.', 
    te: 'నిల్వ సమయం: ప్యాకింగ్ తేదీ నుండి 6 నుండి 12 నెలల వరకు.' 
  },
  'prod.tab.storageDesc2': { 
    en: 'Storage Instructions: Store in a cool, dry place away from direct sunlight. Always use a clean, dry spoon to preserve fresh crispness and flavor.', 
    te: 'నిల్వ జాగ్రత్తలు: తేమ లేని, చల్లని ప్రదేశంలో నిల్వ చేయండి. తాజాగా మరియు కరకరలాడుతూ ఉండటానికి ఎల్లప్పుడూ పొడి చెంచాను మాత్రమే వాడండి.' 
  },

  // Related Delicacies
  'prod.related.tag': { en: 'More From This Category', te: 'ఈ కేటగిరీలోని మరిన్ని రుచులు' },
  'prod.related.title': { en: 'Related Traditional Delicacies', te: 'సంబంధిత సంప్రదాయ రుచులు' },
  'prod.related.subtitle': { en: 'Customers who loved this item also ordered these favorites.', te: 'ఈ రుచిని ఇష్టపడిన వినియోగదారులు వీటిని కూడా ఆర్డర్ చేశారు.' },
  'prod.viewAll': { en: 'View All in', te: 'మొత్తం చూడండి:' },
  'prod.backTo': { en: 'Back to', te: 'తిరిగి వెళ్ళండి:' },

  // Trust Badges
  'trust.traditional': { en: '100% Traditional', te: '100% సంప్రదాయబద్ధం' },
  'trust.warangal': { en: 'Warangal Recipe', te: 'వరంగల్ వంటకం' },
  'trust.coldPressed': { en: 'Cold-Pressed Oils', te: 'గానుగ నూనెలు' },
  'trust.zeroPreservatives': { en: 'Zero Preservatives', te: 'నో ప్రిజర్వేటివ్స్' },
  'trust.multiLayer': { en: 'Multi-Layer Sealed', te: 'సీల్డ్ ప్యాకింగ్' },

  // Search Modal
  'search.title': { en: 'Search Authentic Ruchulu', te: 'రుచులను శోధించండి' },
  'search.placeholder': { en: 'Search pickles, sweets, snacks, podulu...', te: 'పచ్చళ్ళు, స్వీట్లు, సకినాలు, కారం పొడులు...' },
  'search.popular': { en: 'Popular Searches', te: 'ప్రముఖ శోధనలు' },
  'search.noResults': { en: 'No delicacies found matching your search.', te: 'మీ శోధనకు సంబంధించిన రుచులు దొరకలేదు.' },
  'search.matchingProducts': { en: 'Matching Products', te: 'సంబంధిత రుచులు' },
  'search.viewCatalog': { en: 'View in full catalog →', te: 'పూర్తి కేటలాగ్‌లో చూడండి →' },
  'search.lookingAll': { en: 'Looking for all categories?', te: 'అన్ని కేటగిరీలు చూడాలనుకుంటున్నారా?' },
  'search.browseCatalogSub': { en: 'Browse our complete authentic catalog', te: 'మా పూర్తి రుచుల జాబితాను చూడండి' },
  'search.browseBtn': { en: 'Browse', te: 'చూడండి' },
  'search.viewAllMatching': { en: 'View all products matching', te: 'మొత్తం సంబంధిత రుచులను చూడండి:' },
  'search.viewAllStore': { en: 'Search All Store Products', te: 'మొత్తం రుచులలో శోధించండి' },
  'search.viewAllCats': { en: 'View All Categories', te: 'అన్ని కేటగిరీలు చూడండి' },
  'search.freshHomemade': { en: 'Fresh Homemade Telangana Flavours', te: 'వరంగల్ తాజా సంప్రదాయ రుచులు' },
  'search.noInstant': { en: 'No instant results found', te: 'ఫలితాలు కనిపించలేదు' },
  'search.viewAllResults': { en: 'View all results for', te: 'మొత్తం ఫలితాలను చూడండి:' },

  // Cart Page
  'cart.title': { en: 'Your Shopping Cart', te: 'మీ షాపింగ్ కార్ట్' },
  'cart.empty': { en: 'Your cart is empty', te: 'మీ కార్ట్ ఖాళీగా ఉంది' },
  'cart.emptySub': { en: 'Discover our delicious traditional Telangana treats and add your favorites to get started.', te: 'మా సాంప్రదాయ తెలంగాణ రుచులను చూసి మీకు నచ్చిన వాటిని కార్ట్‌కు జోడించండి.' },
  'cart.continue': { en: 'Continue Shopping', te: 'షాపింగ్ కొనసాగించండి' },
  'cart.orderSummary': { en: 'Order Summary', te: 'ఆర్డర్ వివరాలు' },
  'cart.subtotal': { en: 'Items Total', te: 'వస్తువుల మొత్తం' },
  'cart.shipping': { en: 'Delivery Charges', te: 'డెలివరీ ఛార్జీలు' },
  'cart.freeShipping': { en: 'FREE Delivery', te: 'ఉచిత డెలివరీ' },
  'cart.total': { en: 'Total Amount', te: 'మొత్తం చెల్లించవలసినది' },
  'cart.checkout': { en: 'Proceed to Checkout', te: 'చెక్‌అవుట్‌కు వెళ్ళండి' },
  'cart.clear': { en: 'Clear Cart', te: 'కార్ట్ ఖాళీ చేయండి' },
  'cart.weightNote': { en: 'Items weight:', te: 'మొత్తం బరువు:' },

  // Footer
  'footer.about': { 
    en: 'Authentic traditional Telangana Pindi Vantalu and Pachadlu, handcrafted with love and ancient recipes from the heart of Warangal.',
    te: 'వరంగల్ సంప్రదాయ ఇంటి వంటలు, నోరూరించే పచ్చళ్ళు, తీపి మరియు పిండివంటలను నేరుగా మీ ఇంటికి అందిస్తున్నాము.'
  },
  'footer.quickLinks': { en: 'Quick Links', te: 'ముఖ్యమైన లింకులు' },
  'footer.ourStory': { en: 'Our Story', te: 'మా కథ' },
  'footer.shopCategories': { en: 'Shop All Categories', te: 'అన్ని కేటగిరీలు' },
  'footer.myAccount': { en: 'My Account', te: 'నా ఖాతా' },
  'footer.trackOrder': { en: 'Track Order', te: 'ఆర్డర్ ట్రాకింగ్' },
  'footer.support': { en: 'Support', te: 'సహాయం' },
  'footer.faq': { en: 'FAQ', te: 'ప్రశ్నలు & సమాధానాలు' },
  'footer.shippingPolicy': { en: 'Shipping Policy', te: 'షిప్పింగ్ విధానం' },
  'footer.returnPolicy': { en: 'Return Policy', te: 'రిటర్న్ విధానం' },
  'footer.contact': { en: 'Contact', te: 'సంప్రదించండి' },
  'footer.contactUs': { en: 'Contact Us', te: 'మమ్మల్ని సంప్రదించండి' },
  'footer.warangalIndia': { en: 'Warangal, Telangana, India', te: 'వరంగల్, తెలంగాణ, భారతదేశం' },
  'footer.rights': { en: 'All rights reserved.', te: 'సర్వహక్కులు ప్రత్యేకించబడినవి.' },
  'footer.privacyPolicy': { en: 'Privacy Policy', te: 'గోప్యతా విధానం' },
  'footer.termsOfService': { en: 'Terms of Service', te: 'నిబంధనలు & షరతులు' },
  'footer.call': { en: 'Call / WhatsApp', te: 'కాల్ / వాట్సాప్' },
  'footer.email': { en: 'Email Support', te: 'ఇమెయిల్ సపోర్ట్' },
  'footer.location': { en: 'Warangal, Telangana - 506001', te: 'వరంగల్, తెలంగాణ - 506001' }
};

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);

  const t = (key: string): string => {
    const entry = uiTranslations[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  const getProductName = (englishName: string): string => {
    if (language === 'te') {
      return productTeluguMap[englishName] || englishName;
    }
    return englishName;
  };

  const getProductTeluguSub = (englishName: string): string => {
    return productTeluguMap[englishName] || '';
  };

  const getCategoryName = (englishCatName: string): string => {
    if (language === 'te') {
      return categoryTeluguMap[englishCatName] || englishCatName;
    }
    return englishCatName;
  };

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
    getProductName,
    getProductTeluguSub,
    getCategoryName,
    isTelugu: language === 'te',
    isEnglish: language === 'en'
  };
};

