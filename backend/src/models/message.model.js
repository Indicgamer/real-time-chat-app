import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     MessageModel:
 *       type: object
 *       required:
 *         - senderId
 *         - receiverId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the message
 *         senderId:
 *           type: string
 *           description: ObjectId reference to the sender user
 *         receiverId:
 *           type: string
 *           description: ObjectId reference to the receiver user
 *         text:
 *           type: string
 *           description: The text content of the message
 *         image:
 *           type: string
 *           description: URL to attached image (if any)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the message was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the message was last updated
 *       example:
 *         _id: "60d0fe4f5311236168a109cb"
 *         senderId: "60d0fe4f5311236168a109ca"
 *         receiverId: "60d0fe4f5311236168a109cd"
 *         text: "Hello, how are you?"
 *         image: "https://res.cloudinary.com/demo/image/upload/message.jpg"
 *         createdAt: "2021-06-21T09:30:00.000Z"
 *         updatedAt: "2021-06-21T09:30:00.000Z"
 */

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
