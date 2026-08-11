import React from 'react';
import { History, Shield, Trash2, CheckCircle, AlertTriangle, Key } from 'lucide-react';
import { PasswordHistoryItem } from '../types';

interface PasswordReuseHistoryProps {
  vault: PasswordHistoryItem[];
  onClearVault: () => void;
  onRemoveItem: (id: string) => void;
  onTestPassword: (masked: string) => void;
}

export const PasswordReuseHistory: React.FC<PasswordReuseHistoryProps> = ({
  vault,
  onClearVault,
  onRemoveItem,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-4xl mx-auto mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Password Reuse Guard & Hash Vault</h2>
            <p className="text-xs text-slate-500">
              Demonstrating secure database hash-checks to enforce password non-reuse policies
            </p>
          </div>
        </div>

        {vault.length > 0 && (
          <button
            onClick={onClearVault}
            className="inline-flex items-center space-x-1.5 text-xs text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History Vault</span>
          </button>
        )}
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-xs text-slate-700 leading-relaxed">
        <div className="flex items-center space-x-2 font-bold text-slate-900 mb-1">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>How Database Password Reuse Guard Works:</span>
        </div>
        <p>
          Secure systems (NIST 800-63B standards) store only <strong>salted cryptographic hashes (e.g., SHA-256 / Argon2)</strong> of previously used passwords. When you enter a password, the system hashes it and compares it against your history. If a match is found, authentication policy blocks reuse to protect against compromised credentials.
        </p>
      </div>

      {vault.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
          <Key className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700 mb-1">Vault is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Analyze any password in the analyzer tab and click <strong>"Log Hash to Reuse Guard Vault"</strong> to populate your history log!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex justify-between">
            <span>Logged Hashes ({vault.length})</span>
            <span>Policy: No Reuse Allowed</span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {vault.map((item) => (
              <div
                key={item.id}
                className="p-3.5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {item.maskedPassword}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.createdAt}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-slate-500 truncate max-w-md" title={item.hash}>
                    SHA-256: <span className="text-slate-700">{item.hash}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {item.entropyBits} bits
                  </span>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
