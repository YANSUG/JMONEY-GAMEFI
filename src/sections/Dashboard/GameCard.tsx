// src/components/GameCard.tsx
import React from 'react';
import { GameBundle } from 'gamba-react-ui-v2';
import { NavLink, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

/* 霓虹閃爍動畫 */
const neonFlicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
  75% { opacity: 0.95; }
`;

/* 燈光閃爍 */
const lightBlink = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(255, 71, 87, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 71, 87, 0.8), 0 0 30px rgba(251, 191, 36, 0.4); }
`;

const tileAnimation = keyframes`
  0% { background-position: -100px 100px; }
  100% { background-position: 100px -100px; }
`;

const StyledGameCard = styled(NavLink)<{ $small: boolean; $background: string }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  pointer-events: auto;

  width: 100%;
  aspect-ratio: ${({ $small }) => ($small ? '1/.5' : '1/.6')};
  background: ${({ $background }) => $background};
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 24px;
  transition: all 0.3s ease;

  /* 夜市攤位邊框效果 */
  border: 3px solid rgba(251, 191, 36, 0.4);
  box-shadow: 
    0 0 15px rgba(220, 38, 38, 0.3),
    0 0 30px rgba(251, 191, 36, 0.1),
    inset 0 0 20px rgba(0, 0, 0, 0.3);

  & > .background,
  & > .image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  & > .background {
    background-image: url(/stuff.png);
    background-size: 100%;
    background-repeat: repeat;
    animation: ${tileAnimation} 5s linear infinite;
    opacity: 0;
  }

  & > .image {
    background-size: 80% auto;
    background-position: center;
    background-repeat: no-repeat;
    transform: scale(0.9);
  }

  & > .play {
    position: absolute;
    bottom: 8px;
    right: 8px;
    padding: 6px 12px;
    font-size: 13px;
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    border-radius: 6px;
    text-transform: uppercase;
    opacity: 0;
    backdrop-filter: blur(20px);
    transition: all 0.2s ease;
    border: 1px solid rgba(251, 191, 36, 0.5);
    font-weight: bold;
  }

  &:hover {
    transform: scale(1.03) translateY(-3px);
    border-color: rgba(255, 71, 87, 0.8);
    outline: none;
    animation: ${lightBlink} 1s ease-in-out infinite;
    
    & > .background {
      opacity: 0.4;
    }
    & > .image {
      transform: scale(1);
    }
    & > .play {
      opacity: 1;
      background: linear-gradient(135deg, #ff4757, #dc2626);
    }
  }
`;

/* VS / 特色標籤 */
const Tag = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: bold;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #fff;
  border-radius: 6px;
  text-transform: uppercase;
  z-index: 2;
  border: 1px solid rgba(251, 191, 36, 0.5);
  box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
  
  /* 夜市標籤閃爍 */
  animation: ${neonFlicker} 2s ease-in-out infinite;
`;

/* 攤位名稱裝飾 */
const StallName = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.8);
`;

export function GameCard({
  game,
}: {
  game: GameBundle & { meta: { tag?: string; [key: string]: any } };
}) {
  const small = useLocation().pathname !== '/';

  return (
    <StyledGameCard
      to={`/${game.id}`}
      $small={small}
      $background={game.meta.background}
    >
      {game.meta.tag && <Tag>{game.meta.tag}</Tag>}
      <div className="background" />
      <div
        className="image"
        style={{ backgroundImage: `url(${game.meta.image})` }}
      />
      <div className="play">開始玩</div>
      <StallName>{game.meta.name}</StallName>
    </StyledGameCard>
  );
}
