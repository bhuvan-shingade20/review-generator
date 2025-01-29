const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Anthropic = require('@anthropic-ai/sdk');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Set up Anthropic API configuration
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

// MongoDB Schema
const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  text: String,
  stars: Number,
  keywords: [String],
});
const Review = mongoose.model('Review', reviewSchema);

// Routes
app.post("/api/generate-review", async (req, res) => {
  try {
    const { keywords } = req.body;

    console.log("Received keywords:", keywords);

    // Validate input
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: "Keywords must be a non-empty array" });
    }

    // Generate review using Claude with more detailed error handling
    let message;
    try {
      message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Generate a product review based on these keywords: ${keywords.join(", ")}`
        }],
        system: "You are a helpful assistant that generates product reviews based on keywords. But don't include the ratings"
      });
      
      console.log("Claude API Response:", JSON.stringify(message, null, 2));
    } catch (apiError) {
      console.error("Claude API Error:", apiError);
      return res.status(500).json({ 
        error: "Error calling Claude API", 
        details: apiError.message 
      });
    }

    // Validate Claude response
    if (!message?.content) {
      console.error("Invalid Claude response structure:", message);
      return res.status(500).json({ 
        error: "Invalid response from Claude API",
        details: "Response missing content field" 
      });
    }

    // Extract the review text
    const reviewText = message.content[0]?.text?.trim();

    if (!reviewText) {
      console.error("No review text in response:", message);
      return res.status(500).json({ 
        error: "No review text generated",
        details: "Response content was empty" 
      });
    }

    const reviewCount = await Review.countDocuments();
    const reviewId = `r${reviewCount + 1}`;

    // Create and save review
    try {
      const newReview = new Review({
        id: reviewId,
        text: reviewText,
        stars: Math.floor(Math.random() * 5) + 1,
        keywords,
      });

      const savedReview = await newReview.save();
      res.status(201).json({ 
        message: "Review generated successfully", 
        review: savedReview 
      });
    } catch (dbError) {
      console.error("Database Error:", dbError);
      return res.status(500).json({ 
        error: "Failed to save review to database",
        details: dbError.message 
      });
    }

  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ 
      error: "An unexpected error occurred",
      details: error.message 
    });
  }
});

app.post('/api/save-review', async (req, res) => {
  const { text, stars, keywords } = req.body;

  try {
    const newReview = new Review({ text, stars, keywords });
    await newReview.save();
    res.status(201).json({ message: 'Review saved successfully' });
  } catch (err) {
    console.error('Error saving review:', err);
    res.status(500).json({ error: 'Failed to save review' });
  }
});

app.get('/api/get-stats', async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const starDistribution = await Review.aggregate([
      { $group: { _id: '$stars', count: { $sum: 1 } } },
    ]);
    res.json({ totalReviews, starDistribution });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/get-reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'An error occurred while fetching reviews' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});