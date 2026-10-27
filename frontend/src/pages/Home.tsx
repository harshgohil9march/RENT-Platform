import Categories from '../components/home/Categories';
import FeaturedProperties from '../components/home/FeaturedProperties';
import Button from '../components/ui/Button';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative bg-primary rounded-2xl overflow-hidden shadow-lg mt-4">
        <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
        <div className="relative px-6 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Find your next home in Udaipur
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover the best PGs, Hostels, and Flats tailored for students and working professionals.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-lg shadow-md">
            <input 
              type="text" 
              placeholder="Search by locality (e.g., Hiran Magri, Shobhagpura)..." 
              className="flex-grow px-4 py-3 outline-none rounded-md text-gray-700"
            />
            <Button variant="primary" className="py-3 px-8 text-lg w-full sm:w-auto">
              Search
            </Button>
          </div>
        </div>
      </section>

      <Categories />
      <FeaturedProperties />
    </div>
  );
}