require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected!"))
  .catch(err => console.error("DB Connection Error:", err));

// Schema & Model
const submissionSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    message:{type:String},
    submittedAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', submissionSchema);

// Routes
app.post('/api/submit', async (req, res) => {
    console.log("Frontend se ye data aaya:", req.body);
    try {
        const { name, email,message } = req.body;

        const alreadyExists = await Submission.findOne({ email });

        if (alreadyExists) {
            return res.status(409).json({ 
                success: false, 
                message: "You have already submitted this form." 
            });
        }

        const newSubmission = new Submission({ name, email,message });
        await newSubmission.save();

        res.status(200).json({ success: true, message: "Data saved in Database!" });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));