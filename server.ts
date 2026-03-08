import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import path from "path";

dotenv.config();

// SQLite setup for demo request logging
const dataDir = process.env.NODE_ENV === 'production' ? path.join(process.cwd(), 'data') : process.cwd();
try { require('fs').mkdirSync(dataDir, { recursive: true }); } catch {}
const dbPath = path.join(dataDir, "demo_requests.db");
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS demo_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);
const insertStmt = db.prepare("INSERT INTO demo_requests (email) VALUES (?)");

let testAccount: nodemailer.TestAccount | null = null;

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3001", 10);

  app.use(express.json());

  // API routes FIRST
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Log to SQLite
      try {
        insertStmt.run(email);
        console.log(`[DB] Logged demo request: ${email}`);
      } catch (dbErr: any) {
        console.error("[DB] Failed to log:", dbErr.message);
      }

      let transporter;

      // Use real SMTP if configured (Gmail default)
      if (process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER || 'zhangyuandongnb@gmail.com',
            pass: process.env.SMTP_PASS,
          },
        });
      } else {
        // Fallback to Ethereal Email for testing
        if (!testAccount) {
          testAccount = await nodemailer.createTestAccount();
          console.log("Created Ethereal test account:", testAccount.user);
        }
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || '"Ola" <yuz371@ucsd.edu>',
        to: process.env.SMTP_TO || process.env.SMTP_USER || 'zhangyuandongnb@gmail.com',
        subject: "🔔 New Demo Request — Ola",
        text: `New demo request from: ${email}\n\nSubmitted at: ${new Date().toISOString()}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>🔔 New Demo Request</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);

      if (!process.env.SMTP_PASS) {
        console.log("Test email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }

      res.json({ success: true, message: "Demo request received" });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: `Failed to process request: ${error.message || 'Unknown error'}` });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
