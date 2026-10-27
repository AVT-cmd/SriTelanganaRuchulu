export interface SEOConfig {
  siteName: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  siteUrl: string;
  defaultOgImage: string;
  defaultKeywords: string[];
  contact: {
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  social: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
}

export const defaultSeoConfig: SEOConfig = {
  siteName: 'Sri Telangana Ruchulu',
  defaultTitle: 'Sri Telangana Ruchulu | Traditional Pickles & Sweets',
  titleTemplate: '%s | Sri Telangana Ruchulu',
  defaultDescription: 'Authentic Telangana & Andhra pickles, handcrafted sweets, crunchy sakinalu, and spice podulu made fresh in Warangal. Order online with express delivery.',
  siteUrl: 'https://sritelanganaruchulu.com',
  defaultOgImage: '/og-image.jpg',
  defaultKeywords: [
    'telangana pickles',
    'andhra pickles online',
    'authentic avakaya pickle',
    'gongura pachadi online',
    'homemade sakinalu',
    'traditional sweets telangana',
    'spicy chicken pickle',
    'mutton pickle warangal',
    'pure ghee ariselu',
    'karivepaku podi',
    'sri telangana ruchulu'
  ],
  contact: {
    phone: '+91 81213 45585',
    email: 'sritelaganaruchuluu@gmail.com',
    address: {
      street: 'Collectorate Road, Subedari',
      city: 'Warangal',
      state: 'Telangana',
      postalCode: '506001',
      country: 'IN'
    }
  },
  social: {
    instagram: 'https://www.instagram.com/sri_telangana_ruchulu?cplk=YmN0dWRxdjR5NTB5&utm_source=qr',
    facebook: 'https://www.facebook.com/share/14upezoYuLw/?mibextid=wwXIfr'
  }
};
