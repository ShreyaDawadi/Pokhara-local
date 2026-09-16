import { useState, useEffect } from 'react';
import './App.css';

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

  if (loading) return <p>Loading listings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Pokhara Local</h1>
      <p>Discover local businesses and services in Pokhara</p>

      {listings.map((listing) => (
        <div key={listing.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
          <h2>{listing.title}</h2>
          <p><strong>{listing.category}</strong> — {listing.location}</p>
          <p>{listing.description}</p>
          <p>Price: {listing.price_range}</p>
          <p>Phone: {listing.phone}</p>
        </div>
      ))}
    </div>
  );
}

export default App;