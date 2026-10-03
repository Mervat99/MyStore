
import express from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order (any logged-in user)
router.post("/", protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    // =========================
    // Validate order items
    // =========================

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    // =========================
    // Validate shipping address
    // =========================

    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        message: "Complete shipping address is required",
      });
    }

    // =========================
    // Build secure order items
    // =========================

    const secureOrderItems = [];
    let calculatedTotalPrice = 0;

    for (const item of orderItems) {
      if (!item.product) {
        return res.status(400).json({
          message: "Product ID is required",
        });
      }

      const qty = Number(item.qty);

      if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({
          message: "Invalid product quantity",
        });
      }

      // Get the real product from database
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product}`,
        });
      }

      // Initial stock check
      if (product.countInStock < qty) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock`,
        });
      }

      // Use real product information from database
      secureOrderItems.push({
        name: product.name,
        qty,
        image: product.image,
        price: product.price,
        product: product._id,
      });

      calculatedTotalPrice += product.price * qty;
    }

    // =========================
    // Decrease stock atomically
    // =========================

    for (const item of secureOrderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,

          // Only update if enough stock still exists
          countInStock: {
            $gte: item.qty,
          },
        },
        {
          $inc: {
            countInStock: -item.qty,
          },
        },
        {
          new: true,
        }
      );

      // Another request may have bought the stock
      // between our initial check and this update.
      if (!updatedProduct) {
        return res.status(400).json({
          message: `${item.name} is no longer available in the requested quantity`,
        });
      }
    }

    // =========================
    // Create order
    // =========================

    const order = new Order({
      user: req.user._id,
      orderItems: secureOrderItems,
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        phone: shippingAddress.phone,
      },
      totalPrice: calculatedTotalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get the current user's own orders
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (admin only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc   Update order status (admin only)
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const allowedStatuses = [
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    order.status = req.body.status;

    // Keep isDelivered synchronized with status
    order.isDelivered = req.body.status === "Delivered";

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// @route   GET /api/orders/:id
// @desc   Get one order (owner or admin)
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // =========================
    // Authorization
    // =========================
    // Normal users can only see their own orders.
    // Admins can see any order.

    const isOwner =
      order.user.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Not authorized to view this order",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;

