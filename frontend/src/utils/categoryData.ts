export const categoryEnrichment: Record<string, { telugu: string; image: string; description: string }> = {
  "Veg Pickles": {
    telugu: "శాఖాహార పచ్చళ్ళు",
    image: "/images/veg_pickles.jpg",
    description: "Cold-pressed oil Avakaya, Gongura, Allam & pure traditional pickles."
  },
  "Sweets": {
    telugu: "సాంప్రదాయ మిఠాయిలు",
    image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/4.png",
    description: "Pure ghee Badhusha, Bellam Palli Laddu & festive delicacies."
  },
  "Traditional Sweets": {
    telugu: "సాంప్రదాయ మిఠాయిలు",
    image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/4.png",
    description: "Pure ghee Badhusha, Bellam Palli Laddu & festive delicacies."
  },
  "Podulu": {
    telugu: "ఘుమఘుమలాడే పొడులు",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop",
    description: "Stone-ground Kandi Podi, Karivepaku & Munagaku Podi."
  },
  "Spice Podulu": {
    telugu: "ఘుమఘుమలాడే పొడులు",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop",
    description: "Stone-ground Kandi Podi, Karivepaku & Munagaku Podi."
  },
  "Non Veg Pickles": {
    telugu: "మాంసాహార పచ్చళ్ళు",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=1200",
    description: "Spicy Telangana boneless Chicken, Mutton & Prawns pickles."
  },
  "Hot Snacks": {
    telugu: "క్రిస్పీ పిండి వంటలు",
    image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/72.png",
    description: "Crispy Telangana Karam Sakinalu, Chekkalu & Pindi Vantalu."
  },
  "Hot Snacks & Sakinalu": {
    telugu: "క్రిస్పీ పిండి వంటలు",
    image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/72.png",
    description: "Crispy Telangana Karam Sakinalu, Chekkalu & Pindi Vantalu."
  }
};

export const getCategoryDetails = (name: string) => {
  return categoryEnrichment[name] || { 
    telugu: name, 
    image: "/images/premium_snacks.jpg",
    description: "Authentic traditional Telangana delights made fresh in Warangal."
  };
};
