import React, { useState } from 'react';
import { Sparkles, Loader2, ShieldAlert, Award, BookOpen, Check, Copy } from 'lucide-react';
import { AiAnalysisResult } from '../types';

interface AiSecurityAnalystProps {
  password: string;
  onApplyAlternative: (alt: string) => void;
}

export const AiSecurityAnalyst: React.FC<AiSecurityAnalystProps> = ({ password, onApplyAlternative }) => {
  const [contextHint, setContextHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!password) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          contextualHints: contextHint,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to reach AI security analysis service');
      }

      const data: AiAnalysisResult = await res.json();
      setAiResult(data);
    } catch (err: any) {
      setError(err?.message || 'An error occurred during AI analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAlt = (alt: string, index: number) => {
    navigator.clipboard.writeText(alt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">AI Security Audit & Deep Pattern Recognition</h2>
            <p className="text-xs text-slate-500">Gemini-powered cryptographic analysis & context vulnerability detection</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Contextual Hints (Optional)
          </label>
          <input
            type="text"
            value={contextHint}
            onChange={(e) => setContextHint(e.target.value)}
            placeholder="e.g. My name is Alex, work password for Acme Corp..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !password}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Password Intelligence...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Run AI Security Audit</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
          ⚠️ {error}
        </div>
      )}

      {aiResult && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-fadeIn">
          {aiResult.available === false ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
              ℹ️ {aiResult.message}
            </div>
          ) : (
            <>
              {/* Executive Summary Header */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Audit Summary
                  </span>
                  <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                    {aiResult.summary}
                  </p>
                </div>

                {aiResult.grade && (
                  <div className="flex flex-col items-center shrink-0 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Grade</span>
                    <span className="text-xl font-extrabold text-slate-900 font-mono">{aiResult.grade}</span>
                  </div>
                )}
              </div>

              {/* Vulnerabilities */}
              {aiResult.vulnerabilities && aiResult.vulnerabilities.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Identified Vulnerabilities</span>
                  </h3>
                  <div className="space-y-1.5">
                    {aiResult.vulnerabilities.map((vuln, i) => (
                      <div key={i} className="p-2.5 bg-rose-50/70 border border-rose-200/80 rounded-lg text-xs text-rose-950 font-medium flex items-center space-x-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{vuln}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Educational Insight */}
              {aiResult.educationalInsight && (
                <div className="p-3.5 bg-indigo-50/60 border border-indigo-200/80 rounded-xl text-xs text-indigo-950">
                  <div className="flex items-center space-x-1.5 font-bold text-indigo-900 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Cryptographic Concept Insight</span>
                  </div>
                  <p className="text-xs leading-relaxed">{aiResult.educationalInsight}</p>
                </div>
              )}

              {/* AI Smart Alternatives */}
              {aiResult.smartAlternatives && aiResult.smartAlternatives.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    AI Recommended Alternatives
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {aiResult.smartAlternatives.map((alt, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between font-mono text-xs font-bold">
                        <span className="truncate mr-2">{alt}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onApplyAlternative(alt)}
                            className="px-2 py-1 bg-slate-900 text-white text-[10px] font-semibold rounded hover:bg-slate-800"
                          >
                            Apply
                          </button>
                          <button
                            onClick={() => handleCopyAlt(alt, i)}
                            className="p-1 bg-white border border-slate-200 text-slate-600 rounded hover:bg-slate-100"
                          >
                            {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
