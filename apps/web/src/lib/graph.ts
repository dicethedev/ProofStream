export async function fetchGraphEvents(wallet: string): Promise<string[]> {
  const endpoint = import.meta.env.VITE_GRAPH_ENDPOINT as string | undefined;

  if (!endpoint) {
    throw new Error("Set VITE_GRAPH_ENDPOINT to fetch live subgraph data.");
  }

  const query = `
    query ProofStreamWalletEvents($wallet: String!) {
      swaps(
        first: 10
        orderBy: timestamp
        orderDirection: desc
        where: { sender: $wallet }
      ) {
        id
        sender
        recipient
        amount0
        amount1
        transaction { id }
      }
    }
  `;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables: { wallet: wallet.toLowerCase() } }),
  });

  if (!response.ok) {
    throw new Error(`The Graph request failed with HTTP ${response.status}.`);
  }

  const data = await response.json() as GraphResponse;

  if (data.errors?.length) {
    throw new Error(data.errors[0]?.message ?? "The Graph returned an error.");
  }

  const swaps = data.data?.swaps ?? [];
  if (!swaps.length) {
    throw new Error("No live rows returned for that wallet.");
  }

  return swaps.map((swap) =>
    `swap:${swap.sender}->${swap.recipient}:${swap.amount0}/${swap.amount1}:${swap.transaction.id}`,
  );
}

type GraphResponse = {
  errors?: Array<{ message: string }>;
  data?: {
    swaps?: Array<{
      id: string;
      sender: string;
      recipient: string;
      amount0: string;
      amount1: string;
      transaction: { id: string };
    }>;
  };
};
