import express from "express";
import {
  addProductReview,
  createProductPage,
  getAddProductPage,
  getAllProductsPage,
  getEditProductPage,
  getProductDetailPage,
  updateProductPage,
} from "../controllers/productController.js";
import { requireAuthPage } from "../middleware/auth.js";
import { validateProduct, validateReview } from "../middleware/validation.js";

const router = express.Router();

router.use(requireAuthPage);

router.get("/new", getAddProductPage);
router.post("/new", validateProduct, createProductPage);
router.get("/allProducts", getAllProductsPage);
router.get("/edit/:id", getEditProductPage);
router.post("/edit/:id", validateProduct, updateProductPage);
router.post("/:id/reviews", validateReview, addProductReview);
router.get("/:id", getProductDetailPage);

export default router;
