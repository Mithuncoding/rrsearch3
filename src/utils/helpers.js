import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function extractTextFromHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function highlightTerms(text, terms) {
  if (!terms || terms.length === 0) return text;
  
  let highlightedText = text;
  terms.forEach(term => {
    const regex = new RegExp(`\\b(${term.term})\\b`, 'gi');
    highlightedText = highlightedText.replace(
      regex,
      `<span class="glossary-term" data-term="${term.term}" data-definition="${term.definition}">$1</span>`
    );
  });
  
  return highlightedText;
}

export function estimateReadingTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
}

export function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}
