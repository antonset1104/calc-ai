/* ============================================================
   seo.js — Dynamic Meta Tags & JSON-LD Structured Data (Schema.org)
   Meningkatkan SEO dan keterbacaan oleh Googlebot & AI Crawlers
   ============================================================ */

import { LEADERBOARD_MODELS, CATEGORIES, BENCHMARKS } from '../data/leaderboard.js';

const BASE_URL = 'https://llmlab.ai'; // URL kanonikal produksi

export const SEO_DATA = {
  leaderboard: {
    title: {
      id: 'Leaderboard Model AI & Benchmark Terverifikasi 2026',
      en: 'AI Model Leaderboard & Verified Benchmarks 2026',
    },
    desc: {
      id: 'Peringkat independen 30+ model AI (Claude 3.7 Sonnet, GPT-5, DeepSeek R1/V3, Qwen 2.5, Gemini 2.5, Llama 3.3, Mistral, Phi-4) dengan skor terbobot 8 kategori, harga token API, kecepatan streaming, dan konteks window.',
      en: 'Independent ranking of 30+ AI models (Claude 3.7 Sonnet, GPT-5, DeepSeek R1/V3, Qwen 2.5, Gemini 2.5, Llama 3.3, Mistral, Phi-4) across 8 weighted categories, token pricing, speed, and context limits.',
    },
    keywords: 'AI leaderboard, LLM benchmarks, Claude 3.7 Sonnet, DeepSeek R1, GPT-5, Qwen 2.5 Coder, Llama 3.3, Phi-4, token pricing, SWE-bench, MMLU-Pro, GPQA Diamond',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: lang === 'id' ? 'BenchLM AI Model Benchmark Dataset' : 'BenchLM AI Model Benchmark Dataset',
      description: 'Comprehensive benchmark scores, API pricing, throughput, and context limits for frontier and open-weights LLMs.',
      url: `${BASE_URL}/#/leaderboard`,
      creator: {
        '@type': 'Organization',
        name: 'LLM Lab & BenchLM',
        url: BASE_URL,
      },
      variableMeasured: [
        'BenchLM Overall Score (0-100)',
        'Coding (LiveCodeBench, SWE-bench)',
        'Reasoning (GPQA Diamond, MATH-500)',
        'Token Pricing per Million',
        'Output Speed (tokens/sec)',
        'Context Window Size',
      ],
      itemListElement: LEADERBOARD_MODELS.slice(0, 10).map((m, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: m.name,
        description: `${m.vendor} - Skor BenchLM: ${m.overall}/100, $${m.blend}/1M tokens`,
      })),
    }),
  },
  compare: {
    title: {
      id: 'Perbandingan Model AI Head-to-Head & Radar Chart',
      en: 'Head-to-Head AI Model Comparison & Radar Chart',
    },
    desc: {
      id: 'Bandingkan hingga 4 model AI secara berdampingan dengan grafik spider/radar 8 dimensi, matriks tolok ukur spesifik, dan kalkulator selisih tagihan bulanan.',
      en: 'Compare up to 4 AI models side-by-side with an 8-axis capability spider chart, detailed benchmark score matrix, and comparative cost simulation.',
    },
    keywords: 'AI model comparison, compare LLMs, Claude vs GPT, DeepSeek vs OpenAI, LLM radar chart, AI benchmark matrix, token cost comparison',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: lang === 'id' ? 'Komparator Model AI Multi-Dimensi' : 'Multi-Model AI Capability Comparator',
      url: `${BASE_URL}/#/compare`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    }),
  },
  selector: {
    title: {
      id: 'Pencari Model AI Pintar & Kurva Batas Efisiensi Pareto',
      en: 'Smart AI Model Selector & Price-Performance Pareto Curve',
    },
    desc: {
      id: 'Temukan model AI terbaik sesuai kebutuhan beban kerja (Coding, RAG, Reasoning, Chat) atau jelajahi efisiensi harga vs performa pada grafik batas Pareto.',
      en: 'Find the best AI model tailored to your workload constraints (Coding, RAG, Reasoning, Chat) or explore the Pareto efficiency price-performance curve.',
    },
    keywords: 'AI model selector, find best LLM, Pareto frontier AI, LLM price to performance, best AI for coding, cheapest LLM API',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Smart AI Model Finder & Pareto Explorer',
      url: `${BASE_URL}/#/selector`,
      applicationCategory: 'BusinessApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    }),
  },
  benchmarks: {
    title: {
      id: 'Direktori Benchmark AI & Metodologi Penilaian Resmi',
      en: 'AI Benchmark Directory & Evaluation Methodology',
    },
    desc: {
      id: 'Panduan lengkap tolok ukur evaluasi AI modern (SWE-bench, GPQA, MMLU-Pro, IFEval, LiveCodeBench) dan formula pembobotan 8 kategori resmi BenchLM.',
      en: 'Deep dive into modern AI evaluation benchmarks (SWE-bench, GPQA, MMLU-Pro, IFEval, LiveCodeBench) and the official BenchLM 8-category weighting formula.',
    },
    keywords: 'AI benchmarks guide, SWE-bench verified, GPQA diamond, MMLU-pro, LiveCodeBench, IFEval, MATH-500, Chatbot Arena Elo, LLM evaluation methodology',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: lang === 'id' ? 'Direktori & Metodologi Evaluasi Benchmark LLM' : 'AI Model Benchmark Directory & Methodology',
      url: `${BASE_URL}/#/benchmarks`,
      author: { '@type': 'Organization', name: 'LLM Lab & BenchLM' },
      about: BENCHMARKS.map((b) => ({
        '@type': 'DefinedTerm',
        name: b.name,
        description: b.desc[lang] || b.desc.en,
      })),
    }),
  },
  simulator: {
    title: {
      id: 'Simulator Sampling Token & Generasi LLM Interaktif',
      en: 'Interactive Token Sampling & LLM Generation Simulator',
    },
    desc: {
      id: 'Simulasi sampling token langkah demi langkah: penalti frekuensi, softmax bersuhu, pemangkasan top-k/top-p, entropi, dan pipeline 9 tahap.',
      en: 'Step-by-step token sampling simulation: frequency penalty, temperature softmax, top-k/top-p pruning, entropy, and 9-stage inference pipeline.',
    },
    keywords: 'LLM sampling simulator, temperature sampling, top-p nucleus sampling, token generation visualizer, how LLMs work',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: 'Interactive LLM Token Sampling Simulator',
      url: `${BASE_URL}/#/simulator`,
      educationalLevel: 'Beginner to Advanced',
      learningResourceType: 'Simulation',
    }),
  },
  tokenizer: {
    title: {
      id: 'Tokenizer BPE, WordPiece, SentencePiece & Kalkulator Biaya',
      en: 'BPE, WordPiece, SentencePiece Tokenizer & Cost Calculator',
    },
    desc: {
      id: 'Visualisasi pemotongan sub-kata tokenizer 3 gaya dengan byte fallback, ID semu, dan kalkulator biaya per permintaan serta per bulan.',
      en: 'Interactive 3-style sub-word tokenizer visualizer with byte fallback, pseudo-IDs, and monthly token pricing calculator.',
    },
    keywords: 'tokenizer online, BPE tokenizer, WordPiece, SentencePiece, token counter, LLM cost calculator, tokens per word',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Multi-Algorithm Tokenizer & Pricing Calculator',
      url: `${BASE_URL}/#/tokenizer`,
      applicationCategory: 'UtilityApplication',
    }),
  },
  context: {
    title: {
      id: 'Visualisasi Jendela Konteks & Simulasi Memori Percakapan',
      en: 'Context Window Visualizer & Chat Memory Simulation',
    },
    desc: {
      id: 'Perbandingan jendela konteks skala logaritmik, kalkulator kapasitas bahan bacaan, dan simulasi sliding window memori percakapan.',
      en: 'Logarithmic context window comparison, reading material capacity calculator, and chat memory sliding window simulation.',
    },
    keywords: 'context window comparison, LLM memory simulation, 2M context window, sliding window memory, RAG vs context',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: 'Context Window & Memory Simulation Guide',
      url: `${BASE_URL}/#/context`,
    }),
  },
  prompting: {
    title: {
      id: 'Panduan Prompt Engineering RISEN & Templat Siap Pakai',
      en: 'RISEN Prompt Engineering Framework & Ready Templates',
    },
    desc: {
      id: 'Penyusun prompt metode RISEN dengan skor kelengkapan 8 kriteria langsung, 8 teknik perbandingan sebelum/sesudah, dan katalog templat siap pakai.',
      en: 'RISEN framework prompt builder with 8-criteria real-time score grading, 8 before/after technique guides, and categorized prompt templates.',
    },
    keywords: 'prompt engineering guide, RISEN prompt framework, prompt optimizer, system prompts, few-shot prompting, chain of thought prompt',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Write Effective Prompts with RISEN Framework',
      url: `${BASE_URL}/#/prompting`,
    }),
  },
  glossary: {
    title: {
      id: 'Glosarium AI & LLM — 150+ Istilah Dwi-Bahasa (ID/EN)',
      en: 'AI & LLM Glossary — 150+ Dual-Language Terms (ID/EN)',
    },
    desc: {
      id: 'Kamus glosarium istilah kecerdasan buatan, machine learning, transformer, sampling, dan arsitektur LLM dalam bahasa Indonesia dan Inggris.',
      en: 'Comprehensive dictionary of AI, machine learning, transformer architecture, sampling methods, and LLM terminology in English and Indonesian.',
    },
    keywords: 'AI glossary, kamus AI, istilah kecerdasan buatan, LLM terms, transformer dictionary, AI terminology ID EN',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: 'Comprehensive AI & LLM Glossary',
      url: `${BASE_URL}/#/glossary`,
    }),
  },
};

/**
 * Memperbarui Meta Tags, Canonical Link, OpenGraph, Twitter Card, & JSON-LD
 */
export function updateSEO(routeId, lang = 'id') {
  const meta = SEO_DATA[routeId] || SEO_DATA.leaderboard;
  const titleText = `${meta.title[lang] || meta.title.en || meta.title.id} — LLM Lab & BenchLM`;
  const descText = meta.desc[lang] || meta.desc.en || meta.desc.id;
  const canonicalUrl = `${BASE_URL}/#/${routeId}`;

  // Title
  document.title = titleText;

  // Meta Description
  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement('meta');
    descTag.name = 'description';
    document.head.appendChild(descTag);
  }
  descTag.content = descText;

  // Meta Keywords
  let kwTag = document.querySelector('meta[name="keywords"]');
  if (!kwTag) {
    kwTag = document.createElement('meta');
    kwTag.name = 'keywords';
    document.head.appendChild(kwTag);
  }
  kwTag.content = meta.keywords;

  // Canonical Link
  let canTag = document.querySelector('link[rel="canonical"]');
  if (!canTag) {
    canTag = document.createElement('link');
    canTag.rel = 'canonical';
    document.head.appendChild(canTag);
  }
  canTag.href = canonicalUrl;

  // Open Graph
  const setOG = (property, content) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.content = content;
  };
  setOG('og:title', titleText);
  setOG('og:description', descText);
  setOG('og:url', canonicalUrl);
  setOG('og:type', 'website');
  setOG('og:site_name', 'LLM Lab & BenchLM');

  // Twitter Card
  const setTwitter = (name, content) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = name;
      document.head.appendChild(tag);
    }
    tag.content = content;
  };
  setTwitter('twitter:card', 'summary_large_image');
  setTwitter('twitter:title', titleText);
  setTwitter('twitter:description', descText);

  // Dynamic JSON-LD Schema
  let schemaScript = document.getElementById('jsonld-schema');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'jsonld-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  const schemaObj = meta.schema ? meta.schema(lang) : null;
  if (schemaObj) {
    schemaScript.textContent = JSON.stringify(schemaObj, null, 2);
  }
}
