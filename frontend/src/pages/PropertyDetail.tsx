import { useParams } from 'react-router-dom';
import ImageGallery from '../components/properties/ImageGallery';
import Button from '../components/ui/Button';

// Detailed demo data mapping
const DEMO_PROPERTIES = [
  {
    id: '1',
    title: "Sunrise PG for Boys",
    price: 6000,
    deposit: 6000,
    location: "Sector 3, Hiran Magri, Udaipur",
    amenities: ["WiFi", "AC", "Meals Included", "Laundry", "RO Water"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1e52db06ac?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ff6?w=800"
    ]
  },
  {
    id: '2',
    title: "Lakeview Girls Hostel",
    price: 7500,
    deposit: 15000,
    location: "Fatehsagar, Udaipur",
    amenities: ["WiFi", "Meals Included", "CCTV", "Power Backup"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1e52db06ac?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ]
  }
];

export default function PropertyDetail() {
  const { id } = useParams();
  
  // Find the property, or fallback to the first one for demo purposes
  const property = DEMO_PROPERTIES.find(p => p.id === id) || DEMO_PROPERTIES[0];

  return (
    <div className="max-w-5xl mx-auto bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Images */}
        <ImageGallery images={property.images} />

        {/* Right Column: Property Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{property.title}</h1>
          <p className="text-secondary text-lg mb-6">{property.location}</p>
          
          <div className="flex items-end gap-2 mb-6">
            <span className="text-4xl font-bold text-primary">₹{property.price}</span>
            <span className="text-gray-500 font-medium pb-1">/ month</span>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center mb-8">
            <span className="text-gray-700 font-medium">Security Deposit</span>
            <span className="font-bold text-gray-900 text-lg">₹{property.deposit}</span>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
            <ul className="grid grid-cols-2 gap-3">
              {property.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center text-gray-700 font-medium">
                  <span className="text-primary mr-2 text-lg">✓</span> {amenity}
                </li>
              ))}
            </ul>
          </div>

          {/* Spacer to push button to the bottom if container is tall */}
          <div className="flex-grow"></div>

          <div className="pt-6 border-t border-gray-100 mt-6">
            <Button 
              variant="primary" 
              className="w-full py-4 text-lg"
              onClick={() => alert("The Enquiry Form will be built on Day 16!")}
            >
              Contact Owner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}