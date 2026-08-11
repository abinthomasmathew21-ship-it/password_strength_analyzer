import React, { useState, useEffect } from 'react';
import { BookOpen, Calculator, Lock, Database, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import { hashPasswordSha256, hashPasswordSha1, generateSaltedHash } from '../utils/cryptoUtils';

export const CryptoEducationLab: React.FC = () => {
  // Entropy Calculator Demo state
  const [calcLength, setCalcLength] = useState(12);
  const [calcCharset, setCalcCharset] = useState(94); // 26 + 26 + 10 + 32
  const calcEntropy = Math.round(calcLength * Math.log2(calcCharset) * 10) / 10;
  const combinationsExp = Math.round(calcEntropy);

  // Hash & Salt Demo state
  const [demoInput, setDemoInput] = useState('SecretPass123!');
  const [demoSalt, setDemoSalt] = useState('8f3a91b2c4e5');
  const [unsaltedHash, setUnsaltedHash] = useState('');
  const [saltedHash, setSaltedHash] = useState('');
  const [sha1Prefix, setSha1Prefix] = useState('');

  useEffect(() => {
    async function computeHashes() {
      if (!demoInput) {
        setUnsaltedHash('');
        setSaltedHash('');
        setSha1Prefix('');
        return;
      }
      const rawHash = await hashPasswordSha256(demoInput);
      setUnsaltedHash(rawHash);

      const salted = await generateSaltedHash(demoInput, demoSalt);
      setSaltedHash(salted.hash);

      const sha1 = await hashPasswordSha1(demoInput);
      setSha1Prefix(sha1.slice(0, 5));
    }
    computeHashes();
  }, [demoInput, demoSalt]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-4xl mx-auto mb-6">
      <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Interactive Cryptography & Security Lab</h2>
          <p className="text-xs text-slate-500">Learn fundamental concepts: Entropy math, Salting, and k-Anonymity privacy</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Module 1: Information Theory & Entropy Math */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center space-x-2 mb-3">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">1. Password Entropy Mathematics</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Entropy measures unpredictability in bits. Each additional bit doubles the number of guesses a brute-force attacker must perform.
            <br />
            Formula: <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-indigo-700 font-bold">Entropy = Length × log₂ (Character Set Size)</code>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Password Length (L)</span>
                <span className="font-mono text-slate-900">{calcLength} chars</span>
              </div>
              <input
                type="range"
                min={4}
                max={32}
                value={calcLength}
                onChange={(e) => setCalcLength(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Character Set Size (R)</span>
                <span className="font-mono text-slate-900">{calcCharset} symbols</span>
              </div>
              <select
                value={calcCharset}
                onChange={(e) => setCalcCharset(Number(e.target.value))}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
              >
                <option value={10}>10 (Numbers only: 0-9)</option>
                <option value={26}>26 (Lowercase only: a-z)</option>
                <option value={52}>52 (Upper + Lowercase)</option>
                <option value={62}>62 (Upper + Lower + Numbers)</option>
                <option value={94}>94 (Full ASCII: Letters, Numbers, Symbols)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600">Calculated Entropy:</span>
            <span className="font-bold text-indigo-600 text-sm">{calcEntropy} Bits (2<sup>{combinationsExp}</sup> combinations)</span>
          </div>
        </div>

        {/* Module 2: One-Way Hashing & Salting */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center space-x-2 mb-3">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">2. One-Way Cryptographic Hashing & Salting</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Cryptographic hashes (like SHA-256) are deterministic one-way functions. Adding a unique random <strong>Salt</strong> prevents adversaries from using pre-computed <strong>Rainbow Tables</strong> to reverse stolen database dumps.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Sample Password</label>
              <input
                type="text"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Random Salt</label>
              <input
                type="text"
                value={demoSalt}
                onChange={(e) => setDemoSalt(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-slate-500 block mb-0.5">SHA-256 (Raw Password):</span>
              <span className="text-slate-900 font-bold break-all">{unsaltedHash || '—'}</span>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="text-emerald-800 font-bold block mb-0.5">SHA-256 (Salted: {demoSalt}:{demoInput}):</span>
              <span className="text-emerald-950 font-bold break-all">{saltedHash || '—'}</span>
            </div>
          </div>
        </div>

        {/* Module 3: k-Anonymity Leak Check */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center space-x-2 mb-3">
            <Database className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">3. k-Anonymity & Privacy Leak Verification</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            How do services like <em>HaveIBeenPwned</em> verify if your password was leaked without learning what your password is?
            They use <strong>k-Anonymity</strong>: your client sends only the first 5 characters of your SHA-1 hash. The server returns all matching leaked hashes in that prefix group, allowing your local browser to finish the comparison privately.
          </p>

          <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between font-mono text-xs">
            <span className="text-slate-600">k-Anonymity Prefix sent to server:</span>
            <span className="bg-blue-100 text-blue-900 px-2.5 py-1 rounded font-bold">{sha1Prefix || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
