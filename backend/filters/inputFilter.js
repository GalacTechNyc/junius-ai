// backend/filters/inputFilter.js

// Patterns we want to block outright
const bannedPatterns = [
  /fuck/i,
  /shit/i,
  /bitch/i,
  /cunt/i,
  /\bass\b/i,
  /tits?\b/i,
  /\borgasm/i,
  /masturb/i,
  /intercourse/i,
  /rape/i,
  /\bsex\b/i,
  /porn/i,
  /suicid(e|al)/i,
  /kill yourself/i,
  /how to kill/i,
  /murder/i,
  /bomb/i,
  /terror/i,
  /hack(ing)?/i,
  /drug(s| use)?/i
];

function filterBadInput(input) {
  if (typeof input !== 'string') return false;
  for (const pattern of bannedPatterns) {
    if (pattern.test(input)) {
      console.log(`❌ filterBadInput blocked input due to pattern: ${pattern}`);
      return false;
    }
  }
  return true;
}

module.exports = { filterBadInput };