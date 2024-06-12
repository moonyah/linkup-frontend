'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CommunityNav() {
  const [activeIcon, setActiveIcon] = useState('');
  const [hoverIcon, setHoverIcon] = useState('');
  const pathname = usePathname(); // useRouter 훅 추가

  useEffect(() => {
    setActiveIcon(getActiveIcon(pathname)); // router.pathname 사용하여 현재 경로 가져오기
  }, [pathname]); // URL이 변경될 때마다 useEffect 재실행

  // 현재 경로에 따라 활성화할 아이콘 반환하는 함수
  const getActiveIcon = (path: string) => {
    if (path === '/community' || path === '/community/') return 'home';
    if (path === '/community/coffeechat') return 'coffeechat';
    if (path === '/community/club/') return 'cow';
    if (path === '/community/collaboration') return 'collab';
    if (path === '/community/event') return 'event';
    return ''; // 기본값
  };

  const renderIcon = (
    iconName: string,
    iconSource: string,
    text: string,
    path: string,
  ) => {
    const isActive = iconName === 'cow' || activeIcon === iconName; // 'cow' 아이콘을 항상 활성화

    // const isActive = activeIcon === iconName;
    const isHover = hoverIcon === iconName;
    const isDisabled = [
      '/community',
      '/community/coffeechat',
      '/community/collaboration',
      '/community/event',
    ].includes(path);

    const iconProps = {
      className: `flex flex-col items-center w-[3.5rem] mx-[0.5rem] ${isDisabled ? 'cursor-not-allowed ' : 'cursor-pointer'}`,
      onMouseEnter: isDisabled ? undefined : () => setHoverIcon(iconName),
      onMouseLeave: isDisabled ? undefined : () => setHoverIcon(''),
      onClick: isDisabled ? undefined : () => setActiveIcon(iconName),
    };

    return (
      <div {...iconProps} key={iconName}>
        <img
          src={
            isActive || isHover
              ? `/svg/communityNav/${iconSource}Active.svg`
              : `/svg/communityNav/${iconSource}.svg`
          }
          alt={`${text} Icon`}
        />
        <span
          className={`text-[#8d8d9b] font-bold ${
            isActive || isHover
              ? 'text-black underline underline-offset-[0.5rem] decoration-1 box-border'
              : 'box-border'
          }`}
        >
          {text}
        </span>
      </div>
    );
  };

  return (
    <nav className="h-[3.75rem] flex items-center justify-center gap-y-px bg-blue-100">
      {renderIcon('home', 'homeIcon', '홈', '/community')}
      {renderIcon(
        'coffeechat',
        'coffeechatIcon',
        '컵챗',
        '/community/coffeechat',
      )}
      {renderIcon('cow', 'cowIcon', '소모임', '/community/club')}
      {renderIcon('collab', 'collabIcon', '협업', '/community/collaboration')}
      {renderIcon('event', 'eventIcon', '이벤트', '/community/event')}
    </nav>
  );
}
