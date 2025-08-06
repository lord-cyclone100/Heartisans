import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

export const ShareExperienceForm = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    story: '',
    rating: 5,
    location: '',
    productCategory: ''
  });
  const [storyImage, setStoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Auto-fill user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setMsg('Image size should be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setMsg('Please select a valid image file');
        return;
      }
      
      setStoryImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setMsg(''); // Clear any error messages
    }
  };

  const removeImage = () => {
    setStoryImage(null);
    setImagePreview('');
    // Reset file input
    const fileInput = document.getElementById('storyImage');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Add profile image from user data
      const profileImage = user?.imageUrl || user?.image || '';
      if (profileImage) {
        submitData.append('profileImage', profileImage);
      }
      
      // Add story image if selected
      if (storyImage) {
        submitData.append('storyImage', storyImage);
      }

      const response = await axios.post('https://heartisans-1.onrender.com/api/stories', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setSuccess(true);
        setMsg("Your story has been submitted successfully! It will be reviewed and published soon.");
        // Reset form but keep user data
        setFormData({
          name: user?.fullName || user?.name || '',
          email: user?.email || '',
          role: '',
          story: '',
          rating: 5,
          location: '',
          productCategory: ''
        });
        setStoryImage(null);
        setImagePreview('');
        // Reset file input
        const fileInput = document.getElementById('storyImage');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Error submitting story:', error);
      setMsg('Failed to submit your story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setMsg("");
    setStoryImage(null);
    setImagePreview('');
    // Reset file input
    const fileInput = document.getElementById('storyImage');
    if (fileInput) fileInput.value = '';
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col my-8">
        <div className="overflow-y-auto flex-1">
        {success ? (
          // Success Message
          <div className="p-8 md:p-12 text-center">
            <div className="text-6xl md:text-7xl mb-6">🎉</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#479626' }}>
              Thank You!
            </h2>
            <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
              Your story has been submitted successfully! It will be reviewed and published soon. Thank you for sharing your experience with our community.
            </p>
            <button
              onClick={handleClose}
              className="text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{ backgroundColor: '#ffaf27' }}
            >
              Close
            </button>
          </div>
        ) : (
          // Form Section
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#479626' }}>
                  📝 Share Your Experience
                </h2>
                <p className="text-lg text-gray-600">
                  Tell us about your wonderful experience with our artisan products
                </p>
                {!user && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Tip:</strong> Sign in to auto-fill your name and email address!
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-4xl font-bold transition-all duration-300 hover:scale-110"
              >
                ×
              </button>
            </div>

            {/* Form Container */}
            <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-6 md:p-8 border border-green-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-base sm:text-lg font-medium text-gray-700">
                      Full Name *
                      {user && (
                        <span className="text-sm font-normal text-green-600 ml-2">
                          (Auto-filled from your account)
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={!!user}
                      className={`w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg ${
                        user ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder={user ? "Loading your name..." : "Enter your full name"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-base sm:text-lg font-medium text-gray-700">
                      Email Address *
                      {user && (
                        <span className="text-sm font-normal text-green-600 ml-2">
                          (Auto-filled from your account)
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={!!user}
                      className={`w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg ${
                        user ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder={user ? "Loading your email..." : "Enter your email address"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-base sm:text-lg font-medium text-gray-700">
                      Role/Profession *
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                      placeholder="e.g., Art Collector, Designer, Customer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-base sm:text-lg font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                      placeholder="City, State/Country"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-base sm:text-lg font-medium text-gray-700">
                      Product Category
                    </label>
                    <select
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                    >
                      <option value="">Select a category</option>
                      <option value="Pottery">🏺 Pottery & Ceramics</option>
                      <option value="Textiles">🧵 Textiles & Fabrics</option>
                      <option value="Jewelry">💎 Jewelry & Accessories</option>
                      <option value="Paintings">🎨 Paintings & Art</option>
                      <option value="Sculptures">🗿 Sculptures & Carvings</option>
                      <option value="Home Decor">🏠 Home Décor</option>
                      <option value="Handicrafts">✋ Traditional Handicrafts</option>
                      <option value="Other">🎁 Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-base sm:text-lg font-medium text-gray-700">
                      Overall Rating *
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ Excellent (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ Very Good (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ Good (3 Stars)</option>
                      <option value={2}>⭐⭐ Fair (2 Stars)</option>
                      <option value={1}>⭐ Poor (1 Star)</option>
                    </select>
                  </div>
                </div>

                {/* Story Section */}
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Share Your Experience *
                  </label>
                  <textarea
                    name="story"
                    value={formData.story}
                    onChange={handleChange}
                    required
                    rows={6}
                    maxLength={1000}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none text-lg"
                    placeholder="Tell us about your experience with our artisan products. What did you love most? How did it meet your expectations? (Maximum 1000 characters)"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.story.length}/1000 characters
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Add a Photo (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-400 transition-all duration-300">
                    {!imagePreview ? (
                      <div className="text-center">
                        <div className="text-4xl mb-4">📷</div>
                        <div className="text-lg font-medium text-gray-700 mb-2">
                          Share a photo related to your experience
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          Upload an image of the product you purchased or your experience with it
                        </div>
                        <input
                          type="file"
                          id="storyImage"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="storyImage"
                          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-all duration-300"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Choose Image
                        </label>
                        <div className="text-xs text-gray-400 mt-2">
                          Maximum file size: 10MB. Supported formats: JPG, PNG, GIF
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Story preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all duration-300"
                        >
                          ×
                        </button>
                        <div className="mt-3 text-center">
                          <label
                            htmlFor="storyImage"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-all duration-300"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Change Image
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Section */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-6 py-4 border-2 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-gray-50 transform hover:scale-105"
                    style={{ borderColor: '#479626', color: '#479626' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      loading
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'text-white'
                    }`}
                    style={!loading ? { backgroundColor: '#ffaf27' } : {}}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Submit Story'
                    )}
                  </button>
                </div>

                {/* Success/Error Message */}
                {msg && (
                  <div className={`text-center p-4 rounded-xl ${
                    msg.includes('successfully') 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center justify-center gap-2">
                      {msg.includes('successfully') ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className="font-medium">{msg}</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};