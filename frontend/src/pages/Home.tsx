import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Home() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-primary">RENT-Platform Homepage</h1>
      
      <Card className="p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Welcome to Udaipur's best PG finder</h2>
        <p className="text-secondary mb-6">Find your perfect home away from home.</p>
        
        <div className="flex space-x-4">
          <Button variant="primary">Search PGs</Button>
          <Button variant="outline">List Property</Button>
        </div>
      </Card>
    </div>
  );
}