import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { defaultSeoConfig } from '../config/seoConfig';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  ogType?: 'website' | 'article' | 'product';
  noindex?: boolean;
  keywords?: string[];
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = defaultSeoConfig.defaultDescription,
  canonical,
  image = defaultSeoConfig.defaultOgImage,
  ogType = 'website',
  noindex = false,
  keywords = defaultSeoConfig.defaultKeywords,
  jsonLd,
}) => {
  const location = useLocation();

  const formattedTitle = title
    ? `${title} | ${defaultSeoConfig.siteName}`
    : defaultSeoConfig.defaultTitle;

  const currentUrl = canonical
    ? (canonical.startsWith('http') ? canonical : `${defaultSeoConfig.siteUrl}${canonical}`)
    : `${defaultSeoConfig.siteUrl}${location.pathname}`;

  const imageUrl = image.startsWith('http')
    ? image
    : `${defaultSeoConfig.siteUrl}${image}`;

  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />
      <link rel="canonical" href={currentUrl} />

      {/* OpenGraph / Facebook / WhatsApp */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={defaultSeoConfig.siteName} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={formattedTitle} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {defaultSeoConfig.social.twitter && (
        <meta name="twitter:site" content={defaultSeoConfig.social.twitter} />
      )}

      {/* Structured Data (Schema.org JSON-LD) */}
      {jsonLdArray.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};
