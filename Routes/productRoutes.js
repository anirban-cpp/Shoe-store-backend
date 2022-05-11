import { Router as expressRouter } from "express";
import Product from "../Models/ProductModel.js";
// import { productsData } from "../Data/Products.js";

const productRouter = expressRouter();

// add all products

// productRouter.post("/", async (req, res) => {
//   let success = true;
//   for (let i = 0; i < productsData.length; i++) {
//     const newProduct = new Product(productsData[i]);
//     try {
//       await newProduct.save();
//     } catch (err) {
//       res.status(500).json(err);
//       success = false;
//       break;
//     }
//   }
//   if (success) {
//     res.status(200).json("Successfully uploaded");
//   }
// });

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
    res.status(404);
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
    if(product){
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
    }
    else {
      res.json(404).json("Product does not exist");
    }
  } catch (err) {
    res.status(404).json(err);
  }
})

// Delete Product

productRouter.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(product) {
      await product.remove();
      res.status(200).json("Product deleted successfully");
    } else {
      res.status(404).json("Product not found");
    }
  } catch(err) {
    res.send(404).json(err);
  }
})

export default productRouter;
