import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';
import Button from '../components/ui/Button';

export default function AddProperty() {
  const navigate = useNavigate();
  
  // Standard fields (keeping rent consistent)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [category, setCategory] = useState('1bhk');
  const [locality, setLocality] = useState('');
  
  // Advanced fields
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const availableAmenities = ['WiFi', 'AC', 'Geyser', 'Meals Included', 'Power Backup', 'Parking'];

  const handleAmenityToggle = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include' // Must send JWT token to pass requireAuth
      });
      
      const data = await response.json();
      if (response.ok) {
        setImages(prev => [...prev, data.imageUrl]);
      } else {
        alert(`Image upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Image upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title, description, rent: Number(rent), deposit: Number(deposit), 
          category, locality, amenities, images
        })
      });

      if (response.ok) {
        navigate('/dashboard'); // Go back to dashboard on success
      }else{
        const errData = await response.json();
        alert(`Failed to add property: ${errData.message}`);
        
      }
    } catch (error) {
      console.error('Submission failed', error);
      alert('Network error: Could not reach the server.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Add New Property</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rent (₹/month)</label>
            <input type="number" required value={rent} onChange={e => setRent(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (₹)</label>
            <input type="number" value={deposit} onChange={e => setDeposit(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
            <input type="text" required value={locality} onChange={e => setLocality(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none">
              <option value="1bhk">1 BHK</option>
              <option value="2bhk">2 BHK</option>
              <option value="pg-men">PG (Men)</option>
              <option value="pg-women">PG (Women)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none"></textarea>
        </div>

        {/* Amenities Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
          <div className="flex flex-wrap gap-4">
            {availableAmenities.map(amenity => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-gray-700 text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploading && <p className="text-sm text-gray-500 mt-2">Uploading to Cloudinary...</p>}
          
          {/* Image Previews */}
          <div className="flex gap-4 mt-4 overflow-x-auto">
            {images.map((url, index) => (
              <img key={index} src={url} alt="Uploaded preview" className="h-24 w-24 object-cover rounded-md border border-gray-200" />
            ))}
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full py-3 mt-4">Create Property</Button>
      </form>
    </div>
  );
}