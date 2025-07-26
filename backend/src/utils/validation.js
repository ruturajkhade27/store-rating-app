const { z } = require('zod');

const userValidation = z.object({
  name: z.string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must not exceed 60 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, 
           'Password must contain at least one uppercase letter and one special character'),
  address: z.string()
    .max(400, 'Address must not exceed 400 characters')
});

const storeValidation = z.object({
  name: z.string()
    .min(20, 'Store name must be at least 20 characters')
    .max(60, 'Store name must not exceed 60 characters'),
  email: z.string().email('Invalid email format'),
  address: z.string()
    .max(400, 'Address must not exceed 400 characters')
});

const ratingValidation = z.object({
  rating: z.number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5'),
  storeId: z.number().int().positive()
});

const loginValidation = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const passwordUpdateValidation = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, 
           'Password must contain at least one uppercase letter and one special character')
});

module.exports = {
  userValidation,
  storeValidation,
  ratingValidation,
  loginValidation,
  passwordUpdateValidation
};