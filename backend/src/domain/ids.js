let sequence = 0;

export function createId(prefix) {
  sequence += 1;
  return `demo-${prefix}-${String(sequence).padStart(4, "0")}`;
}

export function resetIdsForTests() {
  sequence = 0;
}

