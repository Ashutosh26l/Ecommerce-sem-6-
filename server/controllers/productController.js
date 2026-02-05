import Product from "../models/productModel.js";

export const addProductController = async (req, res) => {
  try {
    const { name, dateCreated, warranty, price, isAvailable, image } = req.body;
    const newProduct = new Product({
      name,
      dateCreated,
      warranty,
      price,
      isAvailable,
      image,
    });
    await newProduct.save();
    res.send("New product has been added");
  } catch (error) {
    console.error(error);
    res.send("Data Couldnot be added to the database");
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { availability } = req.query;

    // If availability param is provided, filter by it; otherwise fetch all
    const query = availability ? { isAvailable: availability } : {};

    const allProducts = await Product.find(query);

    if (!allProducts || allProducts.length === 0) {
      return res.json({ message: "No products available" });
    }

    res.render("products", { allProducts });
  } catch (error) {
    console.error("Error:", error);
    res.json({ message: "Error fetching the products" });
  }
};

export const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { image },
      { new: true }
    );

    if (!updatedProduct) {
      return res.json({ message: "Product not found" });
    }

    res.json({
      message: "Image updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({ message: "Error updating image" });
  }
};

// Fix: Update all products with correct image paths
export const fixProductImages = async (req, res) => {
  try {
    const { image } = req.query; // Get image from query param
    const defaultImage = image || "/mobile.jpg";

    const result = await Product.updateMany(
      {},
      { $set: { image: defaultImage } }
    );

    res.json({
      message: `Updated ${result.modifiedCount} products with image: ${defaultImage}`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({ message: "Error fixing product images" });
  }
};

export const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).render("product_detail", { product: null });
    }

    res.render("product_detail", { product });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("product_detail", { product: null });
  }
};
