import express from "express";
import Product from "../models/product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/products
// @desc    Get products with search, category, sorting and pagination
// @access  Public
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      sort = "",
    } = req.query;

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 9, 1),
      50
    );

    const skip = (page - 1) * limit;

    // MongoDB filter
    const filter = {};

    // Search by product name or description
    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // Filter by category
    if (category.trim()) {
      filter.category = category.trim();
    }

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "price-low") {
      sortOption = {
        price: 1,
      };
    } else if (sort === "price-high") {
      sortOption = {
        price: -1,
      };
    } else if (sort === "newest") {
      sortOption = {
        createdAt: -1,
      };
    }

    // Count products after applying filters
    const totalProducts = await Product.countDocuments(filter);

    // Get products for the current page
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      page,
      pages,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get a single product
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      countInStock,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      countInStock,
      user: req.user._id,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price ?? product.price;
      product.image = image || product.image;
      product.category = category || product.category;
      product.countInStock =
        countInStock ?? product.countInStock;

      const updatedProduct = await product.save();

      res.json(updatedProduct);
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();

      res.json({
        message: "Product removed",
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;