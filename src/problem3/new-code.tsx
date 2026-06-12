interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const NO_PRIORITY = -99;

const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? NO_PRIORITY;
};

const filterAndSortBalances = (balances: WalletBalance[]): WalletBalance[] => {
  return balances
    .filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > NO_PRIORITY && balance.amount > 0;
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority;
    });
};

const formatBalances = (balances: WalletBalance[]): FormattedWalletBalance[] => {
  return balances.map((balance: WalletBalance): FormattedWalletBalance => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return filterAndSortBalances(balances);
  }, [balances]);

  const formattedBalances = useMemo(() => {
    return formatBalances(sortedBalances);
  }, [sortedBalances]);

  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance) => {
      const usdValue = (prices[balance.currency] ?? 0) * balance.amount;

      return (
        <WalletRow
          className={classes.row}
          key={`${balance.blockchain}-${balance.currency}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return (
    <div {...rest}>
      {children}
      {rows}
    </div>
  );
};
