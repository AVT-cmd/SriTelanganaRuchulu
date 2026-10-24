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
  defaultTitle: 'Sri Telangana Ruchulu | Authentic Traditional Pickles, Sweets & Snacks',
  titleTemplate: '%s | Sri Telangana Ruchulu',
  defaultDescription: 'Taste the authentic heritage of Telangana & Andhra with handcrafted veg & non-veg pickles, traditional sweets, crunchy sakinalu, and aromatic spice podulu. Freshly made in Warangal.',
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
    phone: '+91 98765 43210',
    email: 'contact@sritelanganaruchulu.com',
    address: {
      street: 'Collectorate Road, Subedari',
      city: 'Warangal',
      state: 'Telangana',
      postalCode: '506001',
      country: 'IN'
    }
  },
  social: {
    instagram: 'https://instagram.com/sritelanganaruchulu',
    facebook: 'https://facebook.com/sritelanganaruchulu'
  }
};
