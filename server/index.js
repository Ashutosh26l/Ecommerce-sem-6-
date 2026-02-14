import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import productRoutes from "./routes/productRoutes.js";
import productApiRoutes from "./routes/productApiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDb from "./config/db.js";
import Product from "./models/productModel.js";
import { attachCurrentUser } from "./middleware/auth.js";
import { ensureCsrfToken, verifyCsrfToken } from "./middleware/csrf.js";
import path from "path";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;
const allowedOrigins = (process.env.CORS_ORIGIN || `http://localhost:${PORT}`)
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts. Please try again later." },
});

app.use(express.static(path.join(path.resolve(), "/public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "/views"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(attachCurrentUser);
app.use(ensureCsrfToken);
app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/auth", verifyCsrfToken, authRoutes);
app.use("/api/products", productApiRoutes);
app.use("/products", verifyCsrfToken, productRoutes);

app.get("/", async (req, res) => {
  try {
    if (!res.locals.currentUser) {
      return res.render("home");
    }

    const ownerFilter = { owner: req.user.id };
    const [totalProducts, inStockProducts, featuredProducts] = await Promise.all([
      Product.countDocuments(ownerFilter),
      Product.countDocuments({ ...ownerFilter, isAvailable: true }),
      Product.find(ownerFilter).sort({ _id: -1 }).limit(4),
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

app.get("/api/health", (req, res) => {
  return res.status(200).json({ message: "Inventory API is running" });
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
