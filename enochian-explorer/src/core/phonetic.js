export function getPhoneticPronunciation(word) {
  if (!word) return "";
  let w = word.toLowerCase().replace(/[^a-z]/g, ''); // keep only letters
  
  let syllables = [];
  for (let i = 0; i < w.length; i++) {
    let c = w[i];
    
    if (c === 'z') {
      syllables.push('zod');
    } else if ('bcdfghjklmnpqrstvwx'.includes(c)) {
      let next = w[i+1];
      // If followed by consonant or is the last letter
      if (!next || 'bcdfghjklmnpqrstvwxz'.includes(next)) {
        if (c === 'c') syllables.push('co');
        else if (c === 'n') syllables.push('en');
        else if (c === 's') syllables.push('es');
        else if (c === 'm') syllables.push('em');
        else if (c === 'r') syllables.push('ar');
        else if (c === 'l') syllables.push('el');
        else if (c === 'p') syllables.push('pe');
        else if (c === 't') syllables.push('te');
        else if (c === 'd') syllables.push('de');
        else if (c === 'b') syllables.push('be');
        else syllables.push(c + 'e');
      } else {
        // Consonant followed by vowel
        syllables.push(c + next);
        i++; // skip the vowel as it's grouped
      }
    } else if ('aeiouy'.includes(c)) {
      // Standalone vowel
      syllables.push(c);
    }
  }
  
  return syllables.join('-');
}
