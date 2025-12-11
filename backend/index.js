require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db");
const signPdfRoute = require("./routes/signPdf");

const app = express();

// Connect Mongo
connectDB();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Static folder for signed PDFs
app.use("/signed", express.static(path.join(__dirname, "signed")));

// Routes
app.use("/api", signPdfRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔥 Server running on port ${PORT}`)
);
