import { useState } from "react";
import { Sparkles, Download, Loader2, ImageIcon, Plus } from "lucide-react";
import axios from "axios";

const BACKEND_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const API = `${BACKEND_BASE_URL}/api`;

const urlToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result !== "string") {
          resolve(null);
          return;
        }
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to base64:", error);
    return null;
  }
};

export default function Canvas({ filters, referenceImage, venueImage, onAddToMoodboard }) {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedVariants, setGeneratedVariants] = useState([]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [highQualityMode, setHighQualityMode] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceImage, setServiceImage] = useState(null);
  const [showServiceView, setShowServiceView] = useState(false);
  const [error, setError] = useState(null);

  const currentImage = showServiceView && serviceImage ? serviceImage : (generatedVariants[selectedVariantIndex] || generatedImage);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setProgressText("");
    setError(null);
    setGeneratedImage(null);
    setGeneratedVariants([]);
    setSelectedVariantIndex(0);

    try {
      let fullPrompt = prompt.trim();

      let venueImageBase64 = null;
      if (venueImage?.data) {
        venueImageBase64 = venueImage.data;
      } else if (venueImage?.preview) {
        venueImageBase64 = await urlToBase64(venueImage.preview);
      } else if (typeof venueImage === "string") {
        venueImageBase64 = await urlToBase64(venueImage);
      }

      let designImageBase64 = null;
      if (referenceImage?.data) {
        designImageBase64 = referenceImage.data;
      } else if (referenceImage?.thumbnailUrl) {
        designImageBase64 = await urlToBase64(referenceImage.thumbnailUrl);
      } else if (referenceImage?.preview) {
        designImageBase64 = await urlToBase64(referenceImage.preview);
      }

      const designImageUrl = referenceImage?.thumbnailUrl || referenceImage?.preview || null;
      const venueImageUrl = venueImage?.preview || (typeof venueImage === "string" ? venueImage : null);
      const hasVenueInput = !!venueImageBase64 || !!venueImageUrl;
      const hasDesignInput = !!designImageBase64 || !!designImageUrl;

      if (!hasVenueInput) {
        setError("Space reference missing. Please upload a space reference image first.");
        setIsGenerating(false);
        return;
      }

      if (!hasDesignInput) {
        setError("Design reference missing. Please upload/select a reference image.");
        setIsGenerating(false);
        return;
      }

      const targetVariants = highQualityMode ? 3 : 1;
      setProgressText(targetVariants > 1 ? "Generating 3 options in one pass..." : "Generating your design...");

      const payload = {
        prompt: fullPrompt,
        function_type: filters.function_type || null,
        space: null,
        venue_image: venueImageBase64,
        design_image: designImageBase64,
        venue_image_url: venueImageUrl,
        design_image_url: designImageUrl,
        reference_image: referenceImage?.data || null,
        high_quality: highQualityMode,
        variant_count: targetVariants,
      };

      const res = await axios.post(`${API}/generate`, payload);
      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to generate image");
      }

      const variants = Array.isArray(res.data.variants)
        ? res.data.variants
            .map((item) => (item && typeof item === "object" ? item.image_data : null))
            .filter(Boolean)
        : [];

      const collected = variants.length > 0 ? variants : res.data.image_data ? [res.data.image_data] : [];
      if (collected.length === 0) {
        throw new Error("No image returned from generation");
      }

      setGeneratedVariants(collected.slice(0, targetVariants));
      setSelectedVariantIndex(0);
      setGeneratedImage(collected[0]);

      // If Services is enabled, request a second image by appending the service-mode brief
      if (selectedService) {
        try {
          setProgressText("Generating services overlay...");

          const servicesAppendText = `The same event venue is now in full service mode, inspired by the luxury hospitality standards of Fairmont Hotels. Add the following service elements to the existing decor scene:

- Professional waiters in crisp white shirts, black waistcoats, and bow ties moving between elegantly decorated tables carrying silver service trays
- White-gloved butler staff presenting plated fine dining dishes to seated guests
- A polished champagne and cocktail service station with a uniformed bartender arranging crystal glasses
- Neatly dressed catering staff in the background managing food stations with silver chafing dishes and floral garnishes
- Soft warm candlelight and chandeliers reflecting off polished silverware and white linen tablecloths
- Guests in formal evening wear being attended to at their seats
- The entire original event decor — floral arrangements, lighting, stage, color theme — remains fully visible and unchanged in the background

Style: Luxury event photography, photorealistic, 4K, warm golden ambient lighting, shot from a wide angle to capture both the decor and the full service experience. Inspired by the grandeur and white-glove service aesthetic of Fairmont Mumbai.`;

          const servicePrompt = `${fullPrompt}\n\n${servicesAppendText}`;

          const servicePayload = {
            prompt: servicePrompt,
            function_type: filters.function_type || null,
            space: null,
            // Use the generated image as venue input to preserve original decor composition
            venue_image: collected[0],
            design_image: designImageBase64 || null,
            venue_image_url: null,
            design_image_url: designImageUrl,
            reference_image: referenceImage?.data || null,
            high_quality: false,
            variant_count: 1,
          };

          const svcRes = await axios.post(`${API}/generate`, servicePayload);
          if (svcRes.data && svcRes.data.success) {
            const svcImg = svcRes.data.image_data || (Array.isArray(svcRes.data.variants) && svcRes.data.variants[0] && svcRes.data.variants[0].image_data) || null;
            if (svcImg) {
              setServiceImage(svcImg);
              setShowServiceView(true);
            }
          }
        } catch (svcErr) {
          console.warn("Service overlay generation failed:", svcErr?.message || svcErr);
        } finally {
          setProgressText("");
        }
      }
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Something went wrong");
    } finally {
      setIsGenerating(false);
      setProgressText("");
    }
  };

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${currentImage}`;
    link.download = `design-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isGenerating) {
      handleGenerate();
    }
  };

  return (
    <div className="h-full flex flex-col gap-4" data-testid="studio-canvas">
      <div className="relative flex items-center w-full" data-testid="prompt-bar">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your dream venue design..."
          className="glass-input w-full rounded-full pl-6 pr-36 py-4 text-sm md:text-base"
          style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          disabled={isGenerating}
          data-testid="prompt-input"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="absolute right-2 glass-button rounded-full px-5 py-2.5 flex items-center gap-2 text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
          data-testid="generate-button"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> : <Sparkles className="w-4 h-4" strokeWidth={1.5} />}
          {isGenerating ? "Generating" : "Generate"}
        </button>
      </div>

      <div className="flex items-center gap-2 px-1">
        <button
          onClick={() => setHighQualityMode((prev) => !prev)}
          disabled={isGenerating}
          className={`glass-button rounded-full px-3 py-1 text-xs uppercase tracking-wider ${highQualityMode ? "glass-pill-active" : ""}`}
          data-testid="toggle-high-quality"
        >
          {highQualityMode ? "High Quality x3" : "Standard x1"}
        </button>

        {/* Services selector button */}
        <div className="relative">
          <button
            onClick={() => setSelectedService((prev) => (prev ? null : "Services"))}
            disabled={isGenerating}
            className={`glass-button rounded-full px-3 py-1 text-xs uppercase tracking-wider ${selectedService ? "glass-pill-active" : ""}`}
            data-testid="toggle-services"
          >
            Services
          </button>
        </div>
      </div>

      {(filters.function_type || referenceImage || venueImage || selectedService) && (
        <div className="flex items-center gap-2 flex-wrap px-1">
          <span className="text-white/40 text-xs" style={{ fontFamily: "var(--font-body)" }}>
            Active:
          </span>
          {filters.function_type && <span className="glass-pill-active rounded-full px-3 py-1 text-xs">{filters.function_type}</span>}
          {venueImage && (
            <span className="glass-pill-active rounded-full px-3 py-1 text-xs flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.5} /> Space Ref
            </span>
          )}
          {referenceImage && (
            <span className="glass-pill-active rounded-full px-3 py-1 text-xs flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.5} /> Design Ref
            </span>
          )}
          {selectedService && (
            <span className="glass-pill-active rounded-full px-3 py-1 text-xs">{selectedService}</span>
          )}
        </div>
      )}

      <div className="flex-1 glass-panel rounded-2xl relative flex items-center justify-center overflow-hidden" data-testid="main-canvas">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white/70 animate-spin" strokeWidth={1} />
            </div>
            <p className="text-white/50 text-sm tracking-wide" style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
              {progressText || "Creating your vision..."}
            </p>
            <div className="w-48 h-1 rounded-full overflow-hidden bg-white/10">
              <div className="h-full shimmer-loading rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
        ) : currentImage ? (
          <>
            <img
              src={`data:image/png;base64,${currentImage}`}
              alt="Generated venue design"
              className="max-w-full max-h-full object-contain rounded-lg"
              data-testid="generated-image"
            />

            {generatedVariants.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2" data-testid="variant-strip">
                {generatedVariants.map((variant, idx) => (
                  <button
                    key={`variant-${idx}`}
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      setGeneratedImage(variant);
                    }}
                    className={`rounded-xl overflow-hidden border ${selectedVariantIndex === idx ? "border-white/60" : "border-white/20"}`}
                    title={`Option ${idx + 1}`}
                    data-testid={`variant-option-${idx + 1}`}
                  >
                    <img
                      src={`data:image/png;base64,${variant}`}
                      alt={`Generated option ${idx + 1}`}
                      className="w-16 h-12 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button
                onClick={() => {
                  if (onAddToMoodboard && currentImage) {
                    onAddToMoodboard(currentImage, prompt);
                  }
                }}
                className="glass-button rounded-full px-4 py-3 flex items-center gap-2 text-sm uppercase tracking-wider"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
                data-testid="add-to-moodboard"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                Add
              </button>
              {serviceImage && (
                <button
                  onClick={() => setShowServiceView((v) => !v)}
                  className="glass-button rounded-full px-4 py-3 flex items-center gap-2 text-sm uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
                  data-testid="toggle-service-view"
                >
                  {showServiceView ? "Main View" : "Services View"}
                </button>
              )}
              <button
                onClick={handleDownload}
                className="glass-button rounded-full px-6 py-3 flex items-center gap-2 text-sm uppercase tracking-wider"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
                data-testid="download-image"
              >
                <Download className="w-4 h-4" strokeWidth={1.5} />
                Download
              </button>
            </div>
          </>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 px-8 text-center">
            <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white/40" strokeWidth={1} />
            </div>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              {error}
            </p>
            <button
              onClick={handleGenerate}
              className="glass-button rounded-full px-5 py-2 text-xs uppercase tracking-wider mt-2"
              data-testid="retry-generate"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 px-8 text-center">
            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white/30" strokeWidth={1} />
            </div>
            <p className="text-white/40 text-sm tracking-wide" style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
              Describe your dream venue and hit Generate
            </p>
            <p className="text-white/25 text-xs" style={{ fontFamily: "var(--font-body)" }}>
              Select filters on the left for more targeted designs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
