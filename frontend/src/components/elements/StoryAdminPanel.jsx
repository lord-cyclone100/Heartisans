import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const StoryAdminPanel = () => {
  const [pendingStories, setPendingStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingStories();
  }, []);

  const fetchPendingStories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stories/admin/pending');
      if (response.data.success) {
        setPendingStories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pending stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveStory = async (storyId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/stories/admin/${storyId}/approve`);
      if (response.data.success) {
        setPendingStories(prev => prev.filter(story => story._id !== storyId));
        alert('Story approved successfully!');
      }
    } catch (error) {
      console.error('Error approving story:', error);
      alert('Failed to approve story');
    }
  };

  const rejectStory = async (storyId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/stories/admin/${storyId}/reject`);
      if (response.data.success) {
        setPendingStories(prev => prev.filter(story => story._id !== storyId));
        alert('Story rejected successfully!');
      }
    } catch (error) {
      console.error('Error rejecting story:', error);
      alert('Failed to reject story');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <div className="text-xl font-semibold" style={{ color: '#479626' }}>
            Loading pending stories...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#479626' }}>
          📋 Story Management
        </h2>
        <p className="text-gray-600">
          Review and approve customer stories before they appear on the website.
        </p>
      </div>

      {pendingStories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#479626' }}>
            All Caught Up!
          </h2>
          <p className="text-gray-600">
            No pending stories to review at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingStories.map((story) => (
            <div key={story._id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4" style={{ borderColor: '#ffaf27' }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: '#479626' }}>
                        {story.name}
                      </h3>
                      <p className="text-gray-600">{story.role}</p>
                      {story.location && (
                        <p className="text-sm text-gray-500">📍 {story.location}</p>
                      )}
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < story.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2" style={{ color: '#479626' }}>Story:</h4>
                    <p className="text-gray-700 leading-relaxed">{story.story}</p>
                  </div>

                  {/* Story Image */}
                  {story.storyImage && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2" style={{ color: '#479626' }}>Uploaded Image:</h4>
                      <img 
                        src={story.storyImage} 
                        alt="Story related image"
                        className="w-full max-h-60 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Email:</strong> {story.email}
                    </div>
                    <div>
                      <strong>Category:</strong> {story.productCategory || 'Not specified'}
                    </div>
                    <div>
                      <strong>Submitted:</strong> {new Date(story.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Rating:</strong> {story.rating}/5 stars
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => approveStory(story._id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    ✅ Approve Story
                  </button>
                  <button
                    onClick={() => rejectStory(story._id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    ❌ Reject Story
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
