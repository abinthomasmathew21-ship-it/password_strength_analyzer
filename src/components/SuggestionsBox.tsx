import React, { useState } from 'react';
import { Lightbulb, ArrowRight, Copy, Check, Sparkles, KeyRound } from 'lucide-react';
import { PasswordMetrics } from '../types';

interface SuggestionsBoxProps {
  metrics: PasswordMetrics;
  onApplyAlternative: (alt: string) => void;
}

export const SuggestionsBox: React.FC<SuggestionsBoxProps> = ({ metrics, onApplyAlternative }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyAlt = (alt: string, index: number) => {
    navigator.clipboard.writeText(alt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-6">
      <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Security Guidance & Suggestions</h2>
          <p className="text-xs text-slate-500">Actionable steps to strengthen this password</p>
        </div>
      </div>

      {/* Primary Action Suggestions List */}
      <div className="space-y-2 mb-6">
        {metrics.suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start space-x-2.5 text-xs text-slate-800"
          >
            <span className="text-amber-600 font-bold text-sm leading-none shrink-0">•</span>
            <span className="font-medium leading-relaxed">{suggestion}</span>
          </div>
        ))}
      </div>

      {/* Generated Alternatives */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Stronger Password Alternatives</span>
          </span>
          <span className="text-[11px] text-slate-500">Click to test instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {metrics.smartAlternatives.map((alt, index) => (
            <div
              key={index}
              className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  {index === 0 ? 'Memorable Passphrase' : index === 1 ? 'Hybrid Complex' : 'Cryptographic Random'}
                </span>
                <p className="font-mono text-xs font-bold text-slate-900 break-all select-all mb-3">
                  {alt}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                <button
                  onClick={() => onApplyAlternative(alt)}
                  className="flex-1 inline-flex items-center justify-center space-x-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => handleCopyAlt(alt, index)}
                  className="p-1.5 bg-white hover:bg-slate-200/80 text-slate-700 rounded-lg border border-slate-200 text-xs transition-colors"
                  title="Copy password"
                >
                  {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
