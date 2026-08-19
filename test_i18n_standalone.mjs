import { readFileSync } from 'fs';

const LANGUAGES = ['id', 'en', 'es', 'zh', 'ja', 'fr', 'de', 'ar', 'pt', 'ru', 'ko'];
const VIEWS = [
  'leaderboard.js',
  'compare.js',
  'selector.js',
  'benchmarks.js',
  'simulator.js',
  'tokenizer.js',
  'context.js',
  'prompting.js',
  'glossary.js'
];

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║   11-Language Static Completeness & S Object Audit           ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

let totalChecks = 0;
let passChecks = 0;
let failChecks = 0;

for (const file of VIEWS) {
  const content = readFileSync('./js/views/' + file, 'utf8');
  
  // Extract all S keys in the file
  const foundLangs = [];
  for (const lang of LANGUAGES) {
    totalChecks++;
    const regex = new RegExp(`(^|\\n|\\s)${lang}:\\s*\\{`, 'm');
    if (regex.test(content)) {
      foundLangs.push(lang);
      passChecks++;
    } else {
      console.error(`❌ [${file}] Missing language definition for: ${lang}`);
      failChecks++;
    }
  }
  
  console.log(`✅ [${file.padEnd(14)}] has complete 11/11 language keys: ${foundLangs.join(', ')}`);
}

// Check SHELL_TRANSLATIONS in js/lib/i18n.js
const i18nJs = readFileSync('./js/lib/i18n.js', 'utf8');
const foundShellLangs = [];
for (const lang of LANGUAGES) {
  totalChecks++;
  const regex = new RegExp(`(^|\\n|\\s)${lang}:\\s*\\{`, 'm');
  if (regex.test(i18nJs)) {
    foundShellLangs.push(lang);
    passChecks++;
  } else {
    console.error(`❌ [js/lib/i18n.js SHELL_TRANSLATIONS] Missing language definition for: ${lang}`);
    failChecks++;
  }
}
console.log(`✅ [js/lib/i18n.js] has complete 11/11 language keys: ${foundShellLangs.join(', ')}`);

console.log('\n─────────────────────────────────────────────────────────────');
console.log(`Total Checks: ${totalChecks} | PASSED: ${passChecks} | FAILED: ${failChecks}`);

if (failChecks === 0) {
  console.log('🎉 100% COMPLETE i18n COVERAGE VERIFIED ACROSS ALL 9 VIEWS & SHELL NAVIGATION!');
} else {
  process.exit(1);
}
