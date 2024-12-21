import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCountryContext } from '../../stores/CountriesProvider/CountriesProvider';
import { useFetch } from '../../hooks/useFetch';

interface CatalogContextType {
  products: any[]; // Replace with your actual product type
  isLoading: boolean;
  error: any;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { country, isCountryPending } = useCountryContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);

  const { data: groupedCatalogResponse, isPending, error } = useFetch<any[]>({
    url: 'products/grouped/',
    queryParams: {
      country: !!country ? country?.iso_alpha2: null,
      brand: searchQuery,
    },
    enabled: !!country && !isCountryPending,
  });

  useEffect(() => {
    if (groupedCatalogResponse?.products) {
      const p = groupedCatalogResponse?.products || [];
      setProducts(p);
    }
  }, [groupedCatalogResponse]);

  const value = {
    products,
    isLoading: isPending,
    error,
    setSearchQuery,
    searchQuery,
  };

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => {
  const context = useContext(CatalogContext);
  if (context === undefined) {
    throw new Error('useCatalogContext must be used within a CatalogProvider');
  }
  return context;
};
