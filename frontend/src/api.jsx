import axios from "axios";

// Automatically detects if React is built for Render, or running locally
const isProduction = process.env.NODE_ENV === "production";

// Automatically grabs 'localhost' or your phone's '192.168.x.x' IP
const currentHost = window.location.hostname;

// 🌟 THE MAGIC SWITCH 🌟
export const API_URL = isProduction 
  ? "https://way2win-backend.onrender.com" // Used when live on Render
  : `http://${currentHost}:5000`;          // Used when testing locally

const api = axios.create({
  baseURL: API_URL,
});

export default api;