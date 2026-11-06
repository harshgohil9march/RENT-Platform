import { Link } from 'react-router-dom';
import Logout from '../../pages/Logout';
import Dashboard from '../../pages/Dashboard';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              RENT-Platform
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-4">
            <Link to="/" className="text-secondary hover:text-primary px-3 py-2 rounded-md font-medium">
              Home
            </Link>

            <Link to="/search" className="text-secondary hover:text-primary px-3 py-2 rounded-md font-medium">
              Find PG
            </Link>

            <Link to="/dashboard" className="text-secondary hover:text-primary px-3 py-2 rounded-md font-medium">
              Dashboard
            </Link>
              
            <Logout />
            
          </nav>

        </div>

      </div>
    </header>
  );
}