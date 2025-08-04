import Story from '../models/storyModel.js';
import { v2 as cloudinary } from 'cloudinary';

// Get all approved stories
const getStories = async (req, res) => {
  try {
    const { featured, limit = 20, page = 1 } = req.query;
    
    const query = { isApproved: true };
    if (featured === 'true') {
      query.featured = true;
    }

    const skip = (page - 1) * limit;
    
    const stories = await Story.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .select('-email'); // Don't expose email addresses

    const total = await Story.countDocuments(query);

    res.status(200).json({
      success: true,
      data: stories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stories',
      error: error.message
    });
  }
};

// Create a new story (user submission)
const createStory = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      story,
      rating,
      location,
      purchaseDate,
      productCategory
    } = req.body;

    // Validation
    if (!name || !email || !role || !story || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, role, story, and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Handle image upload if provided
    let storyImageUrl = null;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'stories',
          transformation: [
            { width: 800, height: 600, crop: "fill", quality: "auto" }
          ]
        });
        storyImageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image'
        });
      }
    }

    const newStory = new Story({
      name,
      email,
      role,
      story,
      rating,
      location,
      purchaseDate,
      productCategory,
      storyImage: storyImageUrl,
      isApproved: false // Stories need approval by default
    });

    const savedStory = await newStory.save();

    res.status(201).json({
      success: true,
      message: 'Story submitted successfully! It will be reviewed and published soon.',
      data: {
        id: savedStory._id,
        name: savedStory.name,
        role: savedStory.role,
        story: savedStory.story,
        rating: savedStory.rating,
        storyImage: savedStory.storyImage
      }
    });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit story',
      error: error.message
    });
  }
};

// Get story by ID
const getStoryById = async (req, res) => {
  try {
    const story = await Story.findOne({ 
      _id: req.params.id, 
      isApproved: true 
    }).select('-email');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    res.status(200).json({
      success: true,
      data: story
    });
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch story',
      error: error.message
    });
  }
};

// Admin function to approve stories
const approveStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured = false } = req.body || {};

    const story = await Story.findByIdAndUpdate(
      id,
      { 
        isApproved: true,
        featured: featured
      },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Story approved successfully',
      data: story
    });
  } catch (error) {
    console.error('Error approving story:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve story',
      error: error.message
    });
  }
};

// Get pending stories (admin only)
const getPendingStories = async (req, res) => {
  try {
    const stories = await Story.find({ isApproved: false })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: stories
    });
  } catch (error) {
    console.error('Error fetching pending stories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending stories',
      error: error.message
    });
  }
};

// Reject a story (delete it)
const rejectStory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const story = await Story.findByIdAndDelete(id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Story rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting story:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject story',
      error: error.message
    });
  }
};

export {
  getStories,
  createStory,
  getStoryById,
  approveStory,
  getPendingStories,
  rejectStory
};
