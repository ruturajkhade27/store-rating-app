const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { userValidation } = require('../utils/validation');

const prisma = new PrismaClient();

const createUser = async (req, res) => {
  try {
    const validatedData = userValidation.parse(req.body);
    const { role } = req.body;

    
    const validRoles = ['ADMIN', 'USER', 'STORE_OWNER'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

   
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      name,
      email,
      address,
      role
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (name) where.name = { contains: name };
    if (email) where.email = { contains: email };
    if (address) where.address = { contains: address };
    if (role) where.role = role;

    const orderBy = {};
    orderBy[sortBy] = sortOrder.toLowerCase();

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          role: true,
          createdAt: true,
          store: {
            select: {
              id: true,
              name: true,
              ratings: {
                select: {
                  rating: true
                }
              }
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy
      }),
      prisma.user.count({ where })
    ]);

    const usersWithRatings = users.map(user => {
      if (user.role === 'STORE_OWNER' && user.store) {
        const ratings = user.store.ratings;
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
          : 0;
        
        return {
          ...user,
          store: {
            ...user.store,
            averageRating: parseFloat(averageRating.toFixed(2))
          }
        };
      }
      return user;
    });

    res.json({
      users: usersWithRatings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        store: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              select: {
                rating: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'STORE_OWNER' && user.store) {
      const ratings = user.store.ratings;
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;
      
      user.store.averageRating = parseFloat(averageRating.toFixed(2));
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count()
    ]);

    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getDashboardStats
};