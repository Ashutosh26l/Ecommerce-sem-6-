import express from "express";
import {
  addProductController,
  getAllProducts,
  updateProductImage,
  fixProductImages,
  getProductDetail,
  getEditProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/add", addProductController);

router.get("/allProducts", getAllProducts);

router.get("/edit/:id", getEditProduct);

router.post("/edit/:id", updateProduct);

router.get("/:id", getProductDetail);

router.put("/update-image/:id", updateProductImage);

router.get("/fix-images", fixProductImages);

export default router;
