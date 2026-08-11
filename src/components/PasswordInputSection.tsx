import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, RefreshCw, AlertTriangle, Shield, Sparkles } from 'lucide-react';
import { PasswordMetrics } from '../types';

interface PasswordInputSectionProps {
  password: string;
  setPassword: (val: string) => void;
  metrics: PasswordMetrics;
  isReused: boolean;
  onSaveToVault: () => void;
  onGenerateQuick: () => void;
}

export const PasswordInputSection: React.FC<PasswordInputSectionProps> = ({
  password,
  setPassword,
  metrics,
  isReused,
  onSaveToVault,
  onGenerateQuick,
}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine meter color based on strength
  const getStrengthColor = () => {
    if (metrics.length === 0) return 'bg-slate-200';
    switch (metrics.strengthLabel) {
      case 'Very Strong':
        return 'bg-emerald-500';
      case 'Strong':
        return 'bg-teal-500';
      case 'Fair':
        return 'bg-amber-500';
      case 'Weak':
        return 'bg-orange-500';
      case 'Too Weak':
      default:
        return 'bg-rose-500';
    }
  };

  const getBadgeStyle = () => {
    if (metrics.length === 0) return 'bg-slate-100 text-slate-600 border-slate-200';
    switch (metrics.strengthLabel) {
      case 'Very Strong':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      case 'Strong':
        return 'bg-teal-50 text-teal-800 border-teal-300 font-semibold';
      case 'Fair':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
      case 'Weak':
        return 'bg-orange-50 text-orange-800 border-orange-300 font-semibold';
      case 'Too Weak':
      default:
        return 'bg-rose-50 text-rose-800 border-rose-300 font-semibold';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <label htmlFor="password-input" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
          <span>Password</span>
          <span className="text-xs font-normal text-slate-500">(Evaluated in real-time)</span>
        </label>

        <div className="flex items-center gap-2">
          {password.length > 0 && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${getBadgeStyle()}`}>
              {metrics.strengthLabel} ({metrics.score}/100)
            </span>
          )}
          {metrics.entropyBits > 0 && (
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 font-mono">
              ~{metrics.entropyBits} bits entropy
            </span>
          )}
        </div>
      </div>

      {/* Main Password Input Box */}
      <div className="relative mb-3">
        <input
          id="password-input"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type or paste a password (e.g. hello)..."
          className="w-full pl-4 pr-32 py-3.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base font-mono transition-all"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {password && (
            <button
              onClick={() => setPassword('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 text-xs font-medium transition-colors"
              title="Clear text"
            >
              Clear
            </button>
          )}

          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            onClick={handleCopy}
            disabled={!password}
            className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-40 rounded-lg hover:bg-slate-200/60 transition-colors"
            title="Copy password"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Reused Password Alert Banner */}
      {isReused && (
        <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-800 text-xs font-medium">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>❌ <strong>Reuse Guard:</strong> This password matches a previously saved hash in your vault! Reuse is strongly discouraged.</span>
          </div>
        </div>
      )}

      {/* Strength Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>Entropy / Strength Meter</span>
          <span>{metrics.score}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${Math.max(password.length > 0 ? 5 : 0, metrics.score)}%` }}
          />
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          onClick={onGenerateQuick}
          className="inline-flex items-center space-x-1.5 text-slate-700 hover:text-slate-900 font-medium px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 rounded-lg border border-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
          <span>Generate Secure Alternative</span>
        </button>

        {password.length > 0 && (
          <button
            onClick={onSaveToVault}
            className="inline-flex items-center space-x-1.5 text-slate-700 hover:text-slate-900 font-medium px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 rounded-lg border border-slate-200 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Log Hash to Reuse Guard Vault</span>
          </button>
        )}
      </div>
    </div>
  );
};
