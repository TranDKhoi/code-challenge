var sum_to_n_a = function (n) {
    let sum = 0;
    const step = Math.sign(n);

    for (let i = n; i !== 0; i -= step) {
        sum += i;
    }

    return sum;
};

var sum_to_n_b = function (n) {
    if (n === 0) {
        return 0;
    }

    const step = Math.sign(n);

    return n + sum_to_n_b(n - step);
};

var sum_to_n_c = function (n) {
    const sign = Math.sign(n);

    return (n * (n + sign)) / 2 * sign;
};

console.log(sum_to_n_a(5));   // 15
console.log(sum_to_n_a(-5));  // -15

console.log(sum_to_n_b(5));   // 15
console.log(sum_to_n_b(-5));  // -15

console.log(sum_to_n_c(5));   // 15
console.log(sum_to_n_c(-5));  // -15