export const categoryEnrichment: Record<string, { telugu: string; image: string }> = {
  "Veg Pickles": {
    telugu: "శాఖాహార పచ్చళ్ళు",
    image: "/images/veg_pickles.jpg"
  },
  "Sweets": {
    telugu: "మిఠాయిలు",
    image: "/images/premium_snacks.jpg"
  },
  "Podulu": {
    telugu: "పొడులు",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop"
  },
  "Non Veg Pickles": {
    telugu: "మాంసాహార పచ్చళ్ళు",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1200&auto=format&fit=crop"
  },
  "Hot Snacks": {
    telugu: "కారం వంటకాలు",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop"
  }
};

export const getCategoryDetails = (name: string) => {
  return categoryEnrichment[name] || { telugu: name, image: "/images/premium_snacks.jpg" };
};
