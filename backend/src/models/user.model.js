import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserModel:
 *       type: object
 *       required:
 *         - email
 *         - fullName
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *           unique: true
 *         fullName:
 *           type: string
 *           description: The user's full name
 *         password:
 *           type: string
 *           minLength: 6
 *           description: The user's hashed password
 *         profilePic:
 *           type: string
 *           description: URL to the user's profile picture
 *           default: ""
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *       example:
 *         _id: "60d0fe4f5311236168a109ca"
 *         email: "john.doe@example.com"
 *         fullName: "John Doe"
 *         profilePic: "https://res.cloudinary.com/demo/image/upload/profile.jpg"
 *         createdAt: "2021-06-21T09:30:00.000Z"
 *         updatedAt: "2021-06-21T09:30:00.000Z"
 */

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
