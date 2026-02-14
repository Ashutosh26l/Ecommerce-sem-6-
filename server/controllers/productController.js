import Product from "../models/productModel.js";

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const parseAvailability = (value) => {
  if (typeof value === "undefined") return undefined;
  if (typeof value === "boolean") return value;
  return value === "true" || value === "on";
};

const normalizeCreatePayload = (body) => {
  const quantity = Math.max(0, toNumber(body.quantity, 0));
  return {
    name: body.name,
    description: body.description || "",
    dateCreated: toNumber(body.dateCreated, Date.now()),
    warranty: toNumber(body.warranty, 0),
    price: toNumber(body.price, 0),
    quantity,
    image: body.image || "",
    isAvailable: quantity > 0,
  };
};

const normalizeUpdatePayload = (body) => {
  const payload = {};

  if (typeof body.name !== "undefined") payload.name = body.name;
  if (typeof body.description !== "undefined") payload.description = body.description;
  if (typeof body.dateCreated !== "undefined") payload.dateCreated = toNumber(body.dateCreated, Date.now());
  if (typeof body.warranty !== "undefined") payload.warranty = toNumber(body.warranty, 0);
  if (typeof body.price !== "undefined") payload.price = toNumber(body.price, 0);
  if (typeof body.quantity !== "undefined") payload.quantity = Math.max(0, toNumber(body.quantity, 0));
  if (typeof body.image !== "undefined") payload.image = body.image;

  const isAvailable = parseAvailability(body.isAvailable);
  if (typeof isAvailable !== "undefined" && typeof payload.quantity === "undefined") {
    payload.isAvailable = isAvailable;
    payload.quantity = isAvailable ? 1 : 0;
  }

  return payload;
};

const getOwnerFilter = (req) => ({ owner: req.user.id });

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find(getOwnerFilter(req)).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const payload = normalizeCreatePayload(req.body);
    const product = await Product.create({
      ...payload,
      owner: req.user.id,
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: not your product" });
    }

    Object.assign(product, normalizeUpdatePayload(req.body));
    await product.save();

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: not your product" });
    }

    await product.deleteOne();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product" });
  }
};

export const getAllProductsPage = async (req, res) => {
  try {
    const { availability, q } = req.query;
    const query = { ...getOwnerFilter(req) };

    if (typeof availability !== "undefined") {
      query.isAvailable = availability === "true";
    }
    if (q) {
      query.name = { $regex: String(q), $options: "i" };
    }

    const allProducts = await Product.find(query).sort({ createdAt: -1 });
    return res.render("products", { allProducts });
  } catch (error) {
    return res.status(500).send("Unable to load products");
  }
};

export const getProductDetailPage = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, ...getOwnerFilter(req) });

    if (!product) {
      return res.status(404).render("product_detail", { product: null });
    }

    return res.render("product_detail", { product });
  } catch (error) {
    return res.status(500).render("product_detail", { product: null });
  }
};

export const getEditProductPage = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, ...getOwnerFilter(req) });

    if (!product) {
      return res.status(404).render("edit", { product: null });
    }

    return res.render("edit", { product });
  } catch (error) {
    return res.status(500).render("edit", { product: null });
  }
};

export const updateProductPage = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, ...getOwnerFilter(req) });

    if (!product) {
      return res.status(403).send("Forbidden");
    }

    Object.assign(product, normalizeUpdatePayload(req.body));
    await product.save();

    return res.redirect(`/products/${product._id}`);
  } catch (error) {
    return res.status(500).send("Unable to update product");
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, rating, comment } = req.body;
    const parsedRating = Number(rating);

    if (!userName || !comment || Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.redirect(`/products/${id}`);
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, ...getOwnerFilter(req) },
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

    if (!updatedProduct) return res.status(403).send("Forbidden");
    return res.redirect(`/products/${id}`);
  } catch (error) {
    return res.redirect(`/products/${req.params.id}`);
  }
};

export const getAddProductPage = (req, res) => {
  return res.render("add_product");
};

export const createProductPage = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send("Product name is required");
    }

    const payload = normalizeCreatePayload(req.body);
    await Product.create({
      ...payload,
      owner: req.user.id,
    });

    return res.redirect("/products/allProducts");
  } catch (error) {
    return res.status(500).send("Unable to add product");
  }
};
