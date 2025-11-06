/* @vitest-environment jsdom */

import { ThemeProvider } from '@emotion/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import NotificationCard from '@/features/fcm/components/NotificationCard';
import { notify } from '@/pages/notifications/notify';
import { useFCMStore } from '@/stores/fcmStore';
import { theme } from '@/theme';

type Scenario = 'success' | 'server-error';

interface FcmScenarioController {
  __setFcmScenario?: (scenario: Scenario) => void;
}

const scenarioController = globalThis as typeof globalThis &
  FcmScenarioController;
const scenarioRef: { current: Scenario } = { current: 'success' };

const originalServiceWorker =
  'serviceWorker' in navigator ? navigator.serviceWorker : undefined;
const originalNotification =
  'Notification' in window ? window.Notification : undefined;

vi.mock('@/features/fcm/hooks/useFcmRegistration', () => {
  return {
    useFcmRegistration: () => {
      const [state, setState] = React.useState({
        token: null as string | null,
        enabled: false,
        enabling: false,
      });

      const enable = React.useCallback(async () => {
        if (state.enabling) {
          return false;
        }
        setState((prev) => ({ ...prev, enabling: true }));
        await Promise.resolve();

        if (scenarioRef.current === 'server-error') {
          setState((prev) => ({ ...prev, enabling: false }));
          notify.error(
            '알림 활성화에 실패했어요. 네트워크 상태를 확인해 주세요.',
          );
          return false;
        }

        const token = 'sample-token-1234567890-abcdef';
        setState({ token, enabled: true, enabling: false });
        notify.success('알림이 활성화되었어요.');
        return true;
      }, [state.enabling]);

      const disable = React.useCallback(async () => {
        setState((prev) => ({ ...prev, enabling: true }));
        await Promise.resolve();
        setState({ token: null, enabled: false, enabling: false });
        notify.info('알림이 비활성화되었어요.');
        return true;
      }, []);

      return {
        token: state.token,
        enabled: state.enabled,
        enabling: state.enabling,
        enable,
        disable,
      };
    },
  };
});

scenarioController.__setFcmScenario = (nextScenario: Scenario) => {
  scenarioRef.current = nextScenario;
};

const renderCard = () =>
  render(
    <ThemeProvider theme={theme}>
      <NotificationCard />
    </ThemeProvider>,
  );

describe('NotificationCard', () => {
  const success = vi
    .spyOn(notify, 'success')
    .mockImplementation(() => undefined);
  const error = vi.spyOn(notify, 'error').mockImplementation(() => undefined);
  const info = vi.spyOn(notify, 'info').mockImplementation(() => undefined);
  const warning = vi
    .spyOn(notify, 'warning')
    .mockImplementation(() => undefined);

  beforeEach(() => {
    success.mockClear();
    error.mockClear();
    info.mockClear();
    warning.mockClear();
    useFCMStore.setState({
      fcmToken: null,
      notificationPermission: 'default',
      isServiceWorkerRegistered: false,
      isNotificationEnabled: false,
    });
    localStorage.removeItem('fcm-storage');

    const serviceWorkerMock: Partial<ServiceWorkerContainer> = {
      register: vi.fn(() => Promise.resolve({} as ServiceWorkerRegistration)),
      ready: Promise.resolve({} as ServiceWorkerRegistration),
    };
    Object.defineProperty(navigator, 'serviceWorker', {
      value: serviceWorkerMock,
      configurable: true,
      writable: true,
    });

    Object.defineProperty(window, 'Notification', {
      value: class {
        static permission: NotificationPermission = 'granted';
        static requestPermission(): Promise<NotificationPermission> {
          return Promise.resolve('granted');
        }
      },
      configurable: true,
      writable: true,
    });

    scenarioController.__setFcmScenario?.('success');
  });

  afterAll(() => {
    success.mockRestore();
    error.mockRestore();
    info.mockRestore();
    warning.mockRestore();
    if (originalServiceWorker) {
      Object.defineProperty(navigator, 'serviceWorker', {
        value: originalServiceWorker,
        configurable: true,
        writable: true,
      });
    } else {
      Reflect.deleteProperty(navigator, 'serviceWorker');
    }
    if (originalNotification) {
      Object.defineProperty(window, 'Notification', {
        value: originalNotification,
        configurable: true,
        writable: true,
      });
    } else {
      Reflect.deleteProperty(window, 'Notification');
    }
    delete scenarioController.__setFcmScenario;
  });

  it('알림 활성화에 성공하면 토큰을 표시하고 토스트를 호출한다', async () => {
    renderCard();

    fireEvent.click(screen.getByRole('button', { name: '알림 허용' }));

    await waitFor(() => {
      expect(success).toHaveBeenCalledWith('알림이 활성화되었어요.');
    });

    const tokenEl = screen.getByLabelText('fcm-token');
    expect(tokenEl.textContent).toContain('…');
    expect(screen.getByRole('switch', { name: '알림 토글' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('알림 비활성화에 성공하면 토큰을 초기화하고 토스트를 호출한다', async () => {
    renderCard();

    fireEvent.click(screen.getByRole('button', { name: '알림 허용' }));
    await waitFor(() => expect(success).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: '알림 비활성화' }));

    await waitFor(() => {
      expect(info).toHaveBeenCalledWith('알림이 비활성화되었어요.');
    });
    expect(screen.getByRole('switch', { name: '알림 토글' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('토큰 복사를 성공적으로 수행한다', async () => {
    renderCard();

    fireEvent.click(screen.getByRole('button', { name: '알림 허용' }));
    await waitFor(() => expect(success).toHaveBeenCalled());

    const writeMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: writeMock } });

    fireEvent.click(screen.getByRole('button', { name: '토큰 복사' }));

    await waitFor(() => {
      expect(writeMock).toHaveBeenCalledWith('sample-token-1234567890-abcdef');
    });
    expect(success).toHaveBeenCalledWith('FCM 토큰이 복사되었습니다.');
  });

  it('서버 오류 시 알림을 비활성화하고 에러 토스트를 노출한다', async () => {
    scenarioController.__setFcmScenario?.('server-error');

    renderCard();

    fireEvent.click(screen.getByRole('button', { name: '알림 허용' }));

    await waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        '알림 활성화에 실패했어요. 네트워크 상태를 확인해 주세요.',
      );
    });
    expect(screen.getByRole('switch', { name: '알림 토글' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('지원되지 않는 환경에서는 대체 UI를 노출한다', () => {
    Reflect.deleteProperty(
      navigator as unknown as Record<string, unknown>,
      'serviceWorker',
    );
    Reflect.deleteProperty(
      window as unknown as Record<string, unknown>,
      'Notification',
    );

    renderCard();

    expect(screen.getAllByText('지원되지 않음')).toHaveLength(2);
    expect(
      screen.getByText('이 환경에서는 푸시 알림을 지원하지 않아요.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: '알림 토글' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '토큰 복사' })).toBeDisabled();
  });
});
