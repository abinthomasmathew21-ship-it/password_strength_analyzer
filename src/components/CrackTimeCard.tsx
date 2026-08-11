import React from 'react';
import { Clock, Cpu, Server, Lock, Zap } from 'lucide-react';
import { PasswordMetrics } from '../types';

interface CrackTimeCardProps {
  metrics: PasswordMetrics;
}

export const CrackTimeCard: React.FC<CrackTimeCardProps> = ({ metrics }) => {
  const crackScenarios = [
    {
      label: 'Offline Fast Hash (GPU Cluster)',
      speed: '100 Billion guesses / sec (e.g. SHA-256 / MD5 leaks)',
      time: metrics.crackTimes.offlineFastHash,
      icon: Cpu,
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      label: 'Offline Slow Hash (Key Derivation)',
      speed: '1 Million guesses / sec (e.g. bcrypt / Argon2id)',
      time: metrics.crackTimes.offlineSlowHash,
      icon: Server,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      label: 'Online Unthrottled API Attack',
      speed: '1,000 requests / sec (unprotected web form)',
      time: metrics.crackTimes.onlineUnthrottled,
      icon: Zap,
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      label: 'Online Throttled / Rate-Limited',
      speed: '100 requests / sec (protected login with rate limits)',
      time: metrics.crackTimes.onlineThrottled,
      icon: Lock,
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
  ];

  const searchSpaceExponent = Math.min(metrics.entropyBits, 256);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Estimated Brute-Force Crack Time</h2>
            <p className="text-xs text-slate-500">Calculated across different adversary capabilities and hash speeds</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-700 shrink-0">
          Search Space: <strong className="text-slate-900 font-bold">2<sup>{searchSpaceExponent}</sup></strong> combinations
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crackScenarios.map((scenario, index) => {
          const Icon = scenario.icon;
          return (
            <div
              key={index}
              className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">{scenario.label}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 mb-3">{scenario.speed}</p>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">Time to Crack:</span>
                <span className={`text-sm font-bold font-mono px-2.5 py-0.5 rounded-lg border ${scenario.badgeColor}`}>
                  {metrics.length === 0 ? '—' : scenario.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
