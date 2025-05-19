function isPalindrome(str: string): boolean {
  str = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const reversedStr = str.split("").reverse().join("");
  return str === reversedStr;
}

console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("hello")); // false