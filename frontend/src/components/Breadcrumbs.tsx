import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema, type BreadcrumbItem } from '../utils/jsonLd';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const allItems: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    ...items,
  ];

  const schema = generateBreadcrumbSchema(allItems);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-[#5c3a21] py-3 ${className}`}>
        <ol className="flex items-center flex-wrap gap-1 sm:gap-1.5 font-medium">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;

            return (
              <li key={item.url} className="flex items-center gap-1 sm:gap-1.5">
                {index === 0 ? (
                  <Link
                    to={item.url}
                    className="flex items-center gap-1 hover:text-[#8B1E0F] transition-colors font-bold text-[#5c3a21]"
                    title="Home"
                  >
                    <Home size={13} className="text-[#8B1E0F]" />
                    <span className="hidden sm:inline">Home</span>
                  </Link>
                ) : isLast ? (
                  <span className="font-extrabold text-[#2A0800] truncate max-w-[200px] sm:max-w-none" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.url}
                    className="hover:text-[#8B1E0F] transition-colors font-bold text-[#5c3a21] truncate max-w-[150px] sm:max-w-none"
                  >
                    {item.name}
                  </Link>
                )}

                {!isLast && (
                  <ChevronRight size={13} className="text-amber-800/60 flex-shrink-0" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
