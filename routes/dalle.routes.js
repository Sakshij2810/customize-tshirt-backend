//https://platform.openai.com/api-keys

import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";
// import { OpenAI } from "openai";

dotenv.config();

const router = express.Router();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image = response.data.data[0].b64_json;

    // Log the response for debugging
    console.log("Response from OpenAI:", response);

    // Assuming you want to send the generated image back as a response
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error("Error generating image:", error);

    // Send an error response back to the client
    // Check if the error is due to billing hard limit
    if (error.code === "billing_hard_limit_reached") {
      res.status(403).json({
        message:
          "Billing hard limit reached. Please upgrade your plan or try again later.",
      });
    } else {
      // Send a generic error response
      res.status(500).json({ message: "Something went wrong" });
    }
  }
});

export default router;
