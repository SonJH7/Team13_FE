import { useCallback, useMemo } from 'react';

import { useFcmRegistration } from '@/features/fcm/hooks/useFcmRegistration';
import { notify } from '@/pages/notifications/notify';

import * as S from './NotificationCard.styled';

const sliceToken = (token?: string | null, length = 28) => {
  if (!token) {
    return '';
  }
  if (token.length <= length) {
    return token;
  }
  const half = Math.floor(length / 2);
  return `${token.slice(0, half)}…${token.slice(-half)}`;
};

const toErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }
  return fallback;
};

function NotificationCardContent() {
  const { token, enabled, enabling, enable, disable } = useFcmRegistration();

  const statusText = useMemo(
    () => (enabled ? '알림 ON' : '알림 OFF'),
    [enabled],
  );

  const handleToggle = useCallback(() => {
    if (enabled) {
      void disable();
      return;
    }
    void enable();
  }, [disable, enable, enabled]);

  const copyToken = useCallback(async () => {
    if (!token) {
      notify.warning('복사할 FCM 토큰이 없어요. 알림을 먼저 활성화해 주세요.');
      return;
    }

    const clipboard = navigator.clipboard;
    if (!clipboard || typeof clipboard.writeText !== 'function') {
      notify.error(
        '복사 기능을 사용할 수 없어요. 브라우저 권한을 확인해 주세요.',
      );
      return;
    }

    try {
      await clipboard.writeText(token);
      notify.success('FCM 토큰이 복사되었습니다.');
    } catch (error: unknown) {
      const message = toErrorMessage(
        error,
        '복사에 실패했어요. 브라우저 권한을 확인해 주세요.',
      );
      notify.error(message);
    }
  }, [token]);

  const handleCopyClick = useCallback(() => {
    void copyToken();
  }, [copyToken]);

  const handleEnableClick = useCallback(() => {
    void enable();
  }, [enable]);

  const handleDisableClick = useCallback(() => {
    void disable();
  }, [disable]);

  return (
    <S.Card aria-label="notification-settings">
      <S.Header>
        <S.Title>알림 설정</S.Title>
        <S.Row>
          <S.StatusDot data-state={enabled ? 'on' : 'off'} aria-hidden="true" />
          <S.Muted aria-live="polite">{statusText}</S.Muted>
          <S.Switch
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label="알림 토글"
            onClick={handleToggle}
            data-state={enabled ? 'on' : 'off'}
            disabled={enabling}
          >
            {enabled ? '끄기' : '켜기'}
          </S.Switch>
        </S.Row>
      </S.Header>

      <S.Body>
        <S.Row>
          <S.Muted>디바이스 토큰</S.Muted>
          <S.Code aria-label="fcm-token">{sliceToken(token)}</S.Code>
          <S.Ghost
            type="button"
            onClick={handleCopyClick}
            disabled={!token || enabling}
            aria-label="토큰 복사"
          >
            복사
          </S.Ghost>
        </S.Row>

        <S.Live role="status" aria-live="polite" aria-atomic="true">
          {enabling
            ? '설정 중…'
            : enabled
              ? '포그라운드 알림을 수신합니다.'
              : '알림이 비활성화되어 있어요.'}
        </S.Live>
      </S.Body>

      <S.Actions>
        {!enabled ? (
          <S.Primary
            type="button"
            onClick={handleEnableClick}
            disabled={enabling}
            aria-label="알림 허용"
          >
            알림 허용
          </S.Primary>
        ) : (
          <S.Ghost
            type="button"
            onClick={handleDisableClick}
            disabled={enabling}
            aria-label="알림 비활성화"
          >
            알림 해제
          </S.Ghost>
        )}
      </S.Actions>
    </S.Card>
  );
}

function NotificationCardUnsupported() {
  return (
    <S.Card aria-label="notification-settings">
      <S.Header>
        <S.Title>알림 설정</S.Title>
        <S.Row>
          <S.StatusDot data-state="off" aria-hidden="true" />
          <S.Muted aria-live="polite">지원되지 않음</S.Muted>
          <S.Switch
            type="button"
            role="switch"
            aria-checked={false}
            aria-label="알림 토글"
            data-state="off"
            disabled
          >
            사용 불가
          </S.Switch>
        </S.Row>
      </S.Header>

      <S.Body>
        <S.Row>
          <S.Muted>디바이스 토큰</S.Muted>
          <S.Code aria-label="fcm-token" />
          <S.Ghost type="button" disabled aria-label="토큰 복사">
            복사
          </S.Ghost>
        </S.Row>

        <S.Live role="status" aria-live="polite" aria-atomic="true">
          이 환경에서는 푸시 알림을 지원하지 않아요.
        </S.Live>
      </S.Body>

      <S.Actions>
        <S.Ghost type="button" disabled aria-label="알림 비활성화">
          지원되지 않음
        </S.Ghost>
      </S.Actions>
    </S.Card>
  );
}

export default function NotificationCard() {
  const isBrowser = typeof window !== 'undefined';
  const isSupported =
    isBrowser && 'Notification' in window && 'serviceWorker' in navigator;

  if (!isSupported) {
    return <NotificationCardUnsupported />;
  }

  return <NotificationCardContent />;
}
