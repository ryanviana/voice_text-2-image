"use client";
import React, { useState, useRef, useEffect } from "react";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export default function Generator() {
  const [inputText, setInputText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

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
        model: "dall-e-2",
      });

      setImageUrl(response.data[0].url);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
