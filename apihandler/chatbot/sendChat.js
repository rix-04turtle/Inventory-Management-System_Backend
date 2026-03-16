import { GoogleGenAI } from "@google/genai";
import ChatSession from "../../models/ChatSessions.js";

async function sendChat(req, res) {
  try {
    let loggedInUser = req.authMiddleware; // Assuming authMiddleware attaches user info to req
    if (!loggedInUser) {
      return res
        .status(401)
        .json({ status: "failed", message: "Unauthorized" });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ status: "failed", message: "Message text is required" });
    }

    const GEMINI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ status: "failed", message: "Gemini API key not configured." });
    }

    // Initialize Gemini API client
    const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Configure the model
    let MODEL_ID = "gemini-3.1-flash-lite-preview";
    
    const response = await genAI.models.generateContent({
      model: MODEL_ID,
      contents: text,
      config: {
        systemInstruction: "You are a specialized Inventory Management and Product Assistant. Only answer questions related to Inventory Management and Products such as Clothing, Electronics, Food, Groceries, Makeup, Stationeries, etc. If the user asks about anything unrelated to these topics, politely decline to answer and specify that you only assist with inventory and product-related queries."
      }
    });
    
    const botReply = response.text || "Sorry, I couldn't generate a response.";

    // Save to DB
    let session = await ChatSession.findOne({ customerId: loggedInUser._id });
    if (!session) {
      session = new ChatSession({
        customerId: loggedInUser._id,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    session.messages.push({ sender: "USER", text: text, timestamp: new Date() });
    session.messages.push({ sender: "BOT", text: botReply, timestamp: new Date() });
    session.updatedAt = new Date();
    await session.save();

    return res
      .status(200)
      .json({ status: "success", message: botReply });
  } catch (error) {
    console.error("Error in chatbot:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Server error in chatbot." });
  }
}

export default sendChat;
