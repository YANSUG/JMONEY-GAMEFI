// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useGambaPlatformContext,
  useUserBalance,
} from 'gamba-react-ui-v2';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Modal } from '../components/Modal';
import LeaderboardsModal from '../sections/LeaderBoard/LeaderboardsModal';
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_ADDRESS } from '../constants';
import { useMediaQuery } from '../hooks/useMediaQuery';
import TokenSelect from './TokenSelect';
import { UserButton } from './UserButton';
import { ENABLE_LEADERBOARD } from '../constants';

/* 燈籠搖曳動畫 */
const lanternSway = keyframes`
  0%, 100% { transform: rotate(-2deg) scale(1.05); }
  50% { transform: rotate(2deg) scale(1.1); }
`;

/* 彩池閃爍 */
const jackpotGlow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 5px #fbbf24, 0 0 10px #f59e0b;
  }
  50% { 
    text-shadow: 0 0 10px #fbbf24, 0 0 20px #f59e0b, 0 0 30px #fbbf24;
  }
`;

const Bonus = styled.button`
  all: unset;
  cursor: pointer;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  transition: all 0.2s;
  
  /* 彩池按鈕 - 金色 */
  &.jackpot {
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.15);
    border: 1px solid rgba(251, 191, 36, 0.3);
    animation: ${jackpotGlow} 2s ease-in-out infinite;
  }
  
  /* 獎金按鈕 - 粉紅 */
  &.bonus {
    color: #ff6b9d;
    background: rgba(255, 107, 157, 0.15);
    border: 1px solid rgba(255, 107, 157, 0.3);
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 15px;
  background: linear-gradient(180deg, rgba(10, 10, 15, 0.98) 0%, rgba(26, 26, 46, 0.95) 100%);
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom: 2px solid rgba(220, 38, 38, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
`;

const Logo = styled(NavLink)`
  height: 38px;
  margin: 0 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  & > img {
    height: 100%;
  }
  
  /* Logo 文字 */
  & > .logo-text {
    font-size: 1.2rem;
    font-weight: bold;
    background: linear-gradient(135deg, #ff4757, #fbbf24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
    
    @media (max-width: 600px) {
      display: none;
    }
  }
`;

/* 燈籠裝飾 */
const Lantern = styled.span`
  font-size: 1.5rem;
  animation: ${lanternSway} 3s ease-in-out infinite;
  display: inline-block;
`;

export default function Header() {
  const pool = useCurrentPool();
  const context = useGambaPlatformContext();
  const balance = useUserBalance();
  const isDesktop = useMediaQuery('lg');
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);
  const [bonusHelp, setBonusHelp] = React.useState(false);
  const [jackpotHelp, setJackpotHelp] = React.useState(false);

  return (
    <>
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>獎金 ✨</h1>
          <p>
            你有 <b><TokenValue amount={balance.bonusBalance} /></b> 的免費遊戲次數。
            這些獎金會在你遊戲時自動使用。
          </p>
          <p>注意：每次遊戲仍需要從你的錢包扣除少量手續費。</p>
        </Modal>
      )}

      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>彩池 💰</h1>
          <p style={{ fontWeight: 'bold' }}>
            目前彩池累積 <TokenValue amount={pool.jackpotBalance} />！
          </p>
          <p>
            彩池會隨著每次下注而增加。當有人中獎後，彩池會重置並重新開始累積。
          </p>
          <p>
            每次下注最多支付{' '}
            {(PLATFORM_JACKPOT_FEE * 100).toLocaleString(undefined, { maximumFractionDigits: 4 })}
            % 的彩池費用，就有機會贏得大獎！
          </p>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {context.defaultJackpotFee === 0 ? '關閉' : '開啟'}
            <GambaUi.Switch
              checked={context.defaultJackpotFee > 0}
              onChange={(checked) =>
                context.setDefaultJackpotFee(checked ? PLATFORM_JACKPOT_FEE : 0)
              }
            />
          </label>
        </Modal>
      )}

      {ENABLE_LEADERBOARD && showLeaderboard && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS.toBase58()}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      <StyledHeader>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Logo to="/">
            <img alt="金紙夜市 logo" src="/logo.svg" />
            <span className="logo-text">金紙夜市</span>
          </Logo>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {pool.jackpotBalance > 0 && (
            <Bonus 
              className="jackpot" 
              onClick={() => setJackpotHelp(true)}
              title="點擊查看彩池詳情"
            >
              💰 <TokenValue amount={pool.jackpotBalance} />
            </Bonus>
          )}

          {balance.bonusBalance > 0 && (
            <Bonus 
              className="bonus" 
              onClick={() => setBonusHelp(true)}
              title="點擊查看獎金詳情"
            >
              ✨ <TokenValue amount={balance.bonusBalance} />
            </Bonus>
          )}

          {isDesktop && (
            <GambaUi.Button 
              onClick={() => setShowLeaderboard(true)}
              style={{
                background: 'linear-gradient(135deg, #1a1a2e, #2a2a4e)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              排行榜
            </GambaUi.Button>
          )}

          <TokenSelect />
          <UserButton />
        </div>
      </StyledHeader>
    </>
  );
}
