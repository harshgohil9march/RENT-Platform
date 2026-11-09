import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/api';
import PropertyCard from '../components/properties/PropertyCard';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Security check: Send guests back to login
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/properties/me/all`, {
          credentials: 'include' // Must send cookies to pass the middleware
        });
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyProperties();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setProperties(properties.filter(p => p.id !== id));
      } else {
        alert("Failed to delete property. Make sure you own it.");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your property listings.</p>
        </div>
        <Link to="/add-property">
          <Button variant="primary">Add New Property</Button>
        </Link>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="relative bg-white border border-gray-200 rounded-lg shadow-sm">
              <PropertyCard 
                id={property.id}
                title={property.title}
                rent={property.rent}
                locality={property.locality || "Udaipur"}
                imageUrl={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="px-3 py-1 bg-white text-blue-600 text-sm font-semibold rounded shadow hover:bg-blue-50">
                  Edit
                </button>
                <button onClick={() => handleDelete(property.id)} className="px-3 py-1 bg-white text-red-600 text-sm font-semibold rounded shadow hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-medium text-gray-800">No properties found</h3>
          <p className="text-gray-500 mt-2 mb-6">You haven't listed any properties yet.</p>
        </div>
      )}
    </div>
  );
}