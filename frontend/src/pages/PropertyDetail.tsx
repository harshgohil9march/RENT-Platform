import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageGallery from '../components/properties/ImageGallery';
import Button from '../components/ui/Button';
import { API_BASE_URL } from '../services/api';
interface Property {
  title: string;
  description?: string;
  rent: number;
  deposit: number;
  locality: string;
  images: string[];
}

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchproperty = async()=>{
       fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/properties/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Property not found');
        return response.json();
      })
      .then(setProperty)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
    };
    fetchproperty();
  }, [id]);

// Handling edge cases (Loading state and 404 Not Found state)
  if (loading) return <div className="p-10 text-center text-xl">Loading property details...</div>;
  if (error || !property) return <div className="p-10 text-center text-xl text-red-500">Property not found</div>;


  return (
    <div className="p-10">
      {/* Render your property details here using property.title, property.rent, etc. */}
      <h1 className="text-3xl font-bold">{property.title}</h1>
      <p className="text-xl text-primary font-semibold mt-4">₹{property.rent}/mo</p>
      <p className="mt-4 text-gray-700">{property.description}</p>
      <p className="mt-2 text-gray-500">Location: {property.locality}</p>

      {/* If you wired up the images array in Day 10 */}
      {property.images && property.images.length > 0 && (
        <img src={property.images[0]} alt={property.title} className="mt-4 w-full max-w-2xl rounded-lg shadow-md" />
      )}
    </div>
  );
}
