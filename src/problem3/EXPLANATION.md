# Problem 3 Explanation

1. **`WalletBalance` is missing `blockchain`**

   The code uses `balance.blockchain`, but the interface only defines `currency` and `amount`.

2. **`getPriority` uses `any`**

   `blockchain: any` removes the benefit of TypeScript. `string` is already better here, or a union type if the blockchain list is fixed.

3. **`getPriority` is defined inside the component**

   It does not use props or state, so it does not need to be recreated on every render. Move it outside the component.

4. **Priority fallback is a magic number**

   `-99` appears as a special value. A named constant like `NO_PRIORITY` makes the intent clearer.

5. **The filter uses an undefined variable**

   This line is wrong:

   ```tsx
   if (lhsPriority > -99) {
   ```

   `lhsPriority` does not exist. It should be `balancePriority`.

6. **The filter keeps the wrong balances**

   The code returns `true` when `balance.amount <= 0`, so it keeps zero or negative balances. The expected logic should be the opposite:

   ```tsx
   return balancePriority > NO_PRIORITY && balance.amount > 0;
   ```

7. **The filter is more complicated than needed**

   The nested `if` blocks can be replaced by one boolean return. This is easier to read and less error-prone.

8. **The sort comparator is incomplete**

   If both priorities are equal, the comparator returns `undefined`. It should return `0`, or use:

   ```tsx
   return rightPriority - leftPriority;
   ```

9. **`prices` is an unnecessary dependency of `sortedBalances`**

   `sortedBalances` only uses `balances`. Including `prices` means every price update will re-run filter and sort for no reason.

10. **`formattedBalances` is computed but not used**

    The code creates `formattedBalances`, then renders from `sortedBalances`. Because of that, `formatted` is never actually used.

11. **Wrong type in the `rows` map**

    `sortedBalances` contains `WalletBalance`, but the callback says each item is `FormattedWalletBalance`. That hides the real bug: `balance.formatted` does not exist on `sortedBalances`.

12. **Using array index as React key**

    The list is filtered and sorted, so indexes can change. A stable key from the data is safer.

## Smaller notes

- `prices[balance.currency]` can be `undefined`, which would make `usdValue` become `NaN`.
- `children` is destructured but not rendered.
- `classes.row` is used, but `classes` is not defined in the snippet.
- `Props extends BoxProps`, but the component returns a plain `div`. Either use the matching `Box` component or change the prop type.

## Refactor

The refactor keeps the same structure but fixes the main problems:

1. Add `blockchain` to `WalletBalance`.
2. Type `getPriority` properly and move it outside the component.
3. Use a named `NO_PRIORITY` constant.
4. Fix the filter condition.
5. Fix the sort comparator.
6. Remove `prices` from the `sortedBalances` dependency list.
7. Use `formattedBalances` when rendering rows.
8. Use a stable key instead of array index.
9. Guard missing prices with a fallback.
10. Make the prop type match the rendered `div`.
