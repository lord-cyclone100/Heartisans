import Resale from '../models/resaleModel.js';
import { User } from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary';

// Create a new resale listing
const createResaleListing = async (req, res) => {
  try {
    const {
      productName,
      category,
      description,
      originalPrice,
      condition,
      sapAnalytics,
      location
    } = req.body;

    // Get user information
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Calculate current price based on condition
    const conditionMultipliers = {
      'with-tag': 0.85,
      'without-tag': 0.65,
      'lesser-quality': 0.45
    };

    const conditionDetails = {
      'with-tag': {
        title: 'With Tag - Just Like New',
        description: 'Original tags intact, pristine condition, no wear signs',
        priceMultiplier: 0.85
      },
      'without-tag': {
        title: 'Without Tag - Good to Fair',
        description: 'Excellent condition, minimal wear, well maintained',
        priceMultiplier: 0.65
      },
      'lesser-quality': {
        title: 'Lesser Quality',
        description: 'Visible wear, some flaws, but still functional and beautiful',
        priceMultiplier: 0.45
      }
    };

    const currentPrice = Math.round(originalPrice * conditionMultipliers[condition]);

    // Handle image uploads if any
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        try {
          const result = await cloudinary.uploader.upload(req.files[i].path, {
            folder: 'resale-listings',
            transformation: [
              { width: 800, height: 800, crop: "fill", quality: "auto" }
            ]
          });

          uploadedImages.push({
            url: result.secure_url,
            publicId: result.public_id,
            isPrimary: i === 0 // First image as primary
          });
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
        }
      }
    }

    // Create the resale listing
    const resaleListing = new Resale({
      productName,
      category,
      description,
      originalPrice: parseFloat(originalPrice),
      currentPrice,
      condition,
      conditionDetails: conditionDetails[condition],
      images: uploadedImages,
      seller: user._id,
      sellerName: user.name,
      sellerContact: user.email,
      sapAnalytics: sapAnalytics ? {
        ...sapAnalytics,
        timestamp: new Date()
      } : undefined,
      location: location || {
        state: user.state || 'India',
        city: user.city || '',
        pincode: user.pincode || ''
      },
      tags: [category.toLowerCase(), condition, 'resale', 'handcrafted']
    });

    const savedListing = await resaleListing.save();

    res.status(201).json({
      success: true,
      message: 'Resale listing created successfully',
      data: savedListing
    });

  } catch (error) {
    console.error('Create resale listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create resale listing',
      details: error.message
    });
  }
};

// Get all active resale listings
const getAllResaleListings = async (req, res) => {
  try {
    const { 
      category, 
      condition, 
      minPrice, 
      maxPrice, 
      sortBy = 'listedAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 12 
    } = req.query;

    // Build filter object
    const filter = { status: 'active', isVisible: true };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (condition && condition !== 'all') {
      filter.condition = condition;
    }
    
    if (minPrice || maxPrice) {
      filter.currentPrice = {};
      if (minPrice) filter.currentPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.currentPrice.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [listings, totalCount] = await Promise.all([
      Resale.find(filter)
        .populate('seller', 'name email profilePicture')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Resale.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: listings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get resale listings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resale listings',
      details: error.message
    });
  }
};

// Get resale listings by user (for user dashboard)
const getUserResaleListings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status = 'all' } = req.query;

    const filter = { seller: userId };
    if (status !== 'all') {
      filter.status = status;
    }

    const listings = await Resale.find(filter)
      .sort({ listedAt: -1 })
      .populate('interestedBuyers.user', 'name email');

    res.json({
      success: true,
      data: listings
    });

  } catch (error) {
    console.error('Get user resale listings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user resale listings',
      details: error.message
    });
  }
};

// Get single resale listing by ID
const getResaleListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Resale.findById(id)
      .populate('seller', 'name email profilePicture phone')
      .populate('interestedBuyers.user', 'name email');

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Resale listing not found'
      });
    }

    // Increment views if this is not the seller viewing
    if (!req.user || listing.seller._id.toString() !== req.user.id) {
      await listing.incrementViews();
    }

    res.json({
      success: true,
      data: listing
    });

  } catch (error) {
    console.error('Get resale listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resale listing',
      details: error.message
    });
  }
};

// Update resale listing
const updateResaleListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const listing = await Resale.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Resale listing not found'
      });
    }

    // Check if user is the seller
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this listing'
      });
    }

    // Update the listing
    const updatedListing = await Resale.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('seller', 'name email');

    res.json({
      success: true,
      message: 'Listing updated successfully',
      data: updatedListing
    });

  } catch (error) {
    console.error('Update resale listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update resale listing',
      details: error.message
    });
  }
};

// Delete resale listing
const deleteResaleListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Resale.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Resale listing not found'
      });
    }

    // Check if user is the seller
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this listing'
      });
    }

    // Delete images from cloudinary
    if (listing.images && listing.images.length > 0) {
      for (const image of listing.images) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch (deleteError) {
          console.error('Image deletion error:', deleteError);
        }
      }
    }

    await Resale.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });

  } catch (error) {
    console.error('Delete resale listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete resale listing',
      details: error.message
    });
  }
};

// Mark listing as sold
const markAsSold = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Resale.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Resale listing not found'
      });
    }

    // Check if user is the seller
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this listing'
      });
    }

    await listing.markAsSold();

    res.json({
      success: true,
      message: 'Listing marked as sold successfully',
      data: listing
    });

  } catch (error) {
    console.error('Mark as sold error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark listing as sold',
      details: error.message
    });
  }
};

// Express interest in a listing
const expressInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const listing = await Resale.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Resale listing not found'
      });
    }

    // Check if user is not the seller
    if (listing.seller.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot express interest in your own listing'
      });
    }

    // Check if user already expressed interest
    const alreadyInterested = listing.interestedBuyers.some(
      buyer => buyer.user.toString() === req.user.id
    );

    if (alreadyInterested) {
      return res.status(400).json({
        success: false,
        error: 'You have already expressed interest in this listing'
      });
    }

    // Add to interested buyers
    listing.interestedBuyers.push({
      user: req.user.id,
      message: message || 'Interested in this item',
      contactedAt: new Date()
    });

    await listing.save();

    res.json({
      success: true,
      message: 'Interest expressed successfully'
    });

  } catch (error) {
    console.error('Express interest error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to express interest',
      details: error.message
    });
  }
};

// Get resale analytics/stats
const getResaleStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      totalListings,
      activeListings,
      soldListings,
      totalViews,
      totalInterest
    ] = await Promise.all([
      Resale.countDocuments({ seller: userId }),
      Resale.countDocuments({ seller: userId, status: 'active' }),
      Resale.countDocuments({ seller: userId, status: 'sold' }),
      Resale.aggregate([
        { $match: { seller: userId } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]),
      Resale.aggregate([
        { $match: { seller: userId } },
        { $unwind: '$interestedBuyers' },
        { $count: 'totalInterest' }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalListings,
        activeListings,
        soldListings,
        totalViews: totalViews[0]?.totalViews || 0,
        totalInterest: totalInterest[0]?.totalInterest || 0
      }
    });

  } catch (error) {
    console.error('Get resale stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resale statistics',
      details: error.message
    });
  }
};

export {
  createResaleListing,
  getAllResaleListings,
  getUserResaleListings,
  getResaleListingById,
  updateResaleListing,
  deleteResaleListing,
  markAsSold,
  expressInterest,
  getResaleStats
};
