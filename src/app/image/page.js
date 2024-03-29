"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // Added for making HTTP requests
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export default function Generator() {
  const [inputText, setInputText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSystemOn, setIsSystemOn] = useState(true); // State to track system status
  const textareaRef = useRef(null);

  // Check system status as soon as the page loads
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const response = await axios.get(
          "https://voice-ai-back.vercel.app/switch"
        );
        setIsSystemOn(response.data.value === "on");
      } catch (error) {
        console.error("Error checking system status:", error);
        setIsSystemOn(false); // In case of error, assume the system is off
      }
    };

    checkSystemStatus();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [inputText]);

  const handleInput = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSystemOn) {
      return; // Prevent image generation if the system is off
    }
    setIsLoading(true);

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      const response = await openai.images.generate({
        prompt: inputText,
        n: 1,
        size: "1024x1024",
        model: "dall-e-3",
        quality: "hd",
      });

      setImageUrl(response.data[0].url);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Display error message if the system is off
  if (!isSystemOn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p>The system is shut down for now.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <header className="header-container">
        <div className="header-content">
          <img
            src="/logo.png"
            alt="Descriptive Alt Text"
            className="header-image"
          />
          <h1 className="header-title">Image Generator</h1>
        </div>
      </header>

      <div className="main-content flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="form-container w-full max-w-4xl px-4"
        >
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleInput}
            placeholder="Enter text"
            className="input-text"
            rows="2"
          />
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Loading..." : "Generate"}
          </button>
        </form>

        <div className="outer-container w-full">
          <div className="left-image-container">
            <img src="/logo2.png" alt="Left Image" className="left-image" />
          </div>

          <div className="image-display-container">
            {isLoading ? (
              <p>Loading image...</p>
            ) : imageUrl ? (
              <img src={imageUrl} alt="Generated" className="generated-image" />
            ) : (
              <p>Image will appear here</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
