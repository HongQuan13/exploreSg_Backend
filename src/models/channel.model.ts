// import mongoose, { model } from "mongoose";

// const DOCUMENT_NAME: string = "Channel";
// const COLLECTION_NAME: string = "Channels";

// const channelSchema = new mongoose.Schema(
//   {
//     conversationId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Conversation",
//       required: true,
//     },
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     message: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//     collection: COLLECTION_NAME,
//   }
// );

// //Export the model
// export default mongoose.model(DOCUMENT_NAME, channelSchema);
