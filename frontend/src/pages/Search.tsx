import { useSearchParams } from 'react-router-dom';
import Filters from '../components/search/Filters';
import PropertyCard from '../components/properties/PropertyCard';

// 10+ Demo Properties
const DEMO_PROPERTIES = [
  { id: 1, title: "Sunrise PG for Boys", price: 6000, category: "pg-men", location: "Sector 3, Hiran Magri, Udaipur", imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800" },
  { id: 2, title: "Lakeview Girls Hostel", price: 7500, category: "pg-women", location: "Fatehsagar, Udaipur", imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1e52db06ac?w=800" },
  { id: 3, title: "Modern 1 BHK Flat", price: 12000, category: "1bhk", location: "Shobhagpura, Udaipur", imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ff6?w=800" },
  { id: 4, title: "Elite 2 BHK Apartment", price: 18000, category: "2bhk", location: "Sector 4, Hiran Magri, Udaipur", imageUrl: "https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800" },
  { id: 5, title: "Budget Mens PG", price: 4500, category: "pg-men", location: "Ayad, Udaipur", imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800" },
  { id: 6, title: "Premium Girls PG", price: 8000, category: "pg-women", location: "Bapu Bazar, Udaipur", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800" },
  { id: 7, title: "Cozy 1 BHK Studio", price: 9500, category: "1bhk", location: "University Road, Udaipur", imageUrl: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800" },
  { id: 8, title: "Spacious Family Flat", price: 22000, category: "2bhk", location: "Sukhadia Circle, Udaipur", imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800" },
  { id: 9, title: "City Center PG", price: 5500, category: "pg-men", location: "Surajpole, Udaipur", imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800" },
  { id: 10, title: "Quiet 1 BHK", price: 11000, category: "1bhk", location: "Sector 11, Hiran Magri, Udaipur", imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800" }
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract current URL parameters
  const qLocation = searchParams.get('location') || '';
  const qCategory = searchParams.get('category') || '';
  const qMin = searchParams.get('min') || '';
  const qMax = searchParams.get('max') || '';

  // Filter Logic
  const filteredProperties = DEMO_PROPERTIES.filter(property => {
    const matchLocation = property.location.toLowerCase().includes(qLocation.toLowerCase());
    const matchCategory = qCategory ? property.category === qCategory : true;
    const matchMin = qMin ? property.price >= parseInt(qMin) : true;
    const matchMax = qMax ? property.price <= parseInt(qMax) : true;
    
    return matchLocation && matchCategory && matchMin && matchMax;
  });

  const handleApplyFilters = (filters: { location: string; category: string; min: string; max: string }) => {
    // Only add parameters to URL if they have a value
    const newParams = new URLSearchParams();
    if (filters.location) newParams.set('location', filters.location);
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
          initialLocation={qLocation}
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
                price={property.price}
                location={property.location}
                imageUrl={property.imageUrl}
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