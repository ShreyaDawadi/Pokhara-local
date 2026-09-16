import { useState, useEffect } from 'react';

function App() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/listings')
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load listings');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading listings...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-10 px-4 text-center">
        <h1 className="text-4xl font-bold">Pokhara Local</h1>
        <p className="mt-2 text-blue-100">Discover local businesses and services in Pokhara</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                {listing.category}
              </span>
              <h2 className="text-xl font-semibold text-gray-800">{listing.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{listing.location}</p>
              <p className="text-gray-600 mb-3">{listing.description}</p>
              <div className="flex justify-between text-sm text-gray-700 border-t pt-3">
                <span>{listing.price_range}</span>
                <span>{listing.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;