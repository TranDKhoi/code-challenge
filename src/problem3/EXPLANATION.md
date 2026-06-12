# Problem 3 - Explain

Instead point out each issue in the code, I will refactor it based on five pillars: Type Safety, Performance, Readability, Maintainability, and Testability.

---

## 1. Type Safety

- **Missing interface property**: `balance.blockchain` is used but this property is missing from the `WalletBalance`.
- **Use of `any` types**: The `blockchain` parameter in the `getPriority` function was typed as `any`, it should be atleast string instead.
- **Mismatch in row mapper type**: The `rows` mapping callback typed the items as `FormattedWalletBalance` but iterated over `WalletBalance`.
- **Unsafe index access**: Access `prices[balance.currency]` could be `undefined`
### Fixes:
- Added `blockchain` to the `WalletBalance` interface and typed `blockchain` as a `string`.
- Rendered rows using `formattedBalances` instead of `sortedBalances`.
- Guarded price lookups with a fallback: `prices[balance.currency] ?? 0`.

---

## 2. Performance

- **Unnecessary dependencies**: `prices` is listed in the dependency array for `sortedBalances` `useMemo`, while the callback is not using it. This will cause unnecessary re-render when `prices` change
- **Dead code**: `formattedBalances` is calculated but never used. This is a bug.
- **Unmemoized row rendering**: The row components are mapped on every render.

### Fixes:
- Removed `prices` from the `sortedBalances` dependency array.
- Used the calculated `formattedBalances` to render rows.
- Wrapped the row mapper inside `useMemo` so that row calculations only run when `formattedBalances` or `prices` change.

---

## 3. Readability & Clean Code

- **Wrong filter logic**: The filter block use nested `if` and referenced an undefined variable `lhsPriority`.
- **Incomplete sort comparator**: The sort comparator only handled `>` and `<`, missing `==` case.
- **Using array index as key**: The loop index is used as the React key. Since the list is filtered and sorted dynamically, this could cause UI bug.

### Fixes:
- Simplify the filter statement.
- Use a subtraction statement (`rightPriority - leftPriority`) to resolve sorting.
- Replaced the array index with a stable combination key: `${balance.blockchain}-${balance.currency}`.

---

## 4. Maintainability

- **Helper method inside component**: `getPriority` is defined inside the component scope, it would be unnecessary re-instantiated on re-render.
- **Hard-coded switch statement**: If new type of blockchain need to be added, we have to modifying the logic inside the switch statement.
- **Redundant interface duplication**: `FormattedWalletBalance` copy-pasted all properties from `WalletBalance` instead of reusing it.

### Fixes:
- Moved `getPriority` outside the component scope.
- Replaced the switch-case with a configuration lookup object (`BLOCKCHAIN_PRIORITIES`).
- Changed `Props` to extend `React.HTMLAttributes<HTMLDivElement>`.
- Refactored `FormattedWalletBalance` to extend `WalletBalance`.

---

## 5. Testability

- **Coupled data manipulation**: The logic for filtering, sorting, and formatting balances is put inside the component scope. Testing these method required rendering or mounting the full component and mock hook context, complicating unit testing.

### Fixes:
- Extracted those logics into top-level function.

