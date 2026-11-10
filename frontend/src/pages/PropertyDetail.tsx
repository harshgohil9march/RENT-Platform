import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  
  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: "Hi, I'm interested in this property." });
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    const fetchproperty = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/properties/${id}`);
        if (!response.ok) throw new Error('Property not found');
        const data = await response.json();
        setProperty(data);
      } catch (requestError: any) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };
    fetchproperty();
  }, [id]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('sending');
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => setShowModal(false), 3000); // Close after 3 seconds
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading property details...</div>;
  if (error || !property) return <div className="p-10 text-center text-xl text-red-500">Property not found</div>;

  return (
    <div className="p-10 max-w-5xl mx-auto relative">
      <h1 className="text-3xl font-bold">{property.title}</h1>
      <p className="text-xl text-primary font-semibold mt-4">₹{property.rent}/mo</p>
      <p className="mt-4 text-gray-700">{property.description}</p>
      <p className="mt-2 text-gray-500">Location: {property.locality}</p>

      {property.images && property.images.length > 0 && (
        <img src={property.images[0]} alt={property.title} className="mt-4 w-full max-w-2xl rounded-lg shadow-md" />
      )}
      
      <Button variant="primary" className="mt-6 py-2 px-6" onClick={() => setShowModal(true)}>
        Contact Owner
      </Button>

      {/* Enquiry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Contact Owner</h2>
            
            {submitStatus === 'success' ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-md text-center">
                Message sent successfully! The owner will contact you soon.
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:border-primary"/>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Phone</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:border-primary"/>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Message</label>
                  <textarea rows={3} required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:border-primary"></textarea>
                </div>
                {submitStatus === 'error' && <p className="text-red-500 text-sm">Failed to send. Please try again.</p>}
                <Button type="submit" variant="primary" className="w-full" disabled={submitStatus === 'sending'}>
                  {submitStatus === 'sending' ? 'Sending...' : 'Send Enquiry'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}