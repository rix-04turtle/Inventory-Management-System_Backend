import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import sendChat from "./sendChat.js";

const chatbotRouter = express();


// Route: [POST] /chatbot/chat
chatbotRouter.post("/chat", authMiddleware, sendChat);


//BASE ROUTE : /chatbot
export default chatbotRouter;