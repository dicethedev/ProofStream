import { useTokenAsset } from "./TokenPairAvatar";
import {
  exactUsdLabel,
  formatPairLabel,
  formatTokenAmounts,
  formatUsd,
} from "../../utils/activityFormat";

export { formatPairLabel } from "../../utils/activityFormat";

type TokenAmountValueProps = {
  readonly amount: string;
  readonly network: string;
  readonly rawUnits: boolean;
  readonly token0Address: string;
  readonly token0Symbol: string;
  readonly token1Address: string;
  readonly token1Symbol: string;
};

export function IndexedUsdValue({ value }: { readonly value: string }) {
  const display = formatUsd(value);
  const detail = `Exact indexed value: ${exactUsdLabel(value)}`;

  return <ReadableValue detail={detail} display={display} />;
}

export function TokenAmountValue({
  amount,
  network,
  rawUnits,
  token0Address,
  token0Symbol,
  token1Address,
  token1Symbol,
}: TokenAmountValueProps) {
  const token0 = useTokenAsset(network, token0Address, token0Symbol);
  const token1 = useTokenAsset(network, token1Address, token1Symbol);
  const { detail, display } = formatTokenAmounts({
    amount,
    decimals0: token0?.decimals,
    decimals1: token1?.decimals,
    name0: token0?.name,
    name1: token1?.name,
    rawUnits,
    symbol0: token0Symbol,
    symbol1: token1Symbol,
  });

  return <ReadableValue detail={detail} display={display} />;
}

function ReadableValue({ detail, display }: { readonly detail: string; readonly display: string }) {
  return (
    <span className="readable-value" data-tooltip={detail} aria-label={detail}>
      <span>{display}</span>
    </span>
  );
}
