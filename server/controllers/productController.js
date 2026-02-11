import Product from "../models/productModel.js";

export const addProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      dateCreated,
      warranty,
      price,
      isAvailable,
      image,
    } = req.body;
    const newProduct = new Product({
      name,
      description,
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

export const fixProductImages = async (req, res) => {
  try {
    const { image } = req.query;
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

export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, rating, comment } = req.body;

    const parsedRating = Number(rating);
    if (
      !userName ||
      !comment ||
      Number.isNaN(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      return res.redirect(`/products/${id}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          reviews: {
            userName: String(userName).trim(),
            rating: parsedRating,
            comment: String(comment).trim(),
          },
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).render("product_detail", { product: null });
    }

    return res.redirect(`/products/${id}`);
  } catch (error) {
    console.error("Error:", error);
    return res.redirect(`/products/${req.params.id}`);
  }
};

export const getEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).render("edit", { product: null });
    }

    res.render("edit", { product });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("edit", { product: null });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, dateCreated, warranty, price, image } = req.body;
    const isAvailable =
      req.body.isAvailable === "true" || req.body.isAvailable === "on";

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        dateCreated,
        warranty,
        price,
        isAvailable,
        image,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).render("edit", { product: null });
    }

    return res.redirect(`/products/${updatedProduct._id}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("edit", { product: null });
  }
};
