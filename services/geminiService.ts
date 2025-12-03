import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize the API client
// Note: In a real environment, ensure process.env.API_KEY is defined.
// If the key is missing, the service handles it gracefully by returning error messages.
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// System instruction to guide the AI's persona
const SYSTEM_INSTRUCTION = `You are "WhatNew AI", a helpful digital assistant for the website "WhatNew". 
Your goal is to help users discover the latest tech updates, tools, and digital solutions. 
The website covers topics like AI tools, developer resources, productivity software, and tech news.
Keep your answers concise, friendly, and relevant to technology.
If asked about the website, explain that WhatNew is a hub for smart digital updates.`;

let chatSession: Chat | null = null;

export const initializeChat = (): Chat | null => {
  if (!ai) return null;

  try {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
    return null;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!ai) {
    return "I'm currently offline (API Key missing). Please check back later!";
  }

  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    return "Sorry, I'm having trouble connecting to the network right now.";
  }

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({
      message: message
    });
    return result.text || "I didn't quite get that. Could you rephrase?";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "I encountered an error while processing your request. Please try again.";
  }
};