export function filterBadInput(input) {
    const badWords = ['kill', 'sex', 'drugs', 'violence', 'death'];
    const lowered = input.toLowerCase();
    return !badWords.some(word => lowered.includes(word));
  }