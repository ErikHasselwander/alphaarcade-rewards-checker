// Algorand API constants
export const ALPHA_REWARDS_WALLET = 'XUIBTKHE7ISNMCLJWXUOOK6X3OCP3GVV3Z4J33PHMYX6XXK3XWN3KDMMNI';
export const USDC_ASSET_ID = 31566704;
export const API_BASE_URL = 'https://mainnet-idx.4160.nodely.dev/v2/transactions';

// Validate Algorand address format
export function isValidAlgorandAddress(address: string): boolean {
  // Basic validation: 58 characters, alphanumeric (Base32)
  const regex = /^[A-Z2-7]{58}$/;
  return regex.test(address.toUpperCase());
}

// Format USDC amount (from microUSDC to USDC)
export function formatUSDC(microUsdc: number): string {
  return (microUsdc / 1000000).toFixed(2);
}

// Asset transfer transaction interface
export interface AssetTransferTransaction {
  'amount': number;
  'asset-id': number;
  'receiver': string;
}

// Transaction interface  
export interface AlgorandTransaction {
  'asset-transfer-transaction'?: AssetTransferTransaction;
  'inner-txns'?: AlgorandTransaction[];
  'confirmed-round': number;
  'round-time': number;
  'sender': string;
  'tx-type': string;
}

// API response interface
export interface TransactionResponse {
  transactions: AlgorandTransaction[];
  'next-token'?: string;
  'current-round': number;
}

// Processed rewards data
export interface RewardsData {
  totalAmount: number;
  transactions: AlgorandTransaction[];
  count: number;
}

// Fetch transactions from Algorand Indexer using optimized search
export async function fetchTransactions(
  nextToken?: string
): Promise<TransactionResponse> {
  const params = new URLSearchParams({
    'sender-address': ALPHA_REWARDS_WALLET,
    'asset-id': USDC_ASSET_ID.toString(),
    'tx-type': 'axfer',
    'limit': '1000'
  });

  if (nextToken) {
    params.append('next', nextToken);
  }

  const url = `${API_BASE_URL}?${params.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// Process and sum rewards using optimized API query
export async function checkRewards(address: string): Promise<RewardsData> {
  let allRewardTransactions: AlgorandTransaction[] = [];
  let nextToken: string | undefined = undefined;
  let totalAmount = 0;

  try {
    do {
      const data = await fetchTransactions(nextToken);
      
      if (data.transactions) {
        // Filter transactions to the target address (already filtered by sender and asset on server)
        for (const tx of data.transactions) {
          if (tx['asset-transfer-transaction'] && 
              tx['asset-transfer-transaction']['receiver'] === address) {
            allRewardTransactions.push(tx);
            totalAmount += tx['asset-transfer-transaction']['amount'];
          }
        }
      }
      
      nextToken = data['next-token'];
    } while (nextToken);

    return {
      totalAmount,
      transactions: allRewardTransactions,
      count: allRewardTransactions.length
    };
  } catch (error) {
    console.error('Error fetching rewards:', error);
    throw new Error('Failed to fetch transaction data. Please try again later.');
  }
}
