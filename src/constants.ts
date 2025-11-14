import { PublicKey } from '@solana/web3.js'
// 移除 FAKE_TOKEN_MINT 的導入，除非您需要它
import { PoolToken, TokenMeta, makeHeliusTokenFetcher } from 'gamba-react-ui-v2' 

// ===================================================================
// I. 網路與平台基礎設定
// ===================================================================

// RPC 節點：從環境變數取得，若無則使用公共主網 RPC
export const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT ?? 'https://api.mainnet-beta.solana.com'

// 平台費用接收地址 (!!重要：請將此地址換成您自己的錢包!!)
export const PLATFORM_CREATOR_ADDRESS = new PublicKey(
  'AjhV5Su8V5NLsnfqkYvUTGSRMPkj9pQ33HTohFAU8R43', // <-- 再次提醒：請務必更新為您的地址
)

// 平台相關 URL
export const EXPLORER_URL = 'https://explorer.gamba.so'
export const PLATFORM_SHARABLE_URL = 'https://taiwanjmoney.com/' // 您的域名

// ===================================================================
// II. 平台費用設定 (以小數表示的百分比)
// ===================================================================

export const PLATFORM_CREATOR_FEE = 0.01   // 1% 平台手續費 (Max 7%)
export const MULTIPLAYER_FEE = 0.015       // 1.5% 多人遊戲額外費用
export const PLATFORM_JACKPOT_FEE = 0.001  // 0.1% 平台彩池費用
export const PLATFORM_REFERRAL_FEE = 0.0025 // 0.25% 推薦人費用

// 是否允許用戶移除推薦人關係
export const PLATFORM_ALLOW_REFERRER_REMOVAL = true

// ===================================================================
// III. 代幣池與元資料 (Pools & Token Metadata)
// ===================================================================

// 輔助函式：建立 PoolToken 物件
const lp = (tokenMint: PublicKey | string, poolAuthority?: PublicKey | string): PoolToken => ({
  token: new PublicKey(tokenMint),
  authority: poolAuthority !== undefined ? new PublicKey(poolAuthority) : undefined,
})

/** 支援的流動性池列表 */
export const POOLS = [
  // SOL: Solana 原生代幣
  lp('So11111111111111111111111111111111111111112'),
  // USDC: 穩定幣
  lp('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  // JMONEY: 您新增的代幣
  lp('HZNnmhAY6xfq2iKRyBTEvTVeoTYJzpkK8mfnfG8Ppump'),
]

// 預設選中的代幣池：改為 SOL，如果前面移除 FAKE_TOKEN_MINT
export const DEFAULT_POOL = POOLS[0] 

/** 手動定義的代幣元資料 (若 Helius Fetcher 未啟用或數據不全時使用) */
export const TOKEN_METADATA: (Partial<TokenMeta> & {mint: PublicKey})[] = [
  // JMONEY Token Metadata (已修正 Image URL)
  {
    mint: new PublicKey('HZNnmhAY6xfq2iKRyBTEvTVeoTYJzpkK8mfnfG8Ppump'),
    name: 'JMONEY',
    symbol: 'JMONEY',
    // 注意：已移除開頭的 /，確保是有效的 URL
    image: 'https://i.ibb.co/BHqF7bqk/Pngtree-winter-solstice-festival-ancestor-chinese-3828589.png', 
    baseWager: 1e6,  // 假設 JMONEY 是 6 位小數
    decimals: 6,
    usdPrice: 0,
  },
]

// ===================================================================
// IV. 服務與 UI 設定
// ===================================================================

/** 服務條款 HTML (TOS) - 已更新為中文版 */
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
        { dollarBaseWager: 1 }, // 當無法獲得代幣的 baseWager 時，使用 $1 USD 作為預設
      )
    }
  }
)()

export const ENABLE_LEADERBOARD = true  // 是否開啟排行榜
export const ENABLE_TROLLBOX = false     // 是否開啟聊天室

/** 特色遊戲設定 */
export const FEATURED_GAME_INLINE = false  // 特色遊戲是否內嵌在儀表板上
export const FEATURED_GAME_ID: string | undefined = 'jackpot' // 要顯示的遊戲 ID，設為 undefined 則不顯示

