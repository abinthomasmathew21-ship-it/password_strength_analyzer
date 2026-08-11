import React from 'react';
import { ShieldCheck, KeyRound, History, BookOpen, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'analyzer' | 'generator' | 'reuse' | 'education';
  setActiveTab: (tab: 'analyzer' | 'generator' | 'reuse' | 'education') => void;
  reuseCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, reuseCount }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-slate-900/10">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Password Strength Analyzer</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Client-Side Safe
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Cryptographic security inspection, entropy calculation, reuse history, and AI advice
              </p>
            </div>
          </div>

          <nav className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200/80">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'generator'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Generator</span>
            </button>

            <button
              onClick={() => setActiveTab('reuse')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'reuse'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-600" />
              <span>Reuse Vault</span>
              {reuseCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px] font-bold">
                  {reuseCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'education'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Crypto Lab</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
