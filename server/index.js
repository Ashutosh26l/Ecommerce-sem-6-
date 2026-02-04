import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/productModel.js";
import productRoutes from "./routes/productRoutes.js";
import path from "path";
dotenv.config();

const app = express();
//
app.use(express.static(path.join(path.resolve(),"/public")));
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

app.get("/", (req, res) => {
  res.send("Ecommerce Server is running");
});

// {
//     "name":"mobile",
//     "dateCreated":2025,
//     "warranty":2,
//     "price": 45000,
//     "isAvailable": true
// }

//const products = Product.find();
