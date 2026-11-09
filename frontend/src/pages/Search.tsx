import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Filters from '../components/search/Filters';
import PropertyCard from '../components/properties/PropertyCard';


export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract current URL parameters
  const qlocality = searchParams.get('locality') || '';
  const qCategory = searchParams.get('category') || '';
  const qMin = searchParams.get('min') || '';
  const qMax = searchParams.get('max') || '';

  // Filter Logic
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/properties${window.location.search}`);
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [searchParams]);

  const filteredProperties = properties.filter(property => {
    // Note: The DB sends locality as 'locality', but we use what you have. 
    // Ensure you check property.locality if your DB doesn't have a 'locality' column.
    const matchlocality = property.locality ? property.locality.toLowerCase().includes(qlocality.toLowerCase()) : true;
    const matchCategory = qCategory ? property.category === qCategory : true;
    const matchMin = qMin ? property.rent >= parseInt(qMin) : true;
    const matchMax = qMax ? property.rent <= parseInt(qMax) : true;
    
    return matchlocality && matchCategory && matchMin && matchMax;
  });

  const handleApplyFilters = (filters: { locality: string; category: string; min: string; max: string }) => {
    // Only add parameters to URL if they have a value
    const newParams = new URLSearchParams();
    if (filters.locality) newParams.set('locality', filters.locality);
    if (filters.category) newParams.set('category', filters.category);
    if (filters.min) newParams.set('min', filters.min);
    if (filters.max) newParams.set('max', filters.max);
    
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setSearchParams({}); // Clears URL
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-1/3 lg:w-1/4">
        <Filters 
          initiallocality={qlocality}
          initialCategory={qCategory}
          initialMin={qMin}
          initialMax={qMax}
          onApply={handleApplyFilters}
          onReset={handleReset}
        />
      </aside>

      {/* Results Grid */}
      <section className="w-full md:w-2/3 lg:w-3/4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Properties in Udaipur</h1>
          <p className="text-secondary">{filteredProperties.length} results found</p>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard 
                key={property.id}
                id={property.id}
                title={property.title}
                rent={property.rent}
                locality={property.locality || "Udaipur"}
                imageUrl={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-lg border border-gray-100 shadow-sm mt-4">
            <span className="text-4xl block mb-4">🏚️</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No properties found</h3>
            <p className="text-secondary">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}