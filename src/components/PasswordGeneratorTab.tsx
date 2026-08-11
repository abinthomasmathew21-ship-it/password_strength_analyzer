import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, KeyRound, Sparkles, Sliders } from 'lucide-react';
import { GeneratorConfig } from '../types';
import { PASSPHRASE_WORDS } from '../data/commonPasswords';
import { analyzePassword } from '../utils/passwordAnalyzer';

interface PasswordGeneratorTabProps {
  onApplyGenerated: (password: string) => void;
}

export const PasswordGeneratorTab: React.FC<PasswordGeneratorTabProps> = ({ onApplyGenerated }) => {
  const [config, setConfig] = useState<GeneratorConfig>({
    length: 16,
    useUppercase: true,
    useLowercase: true,
    useNumbers: true,
    useSymbols: true,
    mode: 'random',
    wordCount: 4,
    includeNumberInPassphrase: true,
    separator: '-',
  });

  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (config.mode === 'passphrase') {
      const words: string[] = [];
      for (let i = 0; i < config.wordCount; i++) {
        const randIndex = Math.floor(Math.random() * PASSPHRASE_WORDS.length);
        let word = PASSPHRASE_WORDS[randIndex];
        // Capitalize first letter
        word = word.charAt(0).toUpperCase() + word.slice(1);
        words.push(word);
      }
      if (config.includeNumberInPassphrase) {
        const num = Math.floor(10 + Math.random() * 89);
        words.push(num.toString());
      }
      setGenerated(words.join(config.separator));
    } else {
      let charPool = '';
      if (config.useLowercase) charPool += 'abcdefghijklmnopqrstuvwxyz';
      if (config.useUppercase) charPool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (config.useNumbers) charPool += '0123456789';
      if (config.useSymbols) charPool += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (!charPool) charPool = 'abcdefghijklmnopqrstuvwxyz';

      let result = '';
      // Ensure at least one from each selected category
      if (config.useLowercase) result += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
      if (config.useUppercase) result += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
      if (config.useNumbers) result += '0123456789'[Math.floor(Math.random() * 10)];
      if (config.useSymbols) result += '!@#$%^&*()_+-='[Math.floor(Math.random() * 13)];

      while (result.length < config.length) {
        result += charPool[Math.floor(Math.random() * charPool.length)];
      }

      // Shuffle result string
      const array = result.split('');
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }

      setGenerated(array.join(''));
    }
  };

  useEffect(() => {
    generate();
  }, [config]);

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const metrics = analyzePassword(generated);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-4xl mx-auto mb-6">
      <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Cryptographic Password Generator</h2>
          <p className="text-xs text-slate-500">Create high-entropy random passwords or memorable Diceware passphrases</p>
        </div>
      </div>

      {/* Generated Result Output Box */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl mb-6 relative shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Generated Output
          </span>
          <span className="text-xs font-semibold text-emerald-400 font-mono">
            {metrics.strengthLabel} ({metrics.entropyBits} bits)
          </span>
        </div>

        <p className="font-mono text-base sm:text-lg font-bold break-all select-all pr-24 py-1 text-emerald-300">
          {generated}
        </p>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          <button
            onClick={generate}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
            title="Generate new"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
            title="Copy password"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Generator Mode Selector */}
      <div className="flex items-center bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
        <button
          onClick={() => setConfig({ ...config, mode: 'random' })}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            config.mode === 'random' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Random Complex String
        </button>
        <button
          onClick={() => setConfig({ ...config, mode: 'passphrase' })}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            config.mode === 'passphrase' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Memorable Passphrase (Diceware)
        </button>
      </div>

      {/* Options Controls */}
      {config.mode === 'random' ? (
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Password Length</span>
              <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {config.length} characters
              </span>
            </div>
            <input
              type="range"
              min={8}
              max={64}
              value={config.length}
              onChange={(e) => setConfig({ ...config, length: Number(e.target.value) })}
              className="w-full accent-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="flex items-center space-x-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={config.useUppercase}
                onChange={(e) => setConfig({ ...config, useUppercase: e.target.checked })}
                className="w-4 h-4 accent-slate-900 rounded"
              />
              <span className="text-xs font-semibold text-slate-800">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center space-x-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={config.useLowercase}
                onChange={(e) => setConfig({ ...config, useLowercase: e.target.checked })}
                className="w-4 h-4 accent-slate-900 rounded"
              />
              <span className="text-xs font-semibold text-slate-800">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center space-x-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={config.useNumbers}
                onChange={(e) => setConfig({ ...config, useNumbers: e.target.checked })}
                className="w-4 h-4 accent-slate-900 rounded"
              />
              <span className="text-xs font-semibold text-slate-800">Numbers (0-9)</span>
            </label>

            <label className="flex items-center space-x-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={config.useSymbols}
                onChange={(e) => setConfig({ ...config, useSymbols: e.target.checked })}
                className="w-4 h-4 accent-slate-900 rounded"
              />
              <span className="text-xs font-semibold text-slate-800">Symbols (!@#$)</span>
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Word Count</span>
              <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {config.wordCount} words
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={8}
              value={config.wordCount}
              onChange={(e) => setConfig({ ...config, wordCount: Number(e.target.value) })}
              className="w-full accent-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Word Separator
              </label>
              <select
                value={config.separator}
                onChange={(e) => setConfig({ ...config, separator: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              >
                <option value="-">Hyphen (-)</option>
                <option value="_">Underscore (_)</option>
                <option value=".">Dot (.)</option>
                <option value=" ">Space ( )</option>
                <option value="#">Hash (#)</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-2.5 p-3 w-full bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={config.includeNumberInPassphrase}
                  onChange={(e) => setConfig({ ...config, includeNumberInPassphrase: e.target.checked })}
                  className="w-4 h-4 accent-slate-900 rounded"
                />
                <span className="text-xs font-semibold text-slate-800">Include Random Number</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={generate}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Regenerate</span>
        </button>

        <button
          onClick={() => onApplyGenerated(generated)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Send to Analyzer</span>
        </button>
      </div>
    </div>
  );
};
