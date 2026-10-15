import type { Product, Category } from '../types';

export const mockCategories: Category[] = [
  {
    "id": 1,
    "name": "Veg Pickles",
    "slug": "veg-pickles"
  },
  {
    "id": 2,
    "name": "Sweets",
    "slug": "sweets"
  },
  {
    "id": 3,
    "name": "Podulu",
    "slug": "podulu"
  },
  {
    "id": 4,
    "name": "Non Veg Pickles",
    "slug": "non-veg-pickles"
  },
  {
    "id": 5,
    "name": "Hot Snacks",
    "slug": "hot-snacks"
  }
];

export const mockProducts: Product[] = [
  {
    "id": 1,
    "name": "Mixed Vegetable Pachadi",
    "slug": "mixed-vegetable-pachadi",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 1,
        "name": "Veg Pickles",
        "slug": "veg-pickles"
      }
    ]
  },
  {
    "id": 2,
    "name": "Gongura Pachadi",
    "slug": "gongura-pachadi",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 1,
        "name": "Veg Pickles",
        "slug": "veg-pickles"
      }
    ]
  },
  {
    "id": 3,
    "name": "Allam Pachadi",
    "slug": "allam-pachadi",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 1,
        "name": "Veg Pickles",
        "slug": "veg-pickles"
      }
    ]
  },
  {
    "id": 4,
    "name": "Thati Bellam Palli Laddu",
    "slug": "thati-bellam-palli-laddu",
    "shortDescription": "",
    "description": "",
    "price": 500,
    "regularPrice": 500,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/31.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 5,
    "name": "Badhusha Neyi",
    "slug": "badhusha-neyi",
    "shortDescription": "",
    "description": "",
    "price": 500,
    "regularPrice": 500,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/4.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 6,
    "name": "Madatha Kaja",
    "slug": "madatha-kaja",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 7,
    "name": "Paramannam",
    "slug": "paramannam",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 8,
    "name": "Chakkera Pongali",
    "slug": "chakaaera-pongali",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 9,
    "name": "Poornalu",
    "slug": "poornalu",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 10,
    "name": "Boondi Achu",
    "slug": "boonndi-achu",
    "shortDescription": "",
    "description": "",
    "price": 500,
    "regularPrice": 500,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/27.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 11,
    "name": "Kobbari Burelu",
    "slug": "kobbari-burelu",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/43.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 12,
    "name": "Munagaku Podi",
    "slug": "munagaku-podi",
    "shortDescription": "",
    "description": "",
    "price": 600,
    "regularPrice": 600,
    "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 3,
        "name": "Podulu",
        "slug": "podulu"
      }
    ]
  },
  {
    "id": 13,
    "name": "Royya Pottu Karam",
    "slug": "royya-pottu-karam",
    "shortDescription": "",
    "description": "",
    "price": 600,
    "regularPrice": 600,
    "imageUrl": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 3,
        "name": "Podulu",
        "slug": "podulu"
      }
    ]
  },
  {
    "id": 14,
    "name": "Kandi Podi",
    "slug": "kandi-podi",
    "shortDescription": "",
    "description": "",
    "price": 600,
    "regularPrice": 600,
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 3,
        "name": "Podulu",
        "slug": "podulu"
      }
    ]
  },
  {
    "id": 15,
    "name": "Vellulli Karam",
    "slug": "vellulli-karam",
    "shortDescription": "",
    "description": "",
    "price": 600,
    "regularPrice": 600,
    "imageUrl": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 3,
        "name": "Podulu",
        "slug": "podulu"
      }
    ]
  },
  {
    "id": 16,
    "name": "Karivepaku Podi",
    "slug": "karivepaku-podi",
    "shortDescription": "",
    "description": "",
    "price": 600,
    "regularPrice": 600,
    "imageUrl": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 3,
        "name": "Podulu",
        "slug": "podulu"
      }
    ]
  },
  {
    "id": 17,
    "name": "Chepala Pachadi",
    "slug": "chepala-pachadi",
    "shortDescription": "",
    "description": "",
    "price": 2000,
    "regularPrice": 2000,
    "imageUrl": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 4,
        "name": "Non Veg Pickles",
        "slug": "non-veg-pickles"
      }
    ]
  },
  {
    "id": 18,
    "name": "Royalla Pachadi",
    "slug": "royalla-pachadi",
    "shortDescription": "",
    "description": "",
    "price": 2000,
    "regularPrice": 2000,
    "imageUrl": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 4,
        "name": "Non Veg Pickles",
        "slug": "non-veg-pickles"
      }
    ]
  },
  {
    "id": 19,
    "name": "Kheema Mutton Pachadi",
    "slug": "kheema-mutton-pachadi",
    "shortDescription": "",
    "description": "",
    "price": 2000,
    "regularPrice": 2000,
    "imageUrl": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 4,
        "name": "Non Veg Pickles",
        "slug": "non-veg-pickles"
      }
    ]
  },
  {
    "id": 20,
    "name": "Mutton Pachadi",
    "slug": "muttonn-pachadi",
    "shortDescription": "",
    "description": "",
    "price": 1800,
    "regularPrice": 1800,
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 4,
        "name": "Non Veg Pickles",
        "slug": "non-veg-pickles"
      }
    ]
  },
  {
    "id": 21,
    "name": "Chicken Pachadi",
    "slug": "chicken-pachadi",
    "shortDescription": "",
    "description": "",
    "price": 1250,
    "regularPrice": 1250,
    "imageUrl": "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 4,
        "name": "Non Veg Pickles",
        "slug": "non-veg-pickles"
      }
    ]
  },
  {
    "id": 22,
    "name": "Chintakaya Pachadi",
    "slug": "chintakaya-pachadi",
    "shortDescription": "",
    "description": "",
    "price": 500,
    "regularPrice": 500,
    "imageUrl": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 1,
        "name": "Veg Pickles",
        "slug": "veg-pickles"
      }
    ]
  },
  {
    "id": 23,
    "name": "Usirikaya Pachadi",
    "slug": "usirikaya-pachadi",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 1,
        "name": "Veg Pickles",
        "slug": "veg-pickles"
      }
    ]
  },
  {
    "id": 24,
    "name": "Mamidikaya Pachadhi",
    "slug": "mammidikaya-pachadhi",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/61.png",
    "isInStock": true,
    "categories": [
      {
        "id": 1,
        "name": "Veg Pickles",
        "slug": "veg-pickles"
      }
    ]
  },
  {
    "id": 25,
    "name": "Nimkaya Pachadhi",
    "slug": "nimkaya-pachadhi",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 1,
        "name": "Veg Pickles",
        "slug": "veg-pickles"
      }
    ]
  },
  {
    "id": 26,
    "name": "Tomoto Pachadi",
    "slug": "tomoto-pachadi",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 1,
        "name": "Veg Pickles",
        "slug": "veg-pickles"
      }
    ]
  },
  {
    "id": 27,
    "name": "Chalimidi",
    "slug": "chalimidi",
    "shortDescription": "",
    "description": "",
    "price": 300,
    "regularPrice": 300,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/39.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 28,
    "name": "Pulihora Pulusu",
    "slug": "pulihora-pulusu",
    "shortDescription": "",
    "description": "",
    "price": 300,
    "regularPrice": 300,
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 1,
        "name": "Veg Pickles",
        "slug": "veg-pickles"
      }
    ]
  },
  {
    "id": 29,
    "name": "Kova Garijalu",
    "slug": "kova-garijalu",
    "shortDescription": "",
    "description": "",
    "price": 500,
    "regularPrice": 500,
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 30,
    "name": "Mothichur Laddu",
    "slug": "mothichur-laddu",
    "shortDescription": "",
    "description": "",
    "price": 350,
    "regularPrice": 350,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/63.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 31,
    "name": "Ragi Garelu",
    "slug": "ragi-garelu",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/13.png",
    "isInStock": true,
    "categories": []
  },
  {
    "id": 32,
    "name": "Ragi Murukkulu",
    "slug": "ragi-murukkulu",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/73.png",
    "isInStock": true,
    "categories": []
  },
  {
    "id": 33,
    "name": "Avisa Laddu",
    "slug": "avisa-laddu",
    "shortDescription": "",
    "description": "",
    "price": 500,
    "regularPrice": 500,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/32.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 34,
    "name": "Godhuma  Gavvalu",
    "slug": "godhuma-gavvalu",
    "shortDescription": "",
    "description": "",
    "price": 350,
    "regularPrice": 350,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/67.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 35,
    "name": "Neyi Maysoor Pak",
    "slug": "neyi-maysoor-pak",
    "shortDescription": "",
    "description": "",
    "price": 500,
    "regularPrice": 500,
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 36,
    "name": "Ragi Laddu",
    "slug": "ragi-laddu",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/32.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 37,
    "name": "Dry Fruit Laddu",
    "slug": "dry-fruit-laddu",
    "shortDescription": "",
    "description": "",
    "price": 2000,
    "regularPrice": 2000,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/31.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 38,
    "name": "Ravva Laddu",
    "slug": "ravvva-laddu",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/24.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 39,
    "name": "Bellam Pusa",
    "slug": "bellam-pusa",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/27.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 40,
    "name": "Neti Ariselu",
    "slug": "neti-ariselu",
    "shortDescription": "",
    "description": "",
    "price": 500,
    "regularPrice": 500,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/43.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 41,
    "name": "Pineapple Halwa",
    "slug": "pineapple-halwa",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 42,
    "name": "Nuvvula Ariselu",
    "slug": "nuvvula-ariselu",
    "shortDescription": "",
    "description": "",
    "price": 350,
    "regularPrice": 350,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/40.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 43,
    "name": "Bakshalu",
    "slug": "bakshalu",
    "shortDescription": "",
    "description": "",
    "price": 321,
    "regularPrice": 321,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/39.png",
    "isInStock": true,
    "categories": []
  },
  {
    "id": 44,
    "name": "Milk Mysore pak",
    "slug": "milk-mysore-pak",
    "shortDescription": "",
    "description": "",
    "price": 500,
    "regularPrice": 500,
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 45,
    "name": "Mysore pak",
    "slug": "mysore-pak",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 46,
    "name": "Sunnundalu",
    "slug": "sunnundalu",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/24.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 47,
    "name": "Gavvalu",
    "slug": "gavvalu",
    "shortDescription": "",
    "description": "",
    "price": 300,
    "regularPrice": 300,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/67.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 48,
    "name": "Nuvvula Laddu",
    "slug": "nuvvula-laddu",
    "shortDescription": "",
    "description": "",
    "price": 400,
    "regularPrice": 400,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/32.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 49,
    "name": "Palli Laddu",
    "slug": "palli-laddu",
    "shortDescription": "",
    "description": "",
    "price": 350,
    "regularPrice": 350,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/31.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 50,
    "name": "Badusha",
    "slug": "badusha",
    "shortDescription": "",
    "description": "",
    "price": 350,
    "regularPrice": 350,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/4.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 51,
    "name": "Madata Penilu",
    "slug": "madata-penilu",
    "shortDescription": "",
    "description": "",
    "price": 350,
    "regularPrice": 350,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/67.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 52,
    "name": "Laddu",
    "slug": "laddu",
    "shortDescription": "",
    "description": "",
    "price": 300,
    "regularPrice": 300,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/63.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 53,
    "name": "Ariselu",
    "slug": "ariselu",
    "shortDescription": "",
    "description": "",
    "price": 300,
    "regularPrice": 300,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/43.png",
    "isInStock": true,
    "categories": [
      {
        "id": 2,
        "name": "Sweets",
        "slug": "sweets"
      }
    ]
  },
  {
    "id": 54,
    "name": "Sarva Pindi",
    "slug": "sarva-pindi",
    "shortDescription": "",
    "description": "",
    "price": 40,
    "regularPrice": 40,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/58.png",
    "isInStock": true,
    "categories": []
  },
  {
    "id": 55,
    "name": "Sana Pusa",
    "slug": "sana-pusa",
    "shortDescription": "",
    "description": "",
    "price": 300,
    "regularPrice": 300,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/27.png",
    "isInStock": true,
    "categories": []
  },
  {
    "id": 56,
    "name": "Madugulu",
    "slug": "madugulu",
    "shortDescription": "",
    "description": "",
    "price": 300,
    "regularPrice": 300,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/65.png",
    "isInStock": true,
    "categories": []
  },
  {
    "id": 57,
    "name": "Karam Boondi",
    "slug": "karam-boondi",
    "shortDescription": "",
    "description": "",
    "price": 300,
    "regularPrice": 300,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/27.png",
    "isInStock": true,
    "categories": [
      {
        "id": 5,
        "name": "Hot Snacks",
        "slug": "hot-snacks"
      }
    ]
  },
  {
    "id": 58,
    "name": "Chuduva",
    "slug": "chuduva",
    "shortDescription": "",
    "description": "",
    "price": 300,
    "regularPrice": 300,
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800",
    "isInStock": true,
    "categories": [
      {
        "id": 5,
        "name": "Hot Snacks",
        "slug": "hot-snacks"
      }
    ]
  },
  {
    "id": 59,
    "name": "Murukkulu",
    "slug": "murukkulu",
    "shortDescription": "",
    "description": "",
    "price": 300,
    "regularPrice": 300,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/73.png",
    "isInStock": true,
    "categories": []
  },
  {
    "id": 60,
    "name": "Karam Sakinalu",
    "slug": "karam-sakinalu",
    "shortDescription": "",
    "description": "",
    "price": 350,
    "regularPrice": 350,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/72.png",
    "isInStock": true,
    "categories": []
  },
  {
    "id": 61,
    "name": "Sakinalu",
    "slug": "sakinalu-2",
    "shortDescription": "",
    "description": "",
    "price": 320,
    "regularPrice": 320,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/72.png",
    "isInStock": true,
    "categories": []
  },
  {
    "id": 62,
    "name": "Pappu Garalu",
    "slug": "pappu-garalu",
    "shortDescription": "",
    "description": "",
    "price": 300,
    "regularPrice": 300,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/13.png",
    "isInStock": true,
    "categories": []
  },
  {
    "id": 63,
    "name": "Palli Garalu",
    "slug": "palli-garalu",
    "shortDescription": "",
    "description": "",
    "price": 300,
    "regularPrice": 300,
    "imageUrl": "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/58.png",
    "isInStock": true,
    "categories": []
  }
];
