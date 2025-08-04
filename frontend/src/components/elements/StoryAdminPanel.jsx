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
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }

      console.log('Fetching pending stories with token:', token.substring(0, 20) + '...');
      
      const response = await axios.get('http://localhost:5000/api/stories/admin/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setPendingStories(response.data.data);
        console.log('Pending stories set:', response.data.data.length);
      } else {
        console.error('API returned success: false');
      }
    } catch (error) {
      console.error('Error fetching pending stories:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const approveStory = async (storyId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }

      const response = await axios.put(`http://localhost:5000/api/stories/admin/${storyId}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/stories/admin/${storyId}/reject`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
                    <div className="flex items-center gap-4">
                      <img
                        src={story.profileImage || story.image || '/photos/default_icon.png'}
                        alt={story.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                        onError={(e) => {
                          e.target.src = '/photos/default_icon.png';
                        }}
                      />
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: '#479626' }}>
                          {story.name}
                        </h3>
                        <p className="text-gray-600">{story.role}</p>
                        {story.location && (
                          <p className="text-sm text-gray-500">📍 {story.location}</p>
                        )}
                      </div>
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

                  {/* Story Image Display */}
                  {story.storyImage && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2" style={{ color: '#479626' }}>Attached Image:</h4>
                      <div className="relative inline-block">
                        <img
                          src={story.storyImage}
                          alt="Story attachment"
                          className="max-w-full h-48 object-cover rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
                          onClick={() => {
                            // Create modal for full image view
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
                            modal.innerHTML = `
                              <div class="relative max-w-4xl max-h-full">
                                <img src="${story.storyImage}" alt="Story attachment" class="max-w-full max-h-full object-contain rounded-lg">
                                <button class="absolute top-4 right-4 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all duration-300" onclick="document.body.removeChild(this.parentElement.parentElement)">×</button>
                              </div>
                            `;
                            document.body.appendChild(modal);
                            modal.addEventListener('click', (e) => {
                              if (e.target === modal) {
                                document.body.removeChild(modal);
                              }
                            });
                          }}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Click to view full size
                        </div>
                      </div>
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
