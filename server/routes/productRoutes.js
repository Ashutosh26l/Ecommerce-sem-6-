import express from "express";
import {
  addProductController,
  getAllProducts,
  updateProductImage,
  fixProductImages,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/add", addProductController);

router.get("/allProducts", getAllProducts);

router.put("/update-image/:id", updateProductImage);

router.get("/fix-images", fixProductImages);

export default router;
