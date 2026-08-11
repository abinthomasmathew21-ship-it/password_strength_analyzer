export interface CriteriaItem {
  id: string;
  label: string;
  passed: boolean;
  message: string;
  weight: number;
}

export interface CrackTimeEstimates {
  onlineThrottled: string;     // 100/sec
  onlineUnthrottled: string;   // 1000/sec
  offlineSlowHash: string;     // 1M/sec (bcrypt/Argon2)
  offlineFastHash: string;     // 100 Billion/sec (MD5/SHA-256 GPU cluster)
}

export interface PasswordMetrics {
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
  isCommonWeak: boolean;
  commonMatchedWord?: string;
  hasRepeatedOrSequential: boolean;
  repeatedPatternMsg?: string;
  score: number; // 0 to 100
  entropyBits: number;
  charsetSize: number;
  strengthLabel: 'Too Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  crackTimes: CrackTimeEstimates;
  criteria: {
    length: CriteriaItem;
    uppercase: CriteriaItem;
    lowercase: CriteriaItem;
    numbers: CriteriaItem;
    special: CriteriaItem;
    uniqueness: CriteriaItem; // Common/weak check
    repetition: CriteriaItem; // Repeated or sequential chars check
  };
  suggestions: string[];
  smartAlternatives: string[];
}

export interface AiAnalysisResult {
  available: boolean;
  summary?: string;
  grade?: string;
  vulnerabilities?: string[];
  smartAlternatives?: string[];
  educationalInsight?: string[];
  message?: string;
}

export interface PasswordHistoryItem {
  id: string;
  hash: string;
  maskedPassword: string;
  createdAt: string;
  strengthScore: number;
  entropyBits: number;
}

export interface GeneratorConfig {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  mode: 'random' | 'passphrase';
  wordCount: number;
  includeNumberInPassphrase: boolean;
  separator: string;
}
