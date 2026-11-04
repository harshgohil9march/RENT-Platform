import { useEffect, useState } from 'react';
import PropertyCard from '../properties/PropertyCard';
import { API_BASE_URL } from '../../services/api';

interface Property {
  id: number;
  title: string;
  rent: number;
  locality: string;
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/properties`);
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        
        // Slicing to show only the top 3 properties on the homepage
        setProperties(data.slice(0, 3)); 
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeatured();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading featured properties...</div>;
  if (properties.length === 0) return <div className="p-10 text-center text-gray-500">No properties available yet.</div>;

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Featured Properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            rent={property.rent}
            // Use locality as defined in your database and PropertyCard interface
            locality={property.locality || "Udaipur"} 
            imageUrl="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
          />
        ))}
      </div>
    </section>
  );
}