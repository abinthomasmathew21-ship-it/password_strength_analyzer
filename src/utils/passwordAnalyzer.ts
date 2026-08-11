import { COMMON_PASSWORDS, PASSPHRASE_WORDS } from '../data/commonPasswords';
import { PasswordMetrics, CrackTimeEstimates } from '../types';

/**
 * Normalizes leetspeak to check for disguised common words
 */
function normalizeLeetspeak(str: string): string {
  return str
    .toLowerCase()
    .replace(/@/g, 'a')
    .replace(/4/g, 'a')
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    .replace(/!/g, 'i')
    .replace(/0/g, 'o')
    .replace(/\$/g, 's')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b');
}

/**
 * Detects 3+ repeated characters or sequential character series
 */
function checkRepetitionAndSequences(str: string): { hasIssue: boolean; message: string } {
  if (!str) return { hasIssue: false, message: '' };

  const lower = str.toLowerCase();

  // 1. Triple identical characters (e.g., 'aaa', '111')
  for (let i = 0; i < str.length - 2; i++) {
    if (str[i] === str[i + 1] && str[i] === str[i + 2]) {
      return {
        hasIssue: true,
        message: `Repeated character '${str[i]}' three or more times in a row`,
      };
    }
  }

  // 2. Sequential ascending/descending alphanumeric characters (e.g., '123', 'abc', '321', 'cba')
  for (let i = 0; i < str.length - 2; i++) {
    const code1 = lower.charCodeAt(i);
    const code2 = lower.charCodeAt(i + 1);
    const code3 = lower.charCodeAt(i + 2);

    // Ascending sequence (a-b-c or 1-2-3)
    if (code2 === code1 + 1 && code3 === code2 + 1) {
      if ((code1 >= 97 && code1 <= 122) || (code1 >= 48 && code1 <= 57)) {
        return {
          hasIssue: true,
          message: `Sequential pattern detected ('${str.slice(i, i + 3)}')`,
        };
      }
    }

    // Descending sequence (c-b-a or 3-2-1)
    if (code2 === code1 - 1 && code3 === code2 - 1) {
      if ((code1 >= 97 && code1 <= 122) || (code1 >= 48 && code1 <= 57)) {
        return {
          hasIssue: true,
          message: `Descending sequential pattern detected ('${str.slice(i, i + 3)}')`,
        };
      }
    }
  }

  // 3. Keyboard walks (qwerty, asdf, zxcv, 1q2w)
  const keyboardWalks = ['qwerty', 'qwert', 'werty', 'asdfgh', 'asdf', 'sdfg', 'dfgh', 'zxcvbn', 'zxcv', 'xcvb', '12345', '23456', '34567'];
  for (const walk of keyboardWalks) {
    if (lower.includes(walk)) {
      return {
        hasIssue: true,
        message: `Keyboard row walk detected ('${walk}')`,
      };
    }
  }

  return { hasIssue: false, message: '' };
}

/**
 * Checks if the password matches a known weak password or dictionary word
 */
function checkCommonWeak(str: string): { isCommon: boolean; matchedWord?: string } {
  if (!str) return { isCommon: false };

  const lower = str.toLowerCase();
  const normalized = normalizeLeetspeak(str);

  // Exact match in dictionary
  if (COMMON_PASSWORDS.has(lower) || COMMON_PASSWORDS.has(normalized)) {
    return { isCommon: true, matchedWord: str };
  }

  // Check if password starts or ends with a top weak password
  for (const weakWord of COMMON_PASSWORDS) {
    if (weakWord.length >= 4 && (lower.includes(weakWord) || normalized.includes(weakWord))) {
      return { isCommon: true, matchedWord: weakWord };
    }
  }

  return { isCommon: false };
}

/**
 * Formats duration seconds into human readable time
 */
function formatTime(seconds: number): string {
  if (seconds <= 0.001) return 'Instant';
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)} milliseconds`;
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  
  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} days`;
  
  const years = days / 365;
  if (years < 100) return `${Math.round(years)} years`;
  if (years < 1000) return `${(years / 100).toFixed(1)} centuries`;
  if (years < 1000000) return `${Math.round(years / 1000)} thousand years`;
  if (years < 1000000000) return `${Math.round(years / 1000000)} million years`;
  return `${(years / 1000000000).toFixed(1)} billion years`;
}

/**
 * Calculates Brute-Force Crack Time estimates
 */
function calculateCrackTimes(entropyBits: number): CrackTimeEstimates {
  // Total possible combinations = 2^entropy
  // Using BigInt representation for massive numbers
  const combinations = Math.pow(2, Math.min(entropyBits, 256));

  // Speeds (guesses per second):
  const onlineThrottledSpeed = 100;           // 100 / sec
  const onlineUnthrottledSpeed = 1000;         // 1,000 / sec
  const offlineSlowSpeed = 1000000;            // 1,000,000 / sec (bcrypt/Argon2)
  const offlineFastSpeed = 100000000000;       // 100 Billion / sec (GPU hash cluster)

  return {
    onlineThrottled: formatTime(combinations / onlineThrottledSpeed),
    onlineUnthrottled: formatTime(combinations / onlineUnthrottledSpeed),
    offlineSlowHash: formatTime(combinations / offlineSlowSpeed),
    offlineFastHash: formatTime(combinations / offlineFastSpeed),
  };
}

/**
 * Generates smart alternative recommendations
 */
function generateAlternatives(currentPass: string): string[] {
  const alternatives: string[] = [];

  // Option 1: XKCD-style Passphrase with random words + number + symbol
  const word1 = PASSPHRASE_WORDS[Math.floor(Math.random() * PASSPHRASE_WORDS.length)];
  const word2 = PASSPHRASE_WORDS[Math.floor(Math.random() * PASSPHRASE_WORDS.length)];
  const word3 = PASSPHRASE_WORDS[Math.floor(Math.random() * PASSPHRASE_WORDS.length)];
  const cap1 = word1.charAt(0).toUpperCase() + word1.slice(1);
  const cap2 = word2.charAt(0).toUpperCase() + word2.slice(1);
  const cap3 = word3.charAt(0).toUpperCase() + word3.slice(1);
  const num = Math.floor(10 + Math.random() * 89);
  const syms = ['!', '@', '#', '$', '%', '&', '*'];
  const sym = syms[Math.floor(Math.random() * syms.length)];

  alternatives.push(`${cap1}-${cap2}-${cap3}-${num}${sym}`);

  // Option 2: Modified version of current password if user entered one, or structured phrase
  if (currentPass && currentPass.length > 0) {
    const clean = currentPass.replace(/[^a-zA-Z0-9]/g, '');
    const capClean = clean.length > 0 ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'Secure';
    alternatives.push(`${capClean}#${PASSPHRASE_WORDS[0].toUpperCase()}!${num}99`);
  } else {
    alternatives.push(`Crypto-Guard#${PASSPHRASE_WORDS[4].toUpperCase()}!99`);
  }

  // Option 3: High-entropy 16-character random complex password
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  let randomComplex = '';
  for (let i = 0; i < 16; i++) {
    randomComplex += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  alternatives.push(randomComplex);

  return alternatives;
}

/**
 * Main Password Evaluation function
 */
export function analyzePassword(password: string): PasswordMetrics {
  const len = password.length;

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

  const commonCheck = checkCommonWeak(password);
  const sequenceCheck = checkRepetitionAndSequences(password);

  // Calculate Character Set Size (R)
  let charsetSize = 0;
  if (hasLowercase) charsetSize += 26;
  if (hasUppercase) charsetSize += 26;
  if (hasNumbers) charsetSize += 10;
  if (hasSpecialChars) charsetSize += 32;

  // Base Entropy calculation E = L * log2(R)
  let entropyBits = 0;
  if (len > 0 && charsetSize > 0) {
    entropyBits = len * (Math.log2(charsetSize));

    // Deduct entropy for repetition and dictionary weaknesses
    if (sequenceCheck.hasIssue) {
      entropyBits = Math.max(0, entropyBits * 0.65);
    }
    if (commonCheck.isCommon) {
      entropyBits = Math.max(0, Math.min(entropyBits, 15)); // Dict words have max ~15 bits
    }
  }

  // Criteria Items (Direct match with requested prompt format)
  const criteria = {
    length: {
      id: 'length',
      label: 'Length',
      passed: len >= 12, // 12+ is ideal, < 8 fails
      message: len === 0 ? 'Enter a password' : len < 8 ? '❌ Too short (under 8 characters)' : len < 12 ? '⚠️ Acceptable (12+ recommended)' : '✅ Good length (12+ characters)',
      weight: 25,
    },
    uppercase: {
      id: 'uppercase',
      label: 'Uppercase',
      passed: hasUppercase,
      message: hasUppercase ? '✅ Contains uppercase letters' : '❌ Add uppercase letters (A-Z)',
      weight: 12.5,
    },
    lowercase: {
      id: 'lowercase',
      label: 'Lowercase',
      passed: hasLowercase,
      message: hasLowercase ? '✅ Contains lowercase letters' : '❌ Add lowercase letters (a-z)',
      weight: 12.5,
    },
    numbers: {
      id: 'numbers',
      label: 'Numbers',
      passed: hasNumbers,
      message: hasNumbers ? '✅ Contains numbers' : '❌ Add numbers (0-9)',
      weight: 12.5,
    },
    special: {
      id: 'special',
      label: 'Special characters',
      passed: hasSpecialChars,
      message: hasSpecialChars ? '✅ Contains special characters' : '❌ Add special characters (!@#$...)',
      weight: 12.5,
    },
    uniqueness: {
      id: 'uniqueness',
      label: 'Common/weak password',
      passed: !commonCheck.isCommon && len > 0,
      message: commonCheck.isCommon
        ? `❌ Common or weak password detected ('${commonCheck.matchedWord}')`
        : len === 0
        ? 'Not checked'
        : '✅ Unique & not in common leak databases',
      weight: 12.5,
    },
    repetition: {
      id: 'repetition',
      label: 'Repeated characters',
      passed: !sequenceCheck.hasIssue && len > 0,
      message: sequenceCheck.hasIssue
        ? `❌ ${sequenceCheck.message}`
        : len === 0
        ? 'Not checked'
        : '✅ No repeated or sequential character patterns',
      weight: 12.5,
    },
  };

  // Compute Overall Score (0 to 100)
  let score = 0;
  if (len > 0) {
    if (len >= 8) score += 15;
    if (len >= 12) score += 15;
    if (len >= 16) score += 10;
    if (hasUppercase) score += 10;
    if (hasLowercase) score += 10;
    if (hasNumbers) score += 10;
    if (hasSpecialChars) score += 10;
    if (!commonCheck.isCommon) score += 10;
    if (!sequenceCheck.hasIssue) score += 10;

    // Direct caps for severe security issues
    if (commonCheck.isCommon) score = Math.min(score, 25);
    if (len < 8) score = Math.min(score, 30);
  }

  // Determine Strength Label
  let strengthLabel: PasswordMetrics['strengthLabel'] = 'Too Weak';
  if (score >= 85) strengthLabel = 'Very Strong';
  else if (score >= 70) strengthLabel = 'Strong';
  else if (score >= 50) strengthLabel = 'Fair';
  else if (score >= 25) strengthLabel = 'Weak';
  else strengthLabel = 'Too Weak';

  // Construct Actionable Suggestions
  const suggestions: string[] = [];
  if (len < 8) {
    suggestions.push('Use a longer password or passphrase (at least 12–16 characters).');
  } else if (len < 12) {
    suggestions.push('Increase length to 12 or more characters for exponentially higher entropy.');
  }

  if (!hasUppercase) {
    suggestions.push('Add uppercase letters (A-Z) to widen the search space.');
  }
  if (!hasLowercase) {
    suggestions.push('Add lowercase letters (a-z).');
  }
  if (!hasNumbers) {
    suggestions.push('Add numbers (0-9).');
  }
  if (!hasSpecialChars) {
    suggestions.push('Add special symbols (!, @, #, $, %, ^, &, *).');
  }
  if (commonCheck.isCommon) {
    suggestions.push('Avoid common words, names, dictionary terms, or predictable substitutes (e.g. p@ssword).');
  }
  if (sequenceCheck.hasIssue) {
    suggestions.push('Avoid repeated characters (aaa) or sequential runs (123, abc, qwerty).');
  }

  if (suggestions.length === 0) {
    suggestions.push('Great job! This password has excellent complexity and entropy.');
  }

  const crackTimes = calculateCrackTimes(entropyBits);
  const smartAlternatives = generateAlternatives(password);

  return {
    length: len,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSpecialChars,
    isCommonWeak: commonCheck.isCommon,
    commonMatchedWord: commonCheck.matchedWord,
    hasRepeatedOrSequential: sequenceCheck.hasIssue,
    repeatedPatternMsg: sequenceCheck.message,
    score,
    entropyBits: Math.round(entropyBits * 10) / 10,
    charsetSize,
    strengthLabel,
    crackTimes,
    criteria,
    suggestions,
    smartAlternatives,
  };
}
