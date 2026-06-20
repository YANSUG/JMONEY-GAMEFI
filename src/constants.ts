import { PublicKey } from '@solana/web3.js'
import { PoolToken, TokenMeta, makeHeliusTokenFetcher } from 'gamba-react-ui-v2'

// ===================================================================
// I. 網路與平台基礎設定
// ===================================================================

// RPC 節點：使用 Helius（快速穩定）
export const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT ?? 'https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY'

// 平台費用接收地址 = 你的錢包 = Pool Authority
export const PLATFORM_CREATOR_ADDRESS = new PublicKey(
  'A5zUmE22MHvxWfCtwFTxPtvbCdhZ7gPBVq812atmKKDR',
)

// 平台相關 URL
export const EXPLORER_URL = 'https://explorer.gamba.so'
export const PLATFORM_SHARABLE_URL = 'https://taiwanjmoney.com/'

// ===================================================================
// II. 平台費用設定 (以小數表示的百分比)
// ===================================================================

export const PLATFORM_CREATOR_FEE = 0.01        // 1% 平台手續費 (Max 7%)
export const MULTIPLAYER_FEE = 0.015            // 1.5% 多人遊戲額外費用
export const PLATFORM_JACKPOT_FEE = 0.001       // 0.1% 平台彩池費用
export const PLATFORM_REFERRAL_FEE = 0.0025     // 0.25% 推薦人費用

export const PLATFORM_ALLOW_REFERRER_REMOVAL = true

// ===================================================================
// III. 代幣池與元資料 (Pools & Token Metadata)
// ===================================================================

// 輔助函式：建立 PoolToken 物件
const lp = (tokenMint: PublicKey | string, poolAuthority?: PublicKey | string): PoolToken => ({
  token: new PublicKey(tokenMint),
  authority: poolAuthority !== undefined ? new PublicKey(poolAuthority) : undefined,
})

/** 支援的流動性池列表 
 *  JMONEY Pool Info:
 *  - Token mint: HZNnmhAY6xfq2iKRyBTEvTVeoTYJzpkK8mfnfG8Ppump
 *  - Pool Address: A5zUmE22MHvxWfCtwFTxPtvbCdhZ7gPBVq812atmKKDR
 *  - Pool Authority: 11111111111111111111111111111111 (預設)
 */
export const POOLS = [
  // SOL: Solana 原生代幣
  lp('So11111111111111111111111111111111111111112'),
  // USDC: 穩定幣
  lp('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  // JMONEY: 你的代幣
  lp('HZNnmhAY6xfq2iKRyBTEvTVeoTYJzpkK8mfnfG8Ppump', 'A5zUmE22MHvxWfCtwFTxPtvbCdhZ7gPBVq812atmKKDR'),
]

// 預設選中的代幣池：JMONEY
export const DEFAULT_POOL = POOLS[2]

/** 手動定義的代幣元資料 */
export const TOKEN_METADATA: (Partial<TokenMeta> & {mint: PublicKey})[] = [
  {
    mint: new PublicKey('HZNnmhAY6xfq2iKRyBTEvTVeoTYJzpkK8mfnfG8Ppump'),
    name: 'JMONEY',
    symbol: 'JMONEY',
    image: 'https://i.ibb.co/BHqF7bqk/Pngtree-winter-solstice-festival-ancestor-chinese-3828589.png',
    baseWager: 1e6,
    decimals: 6,
    usdPrice: 0,
  },
]

// ===================================================================
// IV. 服務與 UI 設定
// ===================================================================

export const TOS_HTML = `
  <p><b>1. 年齡限制：</b> 您必須年滿 18 歲方可使用本平台服務。</p>
  <p><b>2. 法律遵循：</b> 請您遵守當地相關法律規範。</p>
  <p><b>3. 風險聲明：</b> 遊戲涉及風險，不保證一定能贏得獎勵。</p>
  <p><b>4. 無擔保聲明：</b> 本平台之遊戲是以「智能合約」提供，且結果為隨機產生。</p>
  <p><b>5. 責任限制：</b> 對於任何損害，金紙社群概不承擔責任。</p>
  <p><b>6. 許可聲明：</b> 本平台非領有執照之賭場，僅供娛樂模擬之用。</p>
  <p><b>7. 公平遊玩：</b> 本平台確保遊戲公平且透明地進行。</p>
  <p><b>8. 資料隱私：</b> 您的個人資料隱私對我們非常重要。</p>
  <p><b>9. 負責任博弈：</b> 請負責任地進行遊戲，如有需要請尋求協助。</p>
`

/** Helius 代幣元資料自動抓取設定 */
export const TOKEN_METADATA_FETCHER = (
  () => {
    if (import.meta.env.VITE_HELIUS_API_KEY) {
      return makeHeliusTokenFetcher(
        import.meta.env.VITE_HELIUS_API_KEY,
        { dollarBaseWager: 1 },
      )
    }
    return undefined
  }
)()

export const ENABLE_LEADERBOARD = true
export const ENABLE_TROLLBOX = false

export const FEATURED_GAME_INLINE = false
export const FEATURED_GAME_ID: string | undefined = 'jackpot'
