"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Shutdown() {
  const [isOn, setIsOn] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(
          "https://voice-ai-back.vercel.app/switch"
        );
        const isSystemOn = response.data.switch === "on";
        setIsOn(isSystemOn); // Assume the response contains a field indicating if the system is on
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    checkStatus();
  }, []);

  const handleShutdown = async () => {
    const requestBody = {
      switch: isOn ? "off" : "on",
    };

    try {
      await axios.post("https://voice-ai-back.vercel.app/switch", requestBody);
      setIsOn(!isOn); // Toggle the state
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };
  return (
    <div className="container">
      <button
        onClick={handleShutdown}
        className={`shutdown-button ${isOn ? "on" : "off"}`}
      >
        System is {isOn ? "On" : "Off"}
      </button>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .shutdown-button {
          padding: 20px 40px;
          font-size: 20px;
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s;
        }

        .on {
          background-color: #4caf50; /* Green for "On" */
        }

        .off {
          background-color: #f44336; /* Red for "Off" */
        }

        .shutdown-button:hover {
          transform: scale(1.05); /* Slightly enlarge button on hover */
        }
      `}</style>
    </div>
  );
}
