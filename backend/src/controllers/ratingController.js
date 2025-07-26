const { PrismaClient } = require('@prisma/client');
const { ratingValidation } = require('../utils/validation');

const prisma = new PrismaClient();

const submitRating = async (req, res) => {
  try {
    const validatedData = ratingValidation.parse(req.body);
    const userId = req.user.id;

   
    const store = await prisma.store.findUnique({
      where: { id: validatedData.storeId }
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

   
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId: validatedData.storeId
        }
      }
    });

    let rating;
    if (existingRating) {
      
      rating = await prisma.rating.update({
        where: {
          userId_storeId: {
            userId,
            storeId: validatedData.storeId
          }
        },
        data: {
          rating: validatedData.rating
        },
        include: {
          store: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    } else {
      
      rating = await prisma.rating.create({
        data: {
          rating: validatedData.rating,
          userId,
          storeId: validatedData.storeId
        },
        include: {
          store: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    }

    res.json({
      message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully',
      rating
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const ratings = await prisma.rating.findMany({
      where: { userId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ ratings });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  submitRating,
  getUserRatings
};