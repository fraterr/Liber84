export const calculateGematria = (word) => {
  // Standard mapping resembling Agrippa/Latin cabala often used in basic Enochian studies
  const gematriaMap = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 9, // I/J share
    k: 10, l: 20, m: 30, n: 40, o: 50, p: 60, q: 70, r: 80, s: 90,
    t: 100, u: 200, v: 200, // U/V share
    w: 300, x: 400, y: 500, z: 600
  };

  if (!word || word.trim().length === 0) return { total: 0, breakdown: "" };
  
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  let total = 0;
  let breakdown = [];

  for (let char of cleanWord) {
    if (gematriaMap.hasOwnProperty(char)) {
      const val = gematriaMap[char];
      total += val;
      breakdown.push(`${char.toUpperCase()}=${val}`);
    }
    // If not in map, we skip it silently
  }

  return { 
    total, 
    breakdown: breakdown.length > 0 ? breakdown.join(' + ') : "No valid characters" 
  };
};

export const findWordsByGematria = (dictionary, targetValue) => {
  const matches = [];
  const target = parseInt(targetValue, 10);
  
  if (isNaN(target)) return [];

  // dictionary is an object { word: definition }
  for (const [word, definition] of Object.entries(dictionary)) {
    const { total } = calculateGematria(word);
    if (total === target) {
      matches.push({
        name: word,
        meaning: definition,
        type: 'gematria_match',
        value: total
      });
    }
  }

  return matches;
};
