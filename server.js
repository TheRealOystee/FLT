const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://your-app-name.onrender.com/oauth2callback";  // Replace with your Render URL

app.get("/auth", (req, res) => {
    const authURL = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/youtube.force-ssl`;
    res.redirect(authURL);
});

app.get("/oauth2callback", async (req, res) => {
    const code = req.query.code;
    try {
        const response = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code,
            grant_type: "authorization_code"
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "OAuth failed", details: error.response.data });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
