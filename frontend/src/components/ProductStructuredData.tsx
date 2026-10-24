import React from 'react';
import { Helmet } from 'react-helmet-async';
import type { Product } from '../types';
import { generateProductSchema } from '../utils/jsonLd';

interface ProductStructuredDataProps {
  product: Product;
  canonicalUrl?: string;
}

export const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({
  product,
  canonicalUrl,
}) => {
  const schema = generateProductSchema(product, canonicalUrl);

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
