"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [renderId, setRenderId] = useState<string | null>(null);
  const [bucketName, setBucketName] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!renderId || !bucketName) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ renderId, bucketName }),
        });

        if (!response.ok) {
          throw new Error("Failed to get progress");
        }

        const progressData = await response.json();

        if (progressData.fatalErrorEncountered) {
          setError(progressData.errors[0].message);
          clearInterval(interval);
          return;
        }

        if (progressData.done) {
          setFinalVideoUrl(progressData.outputFile);
          setProgress(1);
          clearInterval(interval);
          return;
        }

        setProgress(progressData.overallProgress);
      } catch (err) {
        setError((err as Error).message);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [renderId, bucketName]);

  const handleRender = async () => {
    if (!videoUrl) {
      alert("Please enter a video URL.");
      return;
    }

    setIsRendering(true);
    setRenderId(null);
    setBucketName(null);
    setProgress(null);
    setFinalVideoUrl(null);
    setError(null);

    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start render");
      }

      const { renderId, bucketName } = await response.json();
      setRenderId(renderId);
      setBucketName(bucketName);

    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Dynamic Video Renderer</h1>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
          className="p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleRender}
          disabled={isRendering}
          className="p-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 transition-colors"
        >
          {isRendering ? "Rendering..." : "Render Video"}
        </button>
      </div>

      {renderId && (
        <div className="mt-8 w-full max-w-md">
          <p className="mb-2">Render started! Polling for progress...</p>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(progress || 0) * 100}%` }}
            ></div>
          </div>
          <p className="text-right text-sm mt-1">
            {Math.round((progress || 0) * 100)}%
          </p>
        </div>
      )}

      {error && (
        <div className="mt-8 text-red-500">
          <p>Error: {error}</p>
        </div>
      )}

      {finalVideoUrl && (
        <div className="mt-8">
          <p className="text-2xl mb-4">Rendering Complete!</p>
          <a
            href={finalVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded bg-green-600 hover:bg-green-700 text-white text-lg"
          >
            Download Video
          </a>
        </div>
      )}
    </main>
  );
} 