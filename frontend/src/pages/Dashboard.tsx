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
  
  const [activeTab, setActiveTab] = useState<'properties' | 'enquiries'>('properties');
  const [enquiries, setEnquiries] = useState<any[]>([]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/properties/me/all`, { credentials: 'include' });
        if (response.ok) setProperties(await response.json());
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEnquiries = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/enquiries/me`, { credentials: 'include' });
        if (res.ok) setEnquiries(await res.json());
      } catch (err) { 
        console.error("Error fetching enquiries:", err); 
      }
    };

    if (user) {
      fetchMyProperties();
      fetchEnquiries();
    }
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, { method: 'DELETE', credentials: 'include' });
      if (response.ok) {
        setProperties(properties.filter(p => p.id !== id));
      } else {
        alert("Failed to delete property.");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your property listings and leads.</p>
        </div>
        <Link to="/add-property">
          <Button variant="primary">Add New Property</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('properties')}
          className={`py-2 px-4 font-medium text-lg border-b-2 transition-colors ${activeTab === 'properties' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          My Properties
        </button>
        <button 
          onClick={() => setActiveTab('enquiries')}
          className={`py-2 px-4 font-medium text-lg border-b-2 transition-colors ${activeTab === 'enquiries' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Received Enquiries
          {enquiries.length > 0 && <span className="ml-2 bg-red-100 text-red-600 text-xs py-1 px-2 rounded-full">{enquiries.length}</span>}
        </button>
      </div>

      {/* Conditional Rendering based on Tab */}
      {activeTab === 'properties' ? (
        properties.length > 0 ? (
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
                  <button className="px-3 py-1 bg-white text-blue-600 text-sm font-semibold rounded shadow hover:bg-blue-50">Edit</button>
                  <button onClick={() => handleDelete(property.id)} className="px-3 py-1 bg-white text-red-600 text-sm font-semibold rounded shadow hover:bg-red-50">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-medium text-gray-800">No properties found</h3>
            <p className="text-gray-500 mt-2 mb-6">You haven't listed any properties yet.</p>
          </div>
        )
      ) : (
        /* Enquiries View */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {enquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No enquiries received yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {enquiries.map(enq => (
                <li key={enq.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{enq.name}</h3>
                    <span className="text-sm text-gray-500">{new Date(enq.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 font-medium mb-1">📞 {enq.phone}</p>
                  <p className="text-gray-500 text-sm mb-4">🏠 Property: <span className="font-medium text-primary">{enq.property_title}</span></p>
                  <div className="bg-gray-100 p-3 rounded-md text-gray-700 text-sm italic">"{enq.message}"</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}