import { Router as expressRouter } from "express";
import Product from "../Models/ProductModel.js";
// import { productsData } from "../Data/Products.js";

const productRouter = expressRouter();

// get paginated products

productRouter.get("/paginated", async (req, res) => {
  // const num_pages = ((await Product.count({})) - 12) / 4;
  const pageNo = Number(req.query.page);
  const start_id = 4 * pageNo + 5;
  try {
    const products =
      pageNo === 1
        ? await Product.find({ id: { $gte: 1, $lte: 12 } })
        : await Product.find({ id: { $gte: start_id, $lte: start_id + 3 } });

    if (products && products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json("There are no products for that page no");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all products

productRouter.get("/all", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: 1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get product by id

productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json("Product not Found");
  }
});

// get product by query string

productRouter.get("/", async (req, res) => {
  const keyword = req.query.keyword
    ? {
        brand: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const products = await Product.find({ ...keyword });
  if (products) {
    res.status(200).json(products);
  } else {
    res.status(404).json("No products found");
    throw new Error("Product not Found");
  }
});

// Create Product

productRouter.post("/", async (req, res) => {
  try {
    const { brand, title, old_price, new_price, images, countInStock, rating } =
      req.body;

    const productExist = await Product.findOne({ brand: brand, title: title });
    if (productExist) {
      res.status(400);
      throw new Error("Product already exist");
    } else {
      const product = new Product({
        brand,
        title,
        old_price,
        new_price,
        images,
        countInStock,
        rating,
      });
      const id = (await Product.find({}).sort({ _id: 1 })).length + 1;
      if (product) {
        product.id = id;
        const createdproduct = await product.save();
        res.status(201).json(createdproduct);
      } else {
        res.status(400);
        throw new Error("Invalid product data");
      }
    }
  } catch (err) {
    res.status(404).json(err);
  }
});

// Update Product

productRouter.put("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const { brand, title, price, images, countInStock, rating } = req.body;
      product.brand = brand || product.brand;
      product.title = title || product.title;
      product.old_price = price ? product.new_price : product.old_price;
      product.new_price = price || product.new_price;
      product.images = images || product.images;
      product.countInStock = countInStock || product.countInStock;
      product.rating = rating || product.rating;

      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.json(404).json("Product does not exist");
    }
  } catch (err) {
    res.status(404).json(err);
  }
});

// Delete Product

productRouter.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.status(200).json("Product deleted successfully");
    } else {
      res.status(404).json("Product not found");
    }
  } catch (err) {
    res.send(404).json(err);
  }
});

// add product review

productRouter.post("/:id/review", async (req, res) => {
  try {
    const { name, userId, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === userId.toString()
      );
      if (alreadyReviewed)
        res.status(400).json("You have already reviewed this product");
      else {
        const review = {
          userName: name,
          rating: Number(rating),
          comment,
          user: userId,
        };
        product.reviews.push(review);
        const avg = product.reviews.reduce((acc, item) => {
          acc += item.rating;
          return acc;
        }, 0);
        if (product.reviews.length > 0)
          product.rating = (avg / product.reviews.length).toFixed(1);
        await product.save();
        res.status(201).json("Review saved");
      }
    } else {
      res.status(404).json("Product Not Found!");
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

export default productRouter;
