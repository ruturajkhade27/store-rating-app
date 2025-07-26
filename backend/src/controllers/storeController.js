const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { storeValidation, userValidation } = require("../utils/validation");

const prisma = new PrismaClient();

const createStore = async (req, res) => {
  try {
    const { store } = req.body;

    if (!store || !store.ownerId) {
      return res
        .status(400)
        .json({ message: "Store and ownerId are required" });
    }

    const validatedStore = storeValidation.parse(store);

    const existingStore = await prisma.store.findUnique({
      where: { email: validatedStore.email },
    });

    if (existingStore) {
      return res
        .status(400)
        .json({ message: "Store already exists with this email" });
    }

    const owner = await prisma.user.findUnique({
      where: { id: store.ownerId },
    });

    if (!owner || owner.role !== "STORE_OWNER") {
      return res
        .status(400)
        .json({ message: "Invalid or non-store owner user" });
    }

    const newStore = await prisma.store.create({
      data: {
        name: validatedStore.name,
        email: validatedStore.email,
        address: validatedStore.address,
        ownerId: store.ownerId,
      },
    });

    res.status(201).json({
      message: "Store created successfully",
      store: newStore,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Create store error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStores = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      name,
      email,
      address,
      search,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (name) where.name = { contains: name };
    if (email) where.email = { contains: email };
    if (address) where.address = { contains: address };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
      ];
    }

    const orderBy = {};
    orderBy[sortBy] = sortOrder.toLowerCase();

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              address: true,
            },
          },
          ratings: {
            select: {
              rating: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy,
      }),
      prisma.store.count({ where }),
    ]);

    const storesWithRatings = stores.map((store) => {
      const ratings = store.ratings;
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      let userRating = null;
      if (req.user && req.user.role === "USER") {
        const userRatingObj = ratings.find((r) => r.user.id === req.user.id);
        userRating = userRatingObj ? userRatingObj.rating : null;
      }

      return {
        ...store,
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalRatings: ratings.length,
        userRating,
        ratings: undefined, 
      };
    });

    res.json({
      stores: storesWithRatings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Get stores error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id: parseInt(id) },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const ratings = store.ratings;
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    res.json({
      store: {
        ...store,
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalRatings: ratings.length,
      },
    });
  } catch (error) {
    console.error("Get store by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOwnerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const store = await prisma.store.findUnique({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!store) {
      return res
        .status(404)
        .json({ message: "Store not found for this owner" });
    }

    const ratings = store.ratings;
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalRatings: ratings.length,
      },
      ratings: ratings.map((rating) => ({
        id: rating.id,
        rating: rating.rating,
        createdAt: rating.createdAt,
        user: rating.user,
      })),
    });
  } catch (error) {
    console.error("Get owner dashboard error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createStore,
  getStores,
  getStoreById,
  getOwnerDashboard,
};
