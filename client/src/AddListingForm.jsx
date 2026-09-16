import { useState } from 'react';

function AddListingForm({ onListingAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    price_range: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create listing');
      }

      const newListing = await res.json();
      onListingAdded(newListing);

      setFormData({
        title: '',
        category: '',
        description: '',
        location: '',
        price_range: '',
        phone: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Add a New Listing</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="text"
        name="title"
        placeholder="Business name"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        name="category"
        placeholder="Category (e.g. Electrician, Tutor)"
        value={formData.category}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        name="location"
        placeholder="Location (e.g. Lakeside, Pokhara)"
        value={formData.location}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        name="price_range"
        placeholder="Price range (e.g. Rs 500-2000)"
        value={formData.price_range}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone number"
        value={formData.phone}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Adding...' : 'Add Listing'}
      </button>
    </form>
  );
}

export default AddListingForm;