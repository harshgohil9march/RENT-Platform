import { useState, useEffect } from 'react';
import Button from '../ui/Button';

interface FiltersProps {
  initialLocation: string;
  initialCategory: string;
  initialMin: string;
  initialMax: string;
  onApply: (filters: { location: string; category: string; min: string; max: string }) => void;
  onReset: () => void;
}

export default function Filters({ initialLocation, initialCategory, initialMin, initialMax, onApply, onReset }: FiltersProps) {
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);

  // Sync state if URL changes externally
  useEffect(() => {
    setLocation(initialLocation);
    setCategory(initialCategory);
    setMin(initialMin);
    setMax(initialMax);
  }, [initialLocation, initialCategory, initialMin, initialMax]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Sector 3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            <option value="pg-men">PG for Men</option>
            <option value="pg-women">PG for Women</option>
            <option value="1bhk">1 BHK Flat</option>
            <option value="2bhk">2 BHK Flat</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min (₹)</label>
            <input 
              type="number" 
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max (₹)</label>
            <input 
              type="number" 
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="pt-4 flex flex-col space-y-2">
          <Button variant="primary" onClick={() => onApply({ location, category, min, max })}>
            Apply Filters
          </Button>
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}