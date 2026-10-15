export interface WeightOption {
  label: string;
  value: string;
  weightKg: number;
}

export const WEIGHT_OPTIONS: WeightOption[] = [
  { label: '500g (0.5 KG)', value: '500g', weightKg: 0.5 },
  { label: '1 KG', value: '1kg', weightKg: 1.0 },
  { label: '1.5 KG', value: '1.5kg', weightKg: 1.5 },
  { label: '2 KG', value: '2kg', weightKg: 2.0 },
  { label: '2.5 KG', value: '2.5kg', weightKg: 2.5 },
  { label: '3 KG (Max)', value: '3kg', weightKg: 3.0 },
];

export const MIN_ORDER_WEIGHT_PER_ITEM_KG = 0.5;
export const MAX_ORDER_WEIGHT_PER_ITEM_KG = 3.0;

export const calculateItemPrice = (basePricePerKg: number, weightKg: number): number => {
  return Math.round(basePricePerKg * weightKg);
};

export interface ShippingCalculation {
  zone: 'TRI_CITY' | 'REGIONAL';
  zoneLabel: string;
  shippingFee: number;
  isFreeDelivery: boolean;
  message: string;
}

/**
 * Checks if a PIN code belongs to the local Tri-City cluster (Warangal / Hanamkonda / Kazipet).
 * In Indian Postal System, PIN codes starting with 506 belong to Warangal/Hanamkonda/Kazipet.
 */
export const isTriCityPincode = (pincode?: string): boolean => {
  if (!pincode) return false;
  const clean = pincode.toString().trim().replace(/\s+/g, '');
  return clean.startsWith('506');
};

/**
 * Checks if a city name is in the Warangal / Hanamkonda / Kazipet cluster.
 */
export const isTriCity = (city?: string): boolean => {
  if (!city) return false;
  const c = city.trim().toLowerCase();
  return (
    c.includes('warangal') ||
    c.includes('hanamkonda') ||
    c.includes('hanumakonda') ||
    c.includes('kazipet') ||
    c.includes('kazipaet')
  );
};

/**
 * Business Rule (PIN Code Based Delivery Fee):
 * 1. PIN code starting with '506' (Warangal / Hanamkonda / Kazipet area):
 *    - Order weight > 1.0 KG: FREE Delivery (₹0)
 *    - Order weight <= 1.0 KG: ₹80 Delivery Charge
 * 2. All other PIN codes (e.g. 500xxx Hyderabad, rest of Telangana, AP, and India):
 *    - ₹350 Flat Delivery Charge
 */
export const calculateShipping = (
  pincode: string = '',
  totalWeightKg: number = 0.5,
  cityFallback: string = ''
): ShippingCalculation => {
  const cleanPin = (pincode || '').toString().trim().replace(/\s+/g, '');
  
  // Primary check: PIN code (506xxx). Fallback if no pin yet: city name check
  const inTriCity = cleanPin.length >= 3 
    ? cleanPin.startsWith('506') 
    : isTriCity(cityFallback);

  if (inTriCity) {
    if (totalWeightKg > 1.0) {
      return {
        zone: 'TRI_CITY',
        zoneLabel: cleanPin ? `Local Tri-City (PIN ${cleanPin})` : 'Local Tri-City (Warangal / Hanamkonda / Kazipet)',
        shippingFee: 0,
        isFreeDelivery: true,
        message: 'FREE Delivery! (Order weight is above 1 KG in 506xxx PIN zone)',
      };
    } else {
      const neededForFree = Math.max(0, Number((1.01 - totalWeightKg).toFixed(1)));
      return {
        zone: 'TRI_CITY',
        zoneLabel: cleanPin ? `Local Tri-City (PIN ${cleanPin})` : 'Local Tri-City (Warangal / Hanamkonda / Kazipet)',
        shippingFee: 80,
        isFreeDelivery: false,
        message: `Add ${neededForFree > 0.5 ? '500g' : `${neededForFree} KG`} more for FREE Delivery in 506xxx PIN zone!`,
      };
    }
  }

  // Zone 2: Other PIN codes (Hyderabad, Telangana, AP, Rest of India)
  return {
    zone: 'REGIONAL',
    zoneLabel: cleanPin ? `Standard Express Delivery (PIN ${cleanPin})` : 'Standard Express Delivery',
    shippingFee: 350,
    isFreeDelivery: false,
    message: cleanPin ? `Delivery fee for PIN ${cleanPin}: ₹350` : 'Delivery fee calculated by PIN code (₹350)',
  };
};
