// import mongoose from "mongoose";
// // import bcrypt from "bcrypt";

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["user", "admin"], default: "user" },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   phoneNumber: { type: String },
//   addresses: [
//     {
//       street: String,
//       city: String,
//       state: String,
//       zipCode: String,
//       country: String,
//       isDefault: { type: Boolean, default: false },
//     },
//   ],
//   profilePicture: { type: String, default: null },
//   isVerified: { type: Boolean, default: false },
//   lastLogin: { type: Date, default: null },
//   preferences: {
//     language: { type: String, default: "en" },
//     currency: { type: String, default: "USD" },
//   },
//   failedLoginAttempts: { type: Number, default: 0 },
//   lockUntil: { type: Date, default: null },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // Pre-save hook to update updatedAt
// userSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // Virtual for fullName
// userSchema.virtual("fullName").get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

// // Instance method for password comparison
// // userSchema.methods.comparePassword = async function (candidatePassword) {
// //   return await bcrypt.compare(candidatePassword, this.password);
// // };

// const user = mongoose.model("user", userSchema);

// export default user;
