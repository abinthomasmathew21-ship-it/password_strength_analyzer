import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { PasswordMetrics } from '../types';

interface CriteriaChecklistProps {
  metrics: PasswordMetrics;
}

export const CriteriaChecklist: React.FC<CriteriaChecklistProps> = ({ metrics }) => {
  const criteriaList = [
    {
      id: 'length',
      label: 'Length',
      passed: metrics.criteria.length.passed,
      message: metrics.criteria.length.message,
      detail: `Current length: ${metrics.length} characters (Recommended: 12+)`,
    },
    {
      id: 'uppercase',
      label: 'Uppercase',
      passed: metrics.criteria.uppercase.passed,
      message: metrics.criteria.uppercase.message,
      detail: 'Requires at least one uppercase letter (A-Z)',
    },
    {
      id: 'lowercase',
      label: 'Lowercase',
      passed: metrics.criteria.lowercase.passed,
      message: metrics.criteria.lowercase.message,
      detail: 'Requires at least one lowercase letter (a-z)',
    },
    {
      id: 'numbers',
      label: 'Numbers',
      passed: metrics.criteria.numbers.passed,
      message: metrics.criteria.numbers.message,
      detail: 'Requires at least one numeric digit (0-9)',
    },
    {
      id: 'special',
      label: 'Special characters',
      passed: metrics.criteria.special.passed,
      message: metrics.criteria.special.message,
      detail: 'Requires at least one symbol (!@#$%^&*...)',
    },
    {
      id: 'uniqueness',
      label: 'Common/weak password',
      passed: metrics.criteria.uniqueness.passed,
      message: metrics.criteria.uniqueness.message,
      detail: 'Checks against known weak lists & dictionary words',
    },
    {
      id: 'repetition',
      label: 'Repeated characters',
      passed: metrics.criteria.repetition.passed,
      message: metrics.criteria.repetition.message,
      detail: 'Prevents repeated chars (aaa) & sequential runs (123, qwerty)',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Complexity Checklist</h2>
          <p className="text-xs text-slate-500">Real-time verification of key cryptographic parameters</p>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
          {criteriaList.filter((c) => c.passed).length} / {criteriaList.length} Passed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {criteriaList.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
              metrics.length === 0
                ? 'bg-slate-50 border-slate-200 text-slate-600'
                : item.passed
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/60 border-rose-200 text-rose-950'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {metrics.length === 0 ? (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                  •
                </div>
              ) : item.passed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {item.label}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                    metrics.length === 0
                      ? 'bg-slate-200 text-slate-600'
                      : item.passed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {metrics.length === 0 ? 'Pending' : item.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>

              <p className="text-xs font-medium mt-0.5 line-clamp-1">
                {metrics.length === 0 ? item.detail : item.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
