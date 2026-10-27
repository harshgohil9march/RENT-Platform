import Card from '../ui/Card';

interface PropertyCardProps {
  title: string;
  price: number;
  location: string;
  imageUrl: string;
}

export default function PropertyCard({ title, price, location, imageUrl }: PropertyCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <div className="h-48 overflow-hidden bg-gray-200">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
        <p className="text-secondary text-sm mb-2">{location}</p>
        <p className="text-primary font-bold text-xl">₹{price}<span className="text-sm font-normal text-secondary">/mo</span></p>
      </div>
    </Card>
  );
}