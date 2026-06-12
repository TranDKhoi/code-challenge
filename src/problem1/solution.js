var sumToNIterative = function (n) {
    let sum = 0;
    const step = Math.sign(n);

    for (let i = n; i !== 0; i -= step) {
        sum += i;
    }

    return sum;
};

var sumToNRecursive = function (n) {
    if (n === 0) {
        return 0;
    }

    const step = Math.sign(n);

    return n + sumToNRecursive(n - step);
};

var sumToNFormula = function (n) {
    const sign = Math.sign(n);

    return (n * (n + sign)) / 2 * sign;
};

console.log(sumToNIterative(5));   // 15
console.log(sumToNIterative(-5));  // -15

console.log(sumToNRecursive(5));   // 15
console.log(sumToNRecursive(-5));  // -15

console.log(sumToNFormula(5));   // 15
console.log(sumToNFormula(-5));  // -15