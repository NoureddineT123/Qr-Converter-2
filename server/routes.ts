import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateQrSchema, decodeQrSchema } from "@shared/schema";
import QRCode from "qrcode";
import { Jimp } from "jimp";
import QrReader from "qrcode-reader";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate QR code from URL
  app.post("/api/generate-qr", async (req, res) => {
    try {
      const { url } = generateQrSchema.parse(req.body);
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Store activity
      await storage.addQrActivity({
        url,
        type: "generate",
      });

      res.json({ qrCodeDataUrl });
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to generate QR code" 
      });
    }
  });

  // Decode QR code from uploaded image
  app.post("/api/decode-qr", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Read image with jimp
      const image = await Jimp.read(req.file.buffer);
      const qrReader = new QrReader();

      // Decode QR code
      const result = await new Promise<string>((resolve, reject) => {
        qrReader.callback = (err, value) => {
          if (err) {
            reject(new Error("Unable to decode QR code. Please try a different image."));
          } else {
            resolve(value.result);
          }
        };
        qrReader.decode(image.bitmap);
      });

      // Store activity
      await storage.addQrActivity({
        url: result,
        type: "decode",
      });

      res.json({ url: result });
    } catch (error) {
      console.error("Error decoding QR code:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to decode QR code" 
      });
    }
  });

  // Get recent activities
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getRecentActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Clear all activities
  app.delete("/api/activities", async (req, res) => {
    try {
      await storage.clearActivities();
      res.json({ message: "Activities cleared" });
    } catch (error) {
      console.error("Error clearing activities:", error);
      res.status(500).json({ message: "Failed to clear activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
