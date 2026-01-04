
import React, { useState } from 'react';
import { generateGlassyImage } from '../../services/gemini';

interface AuraGenProps {
  setWallpaper: (url: string) => void;
}

const AuraGen: React.FC<AuraGenProps> = ({ setWallpaper }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const url = await generateGlassyImage(prompt);
      setHistory(prev => [url, ...prev].slice(0, 5));
    } catch (err) {
      setError("Failed to generate image. Please check your API configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-light mb-2">Aura Generator</h2>
        <p className="text-white/60 text-sm">Design your next glassy experience with AI.</p>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Neon purple ocean clouds..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-blue-500 transition-colors placeholder:text-white/30"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-medium hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            <i className="fa-solid fa-circle-notch animate-spin"></i>
          ) : (
            'Generate'
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-xs">
          {error}
        </div>
      )}

      <div className="flex-1">
        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Recent Generations</h3>
        <div className="grid grid-cols-2 gap-4">
          {history.length === 0 && !loading && (
            <div className="col-span-2 border-2 border-dashed border-white/5 rounded-xl h-40 flex flex-col items-center justify-center text-white/20">
              <i className="fa-solid fa-wand-magic-sparkles text-3xl mb-2"></i>
              <span className="text-sm">Your creations will appear here</span>
            </div>
          )}
          {loading && (
             <div className="col-span-1 rounded-xl h-40 bg-white/5 animate-pulse flex items-center justify-center">
                <i className="fa-solid fa-spinner animate-spin text-white/20 text-2xl"></i>
             </div>
          )}
          {history.map((url, idx) => (
            <div key={idx} className="group relative rounded-xl overflow-hidden border border-white/10 aspect-video">
              <img src={url} alt="Generated" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => setWallpaper(url)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Apply as Wallpaper"
                >
                  <i className="fa-solid fa-desktop"></i>
                </button>
                <a 
                  href={url} 
                  download="aura-wallpaper.png"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Download"
                >
                  <i className="fa-solid fa-download"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuraGen;
