import { useEffect, useState } from "react";
import { resolveTokenAsset, type TokenAsset } from "../../lib/tokenAssets";

type TokenPairAvatarProps = {
  readonly network: string;
  readonly token0Address: string;
  readonly token0Symbol: string;
  readonly token1Address: string;
  readonly token1Symbol: string;
};

export function TokenPairAvatar({
  network,
  token0Address,
  token0Symbol,
  token1Address,
  token1Symbol,
}: TokenPairAvatarProps) {
  return (
    <span
      className="token-pair-avatar"
      aria-label={`${token0Symbol} and ${token1Symbol} token icons`}
    >
      <TokenAvatar address={token0Address} network={network} symbol={token0Symbol} />
      <TokenAvatar address={token1Address} network={network} symbol={token1Symbol} />
    </span>
  );
}

function TokenAvatar({
  address,
  network,
  symbol,
}: {
  readonly address: string;
  readonly network: string;
  readonly symbol: string;
}) {
  const asset = useTokenAsset(network, address, symbol);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [asset?.logoURI]);

  const initials = symbol.trim().slice(0, 3).toUpperCase() || "?";

  return (
    <span className="token-avatar" title={`${symbol} on ${network}`}>
      {asset?.logoURI && !failed ? (
        <img
          src={asset.logoURI}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  );
}

export function useTokenAsset(network: string, address: string, symbol: string) {
  const [asset, setAsset] = useState<TokenAsset | null>(null);

  useEffect(() => {
    let active = true;
    setAsset(null);

    void resolveTokenAsset(network, address, symbol).then((nextAsset) => {
      if (active) setAsset(nextAsset);
    });

    return () => {
      active = false;
    };
  }, [address, network, symbol]);

  return asset;
}
