import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/productModel.js";
import productRoutes from "./routes/productRoutes.js";
import path from "path";
dotenv.config();

const app = express();

app.use(express.static(path.join(path.resolve(), "/public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "/views"));
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(5500, () => {
      console.log("Server is running on port 5500");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database ", err);
  });

app.use("/products", productRoutes);

app.get("/", async (req, res) => {
  try {
    const [totalProducts, inStockProducts, featuredProducts] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isAvailable: true }),
      Product.find().sort({ _id: -1 }).limit(4),
    ]);

    const outOfStockProducts = totalProducts - inStockProducts;
    const averagePrice =
      featuredProducts.length > 0
        ? Math.round(
            featuredProducts.reduce((sum, item) => sum + Number(item.price || 0), 0) /
              featuredProducts.length
          )
        : 0;

    return res.render("dashboard", {
      stats: {
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        averagePrice,
      },
      featuredProducts,
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    return res.status(500).send("Unable to load dashboard");
  }
});
