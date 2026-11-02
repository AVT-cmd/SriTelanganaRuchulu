import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema, type BreadcrumbItem } from '../utils/jsonLd';
import { useTranslation } from '../utils/translations';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const { t, getCategoryName, getProductName, isTelugu } = useTranslation();

  const allItems: BreadcrumbItem[] = [
    { name: t('nav.home'), url: '/' },
    ...items,
  ];

  const formatBreadcrumbName = (name: string, index: number) => {
    if (index === 0) return t('nav.home');
    if (name.toLowerCase() === 'categories') return t('nav.categories');
    return isTelugu ? (getProductName(name) || getCategoryName(name) || name) : name;
  };

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
            const displayName = formatBreadcrumbName(item.name, index);

            return (
              <li key={item.url} className="flex items-center gap-1 sm:gap-1.5">
                {index === 0 ? (
                  <Link
                    to={item.url}
                    className="flex items-center gap-1 hover:text-[#8B1E0F] transition-colors font-bold text-[#5c3a21]"
                    title={displayName}
                  >
                    <Home size={13} className="text-[#8B1E0F]" />
                    <span className="hidden sm:inline">{displayName}</span>
                  </Link>
                ) : isLast ? (
                  <span className={`font-extrabold text-[#2A0800] truncate max-w-[200px] sm:max-w-none ${isTelugu ? 'font-telugu' : ''}`} aria-current="page">
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={item.url}
                    className={`hover:text-[#8B1E0F] transition-colors font-bold text-[#5c3a21] truncate max-w-[150px] sm:max-w-none ${isTelugu ? 'font-telugu' : ''}`}
                  >
                    {displayName}
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
