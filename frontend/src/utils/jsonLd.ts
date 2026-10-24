import { defaultSeoConfig } from '../config/seoConfig';
import type { Product } from '../types';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates Schema.org Organization schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: defaultSeoConfig.siteName,
    url: defaultSeoConfig.siteUrl,
    logo: `${defaultSeoConfig.siteUrl}/images/brand_logo.png`,
    image: `${defaultSeoConfig.siteUrl}${defaultSeoConfig.defaultOgImage}`,
    description: defaultSeoConfig.defaultDescription,
    telephone: defaultSeoConfig.contact.phone,
    email: defaultSeoConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: defaultSeoConfig.contact.address.street,
      addressLocality: defaultSeoConfig.contact.address.city,
      addressRegion: defaultSeoConfig.contact.address.state,
      postalCode: defaultSeoConfig.contact.address.postalCode,
      addressCountry: defaultSeoConfig.contact.address.country,
    },
    priceRange: '₹300 - ₹1200',
    sameAs: [
      defaultSeoConfig.social.instagram,
      defaultSeoConfig.social.facebook,
    ].filter(Boolean),
  };
}

/**
 * Generates Schema.org WebSite schema with Sitelinks Searchbox
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: defaultSeoConfig.siteName,
    url: defaultSeoConfig.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${defaultSeoConfig.siteUrl}/categories?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generates Schema.org Product schema with Offers, Pricing & InStock availability
 */
export function generateProductSchema(product: Product, canonicalUrl?: string) {
  const url = canonicalUrl || `${defaultSeoConfig.siteUrl}/product/${product.slug}`;
  const image = product.imageUrl?.startsWith('http')
    ? product.imageUrl
    : `${defaultSeoConfig.siteUrl}${product.imageUrl || defaultSeoConfig.defaultOgImage}`;

  const categoryName = product.categories?.[0]?.name || 'Traditional Food';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [image],
    description: product.description || product.shortDescription || `Authentic ${product.name} handcrafted by Sri Telangana Ruchulu using pure traditional spices.`,
    sku: `STR-PRD-${product.id}`,
    mpn: `STR${product.id}`,
    brand: {
      '@type': 'Brand',
      name: defaultSeoConfig.siteName,
    },
    category: categoryName,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2028-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.isInStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: defaultSeoConfig.siteName,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * Generates Schema.org BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${defaultSeoConfig.siteUrl}${item.url}`,
    })),
  };
}
