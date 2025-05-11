export function getAgeTier(age) {
    if (age >= 5 && age <= 8) return 'jr';
    if (age >= 9 && age <= 13) return 'explorer';
    return 'default';
  }