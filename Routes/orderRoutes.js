import { Router as expressRouter } from "express";
import Order from "../Models/OrderModel.js";

const orderRouter = expressRouter();

// Create order

orderRouter.post("/", async (req, res) => {
  const {
    userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json("No order items");
  } else {
    const order = new Order({
      orderItems,
      user: userId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createOrder = await order.save();
    res.status(201).json(createOrder);
  }
});

// ADMIN GET ALL ORDERS
orderRouter.get("/all", async (req, res) => {
  const orders = await Order.find({})
    .sort({ _id: -1 })
    .populate("user", "id name email");
  res.status(200).json(orders);
});

// GET FILTERED ORDERS

orderRouter.get("/user/:id/filtered", async (req, res) => {
  try {
    let orders = [];
    let sort_order = -1,
      status = false;
    if (req.query.order) {
      sort_order =
        req.query.order !== "0" ? Number(req.query.order) : sort_order;
    }
    if (req.query.status && req.query.status !== "0") {
      status = req.query.status === "1" ? false : true;
    }

    orders = await Order.find({ user: req.params.id, isDelivered: status })
      .sort({ createdAt: sort_order })
      .populate("user", "id name email");

    if (orders) res.status(200).json(orders);
    else res.status(404).json("No orders found");
  } catch (err) {
    res.status(500).json(err);
  }
});

// USER LOGIN ORDERS
orderRouter.get("/user/:id", async (req, res) => {
  const orders = await Order.find({ user: req.params.id }).sort({ _id: -1 });
  res.status(200).json(orders);
});

// GET ORDER BY ID
orderRouter.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json("Order Not Found");
  }
});

// ORDER IS PAID
orderRouter.put("/:id/pay", async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404).json("Order Not Found");
  }
});

// ORDER IS DELIVERED
orderRouter.put("/:id/delivered", async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404).json("Order Not Found");
  }
});

export default orderRouter;
