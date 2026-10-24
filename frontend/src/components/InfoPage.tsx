import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from './SEO';
import { Breadcrumbs } from './Breadcrumbs';

export const InfoPage = ({ 
  title, 
  description,
  children 
}: { 
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20"
    >
      <SEO
        title={title}
        description={description || `${title} for Sri Telangana Ruchulu online store. Learn more about our policies, operations, and customer support.`}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <Breadcrumbs items={[{ name: title, url: '#' }]} className="mb-4" />

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h1 className="text-3xl md:text-5xl font-extrabold text-brand-dark mb-8 pb-4 border-b-2 border-brand-primary/20">
            {title}
          </h1>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
