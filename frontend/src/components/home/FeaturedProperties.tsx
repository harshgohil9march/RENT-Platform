import PropertyCard from '../properties/PropertyCard';

const demoProperties = [
  {
    id: 1,
    title: "Sunrise PG for Boys",
    price: 6000,
    location: "Sector 3, Hiran Magri, Udaipur",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Lakeview Girls Hostel",
    price: 7500,
    location: "Fatehsagar, Udaipur",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1e52db06ac?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Modern 1 BHK Flat",
    price: 12000,
    location: "Shobhagpura, Udaipur",
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ff6?auto=format&fit=crop&q=80&w=800",
  }
];

export default function FeaturedProperties() {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Featured Properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoProperties.map((property) => (
          <PropertyCard 
            key={property.id}
            title={property.title}
            price={property.price}
            location={property.location}
            imageUrl={property.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}