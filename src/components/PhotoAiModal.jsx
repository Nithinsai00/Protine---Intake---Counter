import React, { useState, useRef, useEffect } from "react";
import { X, Camera, Upload, Sparkles, Check, RefreshCw, AlertCircle, Info, Utensils } from "lucide-react";
import { analyzeFoodImage } from "../services/aiVisionApi";

export default function PhotoAiModal({ isOpen, onClose, onAddFood, geminiApiKey, onOpenSettings }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [mealCategory, setMealCategory] = useState("Lunch");
  const [useCamera, setUseCamera] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Reset when opening modal
  useEffect(() => {
    if (isOpen) {
      setImageSrc(null);
      setAnalysisResult(null);
      setErrorMessage("");
      setUseCamera(false);
    } else {
      stopCamera();
    }
  }, [isOpen]);

  // Clean up camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Start device camera
  const startCamera = async () => {
    setErrorMessage("");
    setUseCamera(true);
    setImageSrc(null);
    setAnalysisResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access failed:", err);
      setErrorMessage("Could not access camera. Please allow camera permissions or upload a photo instead.");
      setUseCamera(false);
    }
  };

  // Capture frame from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL("image/jpeg", 0.85);
    stopCamera();
    setUseCamera(false);
    setImageSrc(base64);
    runAnalysis(base64);
  };

  // Handle uploaded file
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setImageSrc(base64);
      runAnalysis(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  // Run AI analysis
  const runAnalysis = async (base64, mimeType = "image/jpeg") => {
    setIsAnalyzing(true);
    setErrorMessage("");
    setAnalysisResult(null);

    try {
      const result = await analyzeFoodImage(base64, mimeType, geminiApiKey);
      setAnalysisResult(result);
    } catch (err) {
      console.error("AI Analysis error:", err);
      setErrorMessage(err.message || "Failed to analyze meal image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Log meal to daily tracker
  const handleConfirmLog = () => {
    if (!analysisResult) return;

    const totalProtein = Number(analysisResult.total_protein_g) || 0;
    const totalCal = Number(analysisResult.total_calories) || 0;
    const totalCarb = Number(analysisResult.total_carbs_g) || 0;
    const totalF = Number(analysisResult.total_fat_g) || 0;

    onAddFood({
      id: `ai-${Date.now()}`,
      name: analysisResult.meal_name || "AI Analyzed Meal",
      icon: "📸",
      portionGrams: analysisResult.items?.reduce((sum, item) => sum + (item.portion_g || 0), 0) || 250,
      proteinGrams: Math.round(totalProtein * 10) / 10,
      calories: Math.round(totalCal),
      carbs: Math.round(totalCarb * 10) / 10,
      fat: Math.round(totalF * 10) / 10,
      items: analysisResult.items,
      mealCategory: mealCategory,
      source: "AI Vision",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white">Snap & Track (AI Vision)</h2>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Photo-to-protein visual recognition</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Demo Mode Notice */}
          {(!geminiApiKey || analysisResult?.isDemo) && !useCamera && !isAnalyzing && !analysisResult && (
            <div className="bg-slate-850/80 border border-cyan-500/20 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-slate-300">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-white">AI Photo Vision Ready!</span> You can snap a plate photo right away. To link your own free Google Gemini Vision key, click{" "}
                <button
                  onClick={onOpenSettings}
                  className="text-cyan-400 underline font-semibold hover:text-cyan-300"
                >
                  Settings
                </button>.
              </div>
            </div>
          )}

          {/* Step 1: Camera Feed OR Image Upload Picker */}
          {!imageSrc && !useCamera && (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-slate-700/80 hover:border-cyan-500/50 rounded-3xl p-6 text-center transition-colors bg-slate-850/40">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                  <Camera className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Capture or Upload Your Food</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                  Take a clear photo of your meal on the plate. AI will detect every item and sum up the protein.
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                  <button
                    onClick={startCamera}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
                  >
                    <Camera className="w-4 h-4" /> Open Camera
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
                  >
                    <Upload className="w-4 h-4" /> Upload Photo
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Camera Viewfinder */}
          {useCamera && (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-700">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder crosshairs */}
              <div className="absolute inset-4 border border-white/30 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="text-[10px] uppercase font-bold tracking-widest text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
                  Align plate in center
                </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    stopCamera();
                    setUseCamera(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-semibold backdrop-blur"
                >
                  Cancel
                </button>
                <button
                  onClick={capturePhoto}
                  className="w-14 h-14 rounded-full bg-white border-4 border-cyan-400 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-500"></div>
                </button>
              </div>
            </div>
          )}

          {/* Captured Image & AI Scanning State */}
          {imageSrc && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video max-h-56 flex items-center justify-center">
              <img
                src={imageSrc}
                alt="Captured meal"
                className="w-full h-full object-cover"
              />

              {/* Laser scanning beam animation */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-cyan-500/15 backdrop-blur-[1px] flex flex-col items-center justify-center">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-0 animate-scan"></div>
                  <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
                    <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
                    <div>
                      <div className="text-xs font-bold text-white">AI Vision Analyzing Meal...</div>
                      <div className="text-[10px] text-cyan-300">Estimating portion weights & protein</div>
                    </div>
                  </div>
                </div>
              )}

              {!isAnalyzing && (
                <button
                  onClick={() => {
                    setImageSrc(null);
                    setAnalysisResult(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 text-slate-300 hover:text-white backdrop-blur text-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake
                </button>
              )}
            </div>
          )}

          {/* Step 2: AI Recognition Results */}
          {analysisResult && !isAnalyzing && (
            <div className="space-y-3 animate-fadeIn">
              {/* Main Protein Result Banner */}
              <div className="bg-gradient-to-r from-cyan-950/70 to-emerald-950/70 border border-cyan-500/40 rounded-2xl p-4 text-center">
                <div className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> {analysisResult.meal_name || "Identified Meal"}
                </div>
                <div className="text-4xl font-black text-white mt-1">
                  <span className="text-cyan-300">{analysisResult.total_protein_g}</span>
                  <span className="text-base font-semibold text-emerald-400 ml-1">grams protein</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-300 mt-2">
                  <span>🔥 {Math.round(analysisResult.total_calories || 0)} kcal</span>
                  <span>🌾 {Math.round(analysisResult.total_carbs_g || 0)}g carbs</span>
                  <span>🥑 {Math.round(analysisResult.total_fat_g || 0)}g fat</span>
                </div>
              </div>

              {/* Detected Items Breakdown */}
              <div className="bg-slate-850/60 border border-slate-700/60 rounded-2xl p-3 space-y-2">
                <div className="text-[11px] uppercase font-bold text-slate-400 px-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Utensils className="w-3 h-3 text-cyan-400" /> Detected Plate Items
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Portion & Protein</span>
                </div>

                <div className="space-y-1.5">
                  {analysisResult.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-2.5 flex items-center justify-between text-xs"
                    >
                      <div className="font-semibold text-white">
                        {item.name}
                        <span className="text-[10px] text-slate-400 font-normal ml-2">
                          ({item.portion_g}g portion)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-400">{item.protein_g}g</span>
                        <span className="text-[10px] text-slate-400 ml-1">protein</span>
                      </div>
                    </div>
                  ))}
                </div>

                {analysisResult.nutrition_insights && (
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-700/40">
                    💡 {analysisResult.nutrition_insights}
                  </p>
                )}
              </div>

              {/* Meal Category Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Log As Meal:</label>
                <div className="grid grid-cols-5 gap-1.5 text-xs">
                  {["Breakfast", "Lunch", "Dinner", "Post-Workout", "Snack"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMealCategory(cat)}
                      className={`py-1.5 rounded-xl font-bold truncate px-1 transition-colors ${
                        mealCategory === cat
                          ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-750"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {analysisResult && !isAnalyzing && (
          <div className="p-4 border-t border-slate-800 bg-slate-850 flex gap-3">
            <button
              onClick={() => {
                setImageSrc(null);
                setAnalysisResult(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Retake
            </button>
            <button
              onClick={handleConfirmLog}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" /> Add {analysisResult.total_protein_g}g Protein to Diary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
