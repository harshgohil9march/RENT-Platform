import { Link } from 'react-router-dom';

const categories = [
  { id: 'pg-men', title: 'PG for Men', icon: '👨', param: 'pg-men' },
  { id: 'pg-women', title: 'PG for Women', icon: '👩', param: 'pg-women' },
  { id: '1bhk', title: '1 BHK Flats', icon: '🏠', param: '1bhk' },
  { id: '2bhk', title: '2 BHK Flats', icon: '🏢', param: '2bhk' },
];

export default function Categories() {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Browse Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            to={`/search?category=${cat.param}`}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary transition-all duration-200"
          >
            <span className="text-4xl mb-3">{cat.icon}</span>
            <span className="font-medium text-gray-800 text-center">{cat.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}