// Algorand API constants
export const ALPHA_REWARDS_WALLET = 'XUIBTKHE7ISNMCLJWXUOOK6X3OCP3GVV3Z4J33PHMYX6XXK3XWN3KDMMNI';
export const USDC_ASSET_ID = 31566704;
export const API_BASE_URL = 'https://mainnet-idx.4160.nodely.dev/v2/accounts';

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

// Fetch transactions from Algorand Indexer
export async function fetchTransactions(
  nextToken?: string
): Promise<TransactionResponse> {
  const params = new URLSearchParams({
    'limit': '1000'
  });

  if (nextToken) {
    params.append('next', nextToken);
  }

  const url = `${API_BASE_URL}/${ALPHA_REWARDS_WALLET}/transactions?${params.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// Helper function to find USDC transfers to target address in transaction tree
function findUSDCTransfers(tx: AlgorandTransaction, targetAddress: string): AssetTransferTransaction[] {
  const transfers: AssetTransferTransaction[] = [];
  
  // Check if this transaction is a direct USDC transfer to target
  if (tx['asset-transfer-transaction'] && 
      tx['asset-transfer-transaction']['asset-id'] === USDC_ASSET_ID &&
      tx['asset-transfer-transaction']['receiver'] === targetAddress) {
    transfers.push(tx['asset-transfer-transaction']);
  }
  
  // Recursively check inner transactions
  if (tx['inner-txns']) {
    for (const innerTx of tx['inner-txns']) {
      transfers.push(...findUSDCTransfers(innerTx, targetAddress));
    }
  }
  
  return transfers;
}

// Process and sum rewards
export async function checkRewards(address: string): Promise<RewardsData> {
  let allRewardTransactions: AlgorandTransaction[] = [];
  let nextToken: string | undefined = undefined;
  let totalAmount = 0;

  try {
    do {
      const data = await fetchTransactions(nextToken);
      
      if (data.transactions) {
        // Process each transaction from the ALPHA wallet
        for (const tx of data.transactions) {
          if (tx.sender === ALPHA_REWARDS_WALLET) {
            // Look for USDC transfers to our target address in this transaction tree
            const usdcTransfers = findUSDCTransfers(tx, address);
            
            if (usdcTransfers.length > 0) {
              // Create a transaction record for each USDC transfer found
              for (const transfer of usdcTransfers) {
                const rewardTx: AlgorandTransaction = {
                  'asset-transfer-transaction': transfer,
                  'confirmed-round': tx['confirmed-round'],
                  'round-time': tx['round-time'],
                  'sender': ALPHA_REWARDS_WALLET,
                  'tx-type': 'axfer'
                };
                
                allRewardTransactions.push(rewardTx);
                totalAmount += transfer.amount;
              }
            }
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
