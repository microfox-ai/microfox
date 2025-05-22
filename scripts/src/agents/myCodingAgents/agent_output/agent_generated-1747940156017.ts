function fibonacci(n: number): number[] {
  const fibSequence: number[] = [];
  if (n <= 0) return fibSequence;
  if (n === 1) return [0];
  fibSequence.push(0, 1);
  for (let i = 2; i < n; i++) {
    const nextFib = fibSequence[i - 1] + fibSequence[i - 2];
    fibSequence.push(nextFib);
  }
  return fibSequence;
}

const numTerms = 10;
const fibSeries = fibonacci(numTerms);
console.log(fibSeries);