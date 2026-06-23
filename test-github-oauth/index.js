import express from "express";
import dotenv from "dotenv";
import path from "path";
import { GitHubOAuthSdk } from "@microfox/github-oauth";
import fetch from "node-fetch";

dotenv.config({ path: path.resolve("./.env"), override: true });

const app = express();
const port = 3000;

const client = new GitHubOAuthSdk({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: `http://localhost:${port}/callback`,
  scopes: ["user", "user:email"]
});

// Home route
app.get("/", (req, res) => {
  res.send('<a href="/login">Login with GitHub</a>');
});

// Step 1: Redirect user to GitHub login
app.get("/login", (req, res) => {
  const authUrl = client.getAuthUrl({ state: "test-state" });
  res.redirect(authUrl);
});

// Step 2: GitHub redirects back with ?code=...
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing code");

  try {
    // Exchange code for access token
    const tokens = await client.exchangeCodeForTokens(code);

    // Fetch user profile from GitHub
    const profileResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/vnd.github+json"
      }
    });
    const profile = await profileResponse.json();

    res.send({
      message: "OAuth Success 🎉",
      tokens,
      profile
    });
  } catch (err) {
    console.error("Error exchanging code:", err);
    res.status(500).send("OAuth failed");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`👉 Visit http://localhost:${port}/login to start GitHub OAuth`);
});
