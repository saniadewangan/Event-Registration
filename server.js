const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");


const app = express();
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((error) => console.log("MongoDB Connection Error:", error));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));


const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  college: String,
  event: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.post("/api/register", async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});
// Admin API - Get all registrations
app.get("/api/admin/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ _id: -1 });

    res.json({
      success: true,
      registrations
    });

  } catch (error) {
    console.log("Admin Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch registrations"
    });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
