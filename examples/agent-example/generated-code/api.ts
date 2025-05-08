function getRandomNumber(): number {
  return Math.floor(Math.random() * 100); // Generate a random number between 0 and 99
}

function addNumbers(a: number, b: number): number {
  return a + b; // Return the sum of a and b
}

const num1 = getRandomNumber(); // First random number
const num2 = getRandomNumber(); // Second random number
const result = addNumbers(num1, num2); // Add the two random numbers
console.log(`Random numbers: ${num1}, ${num2}`); // Output the random numbers
console.log(`Sum: ${result}`); // Output the result