const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { userValidation, loginValidation, passwordUpdateValidation } = require('../utils/validation');

const prisma = new PrismaClient();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const register = async (req, res) => {
  try {
    const validatedData = userValidation.parse(req.body);
    
    
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
        role: 'USER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true
      }
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const validatedData = loginValidation.parse(req.body);

    
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    
    const { password, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const validatedData = passwordUpdateValidation.parse(req.body);
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

   
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword, 
      user.password
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        store: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true
          }
        }
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  updatePassword,
  getProfile
};