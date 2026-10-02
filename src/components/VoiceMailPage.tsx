import { useState } from 'react';
import { Mic, Send, Sparkles, Trash2 } from 'lucide-react';

export const VoiceMailPage = () => {
  const [voiceText, setVoiceText] = useState('');
  const [result, setResult] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    if (!voiceText.trim()) return;
    setProcessing(true);
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1200));
    setResult(`[Processed Voice Mail]\n\nSubject: Voice Note – ${new Date().toLocaleDateString()}\n\n${voiceText}`);
    setProcessing(false);
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8 gap-6 overflow-y-auto">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-pink-500/20 border border-pink-500/30">
          <Mic size={24} className="text-pink-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Voice Mail Composer</h2>
          <p className="text-xs text-slate-400">Convert voice notes to structured email drafts</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Voice / Text Input</label>
        <textarea
          rows={5}
          value={voiceText}
          onChange={(e) => setVoiceText(e.target.value)}
          placeholder="Paste your voice-to-text transcription here, or type your raw message..."
          className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-pink-500/50"
        />
        <div className="flex gap-2">
          <button
            onClick={handleProcess}
            disabled={processing || !voiceText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold rounded-xl shadow-lg disabled:opacity-50"
          >
            {processing ? <Sparkles size={14} className="animate-spin" /> : <Send size={14} />}
            {processing ? 'Processing...' : 'Convert to Mail'}
          </button>
          <button
            onClick={() => { setVoiceText(''); setResult(''); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-slate-400 text-xs font-semibold rounded-xl border border-slate-700"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      {result && (
        <div className="p-5 bg-slate-900/80 border border-emerald-500/30 rounded-2xl space-y-2">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Generated Mail Draft</div>
          <pre className="text-sm text-slate-200 whitespace-pre-wrap font-mono leading-relaxed">{result}</pre>
        </div>
      )}
    </div>
  );
};
