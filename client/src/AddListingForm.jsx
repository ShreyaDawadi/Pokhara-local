import { useState, useEffect } from 'react';

function AddListingForm({ onListingAdded, editingListing, onCancelEdit, token }) {
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

  useEffect(() => {
    if (editingListing) {
      setFormData({
        title: editingListing.title || '',
        category: editingListing.category || '',
        description: editingListing.description || '',
        location: editingListing.location || '',
        price_range: editingListing.price_range || '',
        phone: editingListing.phone || '',
      });
    }
  }, [editingListing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      location: '',
      price_range: '',
      phone: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const isEditing = Boolean(editingListing);
    const url = isEditing
      ? `${import.meta.env.VITE_API_URL}/api/listings/${editingListing.id}`
      : `${import.meta.env.VITE_API_URL}/api/listings`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
  method,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(formData),
});
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save listing');
      }

      const savedListing = await res.json();
      onListingAdded(savedListing);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingListing ? 'Edit Listing' : 'Add a New Listing'}
        </h2>
        {editingListing && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              onCancelEdit();
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>

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
        {submitting ? 'Saving...' : editingListing ? 'Update Listing' : 'Add Listing'}
      </button>
    </form>
  );
}

export default AddListingForm;