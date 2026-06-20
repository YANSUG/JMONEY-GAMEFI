import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useUserStore } from '../../hooks/useUserStore';

/* 燈籠搖曳動畫 */
const lanternSway = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

const glow = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

const WelcomeWrapper = styled.div`
  @keyframes welcome-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  background: linear-gradient(-45deg, #1a0a0a, #2d1f1f, #1a1a2e, #0a1a1a);
  background-size: 400% 400%;
  animation: welcome-fade-in 0.5s ease;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(251, 191, 36, 0.3);
  box-shadow: 
    0 0 30px rgba(220, 38, 38, 0.3),
    0 0 60px rgba(251, 191, 36, 0.1),
    inset 0 0 30px rgba(0, 0, 0, 0.5);

  /* 燈籠裝飾 */
  &::before {
    content: '🏮';
    position: absolute;
    top: 10px;
    left: 20px;
    font-size: 2rem;
    animation: ${lanternSway} 3s ease-in-out infinite;
  }
  
  &::after {
    content: '🏮';
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 2rem;
    animation: ${lanternSway} 3s ease-in-out infinite 0.5s;
  }

  @media (min-width: 800px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: center;
    text-align: left;
    padding: 40px;
    gap: 40px;
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
  
  h1 {
    font-size: 1.75rem;
    margin: 0 0 8px 0;
    color: #ffffff;
    text-shadow: 0 0 10px rgba(255, 71, 87, 0.5);
    
    /* 金色文字強調 */
    span.gold {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  p {
    font-size: 1rem;
    color: #ffffffd1;
    margin: 0;
    line-height: 1.5;
  }

  @media (min-width: 800px) {
    h1 {
      font-size: 2.5rem;
    }
    p {
      font-size: 1.125rem;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  position: relative;
  z-index: 1;

  @media (min-width: 800px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-grow: 1;
  text-align: center;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
  border: 1px solid rgba(251, 191, 36, 0.3);

  &:hover {
    background: linear-gradient(135deg, #ff4757, #dc2626);
    transform: translateY(-2px);
    box-shadow: 
      0 6px 20px rgba(255, 71, 87, 0.5),
      0 0 20px rgba(251, 191, 36, 0.3);
  }

  @media (min-width: 800px) {
    width: 100%;
    flex-grow: 0;
  }
`;

export function WelcomeBanner() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { set: setUserModal } = useUserStore();

  const handleCopyInvite = () => {
    setUserModal({ userModal: true });
    if (!wallet.connected) {
      walletModal.setVisible(true);
    }
  };

  const openLink = (url: string) => () => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <WelcomeWrapper>
      <WelcomeContent>
        <h1>
          歡迎來到 <span className="gold">金紙夜市</span> 🏮
        </h1>
        <p>
          台灣在地區塊鏈遊戲廣場 🎰
          <br />
          試試手氣，發財金滾滾來！
        </p>
      </WelcomeContent>
      <ButtonGroup>
        <ActionButton onClick={handleCopyInvite}>
          💰 領取彩金
        </ActionButton>
        <ActionButton onClick={openLink('https://v2.gamba.so/')}>
          🚀 添加流動性
        </ActionButton>
        <ActionButton onClick={openLink('https://discord.gg/HSTtFFwR')}>
          💬 加入社群
        </ActionButton>
      </ButtonGroup>
    </WelcomeWrapper>
  );
}
