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

const router = express.Router();

router.use(requireAuthPage);

router.get("/new", getAddProductPage);
router.post("/new", createProductPage);
router.get("/allProducts", getAllProductsPage);
router.get("/edit/:id", getEditProductPage);
router.post("/edit/:id", updateProductPage);
router.post("/:id/reviews", addProductReview);
router.get("/:id", getProductDetailPage);

export default router;
