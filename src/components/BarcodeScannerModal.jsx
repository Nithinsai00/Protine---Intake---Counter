import React, { useState, useEffect, useRef } from "react";
import { X, Barcode, Search, Check, AlertCircle, Loader2, Camera, Scale } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { lookupBarcodeOnline } from "../services/barcodeApi";

export default function BarcodeScannerModal({ isOpen, onClose, onAddFood }) {
  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [portionGrams, setPortionGrams] = useState(100);
  const [mealCategory, setMealCategory] = useState("Snack");
  const [errorMessage, setErrorMessage] = useState("");

  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setManualCode("");
      setScannedProduct(null);
      setErrorMessage("");
      setPortionGrams(100);
      setScanning(false);
    } else {
      stopCameraScanner();
    }
  }, [isOpen]);

  const stopCameraScanner = async () => {
    if (scannerInstanceRef.current) {
      try {
        await scannerInstanceRef.current.stop();
      } catch (err) {
        // Ignore if already stopped
      }
      scannerInstanceRef.current = null;
      setScanning(false);
    }
  };

  const startCameraScanner = async () => {
    setErrorMessage("");
    setScanning(true);
    setScannedProduct(null);

    // Short delay to ensure container element is mounted
    setTimeout(async () => {
      try {
        const scannerId = "barcode-reader-box";
        const html5QrCode = new Html5Qrcode(scannerId);
        scannerInstanceRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 160 },
          aspectRatio: 1.5
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            // Barcode scanned successfully
            stopCameraScanner();
            fetchBarcodeData(decodedText);
          },
          () => {
            // Scanning in progress...
          }
        );
      } catch (err) {
        console.warn("Scanner initialization error:", err);
        setErrorMessage("Camera access denied or unavailable. You can enter the barcode numbers below.");
        setScanning(false);
      }
    }, 150);
  };

  const fetchBarcodeData = async (barcode) => {
    if (!barcode) return;
    setLoading(true);
    setErrorMessage("");

    try {
      const product = await lookupBarcodeOnline(barcode);
      setScannedProduct(product);
      setPortionGrams(product.defaultServingGrams || 100);
    } catch (err) {
      console.error("Barcode lookup failed:", err);
      setErrorMessage(err.message || "Product not found. Try searching by food name instead.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    fetchBarcodeData(manualCode.trim());
  };

  // Dynamic protein calculation
  const factor = portionGrams / 100;
  const computedProtein = scannedProduct ? Math.round((scannedProduct.proteinPer100g * factor) * 10) / 10 : 0;
  const computedCalories = scannedProduct ? Math.round(scannedProduct.caloriesPer100g * factor) : 0;
  const computedCarbs = scannedProduct ? Math.round((scannedProduct.carbsPer100g * factor) * 10) / 10 : 0;
  const computedFat = scannedProduct ? Math.round((scannedProduct.fatPer100g * factor) * 10) / 10 : 0;

  const handleConfirmLog = () => {
    if (!scannedProduct) return;

    onAddFood({
      id: `barcode-log-${Date.now()}`,
      name: scannedProduct.name,
      icon: "🏷️",
      portionGrams: Number(portionGrams),
      proteinGrams: computedProtein,
      calories: computedCalories,
      carbs: computedCarbs,
      fat: computedFat,
      mealCategory: mealCategory,
      source: "Barcode Scan",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Barcode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Barcode Scanner</h2>
              <p className="text-[11px] text-slate-400">Scan packaged food to fetch protein</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCameraScanner();
              onClose();
            }}
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

          {/* Camera Scanner Viewfinder Box */}
          {scanning && (
            <div className="space-y-3">
              <div 
                id="barcode-reader-box" 
                className="w-full rounded-2xl overflow-hidden border-2 border-purple-500/50 bg-black min-h-[220px]"
              />
              <button
                onClick={stopCameraScanner}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-colors"
              >
                Stop Camera
              </button>
            </div>
          )}

          {/* Scanner Controls when not scanning & no product yet */}
          {!scanning && !scannedProduct && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-700/80 rounded-3xl p-6 text-center bg-slate-850/40">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                  <Camera className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Scan Product Barcode</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                  Hold food package barcode up to your camera for instant nutritional lookup.
                </p>
                <button
                  onClick={startCameraScanner}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all inline-flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Start Barcode Camera
                </button>
              </div>

              {/* Manual Barcode Entry Fallback */}
              <div className="bg-slate-850/60 border border-slate-800 rounded-2xl p-4">
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Or Enter Barcode Number:
                </label>
                <form onSubmit={handleManualSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="e.g. 3017620422003, 042222329484..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    type="submit"
                    disabled={loading || !manualCode.trim()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    Lookup
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="py-8 text-center text-slate-400">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold">Looking up product nutrition from database...</p>
            </div>
          )}

          {/* Scanned Product Result */}
          {scannedProduct && !loading && (
            <div className="space-y-4 animate-fadeIn">
              {/* Product Info Card */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex items-center gap-3">
                {scannedProduct.imageUrl ? (
                  <img
                    src={scannedProduct.imageUrl}
                    alt={scannedProduct.name}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-slate-700 flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl flex-shrink-0">
                    🏷️
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-2">{scannedProduct.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Base: {scannedProduct.proteinPer100g}g protein / 100g
                  </p>
                </div>
              </div>

              {/* Dynamic Protein Highlight */}
              <div className="bg-gradient-to-r from-purple-950/60 to-cyan-950/60 border border-purple-500/40 rounded-2xl p-4 text-center">
                <span className="text-[11px] uppercase font-bold text-purple-400 tracking-wider">
                  Calculated Protein
                </span>
                <div className="text-4xl font-black text-white mt-1">
                  <span className="text-purple-300">{computedProtein}</span>
                  <span className="text-base font-semibold text-emerald-400 ml-1">grams</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-300 mt-2">
                  <span>🔥 {computedCalories} kcal</span>
                  <span>🌾 {computedCarbs}g carbs</span>
                  <span>🥑 {computedFat}g fat</span>
                </div>
              </div>

              {/* Portion Slider */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-purple-400" /> Serving Weight:
                  </label>
                  <div className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      value={portionGrams}
                      onChange={(e) => setPortionGrams(Math.max(1, Number(e.target.value) || 0))}
                      className="w-16 bg-transparent text-right font-black text-white focus:outline-none"
                    />
                    <span className="text-xs font-bold text-slate-400">grams</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="10"
                  max="400"
                  step="5"
                  value={portionGrams}
                  onChange={(e) => setPortionGrams(Number(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[30, 50, 100, 150, 200].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPortionGrams(preset)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                        portionGrams === preset
                          ? "bg-purple-500 text-white shadow"
                          : "bg-slate-700/60 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {preset}g
                    </button>
                  ))}
                  {scannedProduct.defaultServingGrams && (
                    <button
                      type="button"
                      onClick={() => setPortionGrams(scannedProduct.defaultServingGrams)}
                      className="text-xs px-2.5 py-1 rounded-lg font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    >
                      Standard Package Serving ({scannedProduct.defaultServingGrams}g)
                    </button>
                  )}
                </div>
              </div>

              {/* Meal Category */}
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
                          ? "bg-purple-500 text-white font-black shadow-md shadow-purple-500/20"
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
        {scannedProduct && (
          <div className="p-4 border-t border-slate-800 bg-slate-850 flex gap-3">
            <button
              onClick={() => {
                setScannedProduct(null);
                setManualCode("");
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Scan Another
            </button>
            <button
              onClick={handleConfirmLog}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:brightness-110 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" /> Add {computedProtein}g Protein to Diary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
