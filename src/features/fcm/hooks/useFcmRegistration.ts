import { isAxiosError } from 'axios';
import { useCallback, useMemo, useState } from 'react';

import { deleteFcmToken, registerFcmToken } from '@/api/fcm';
import { useFCM } from '@/hooks/useFCM';
import type { FCMToken } from '@/libs/firebase/types';
import { notify } from '@/pages/notifications/notify';
import { useFCMStore } from '@/stores/fcmStore';
import type { FCMState } from '@/types/fcm.types';

type StoreSlice = Pick<
  FCMState,
  | 'fcmToken'
  | 'isNotificationEnabled'
  | 'setNotificationEnabled'
  | 'setFCMToken'
>;

interface UseFcmRegistrationResult {
  token: FCMToken | null;
  enabled: boolean;
  enabling: boolean;
  enable: () => Promise<boolean>;
  disable: () => Promise<boolean>;
}

const toErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError<string>(error)) {
    const responseMessage = error.response?.data;
    if (
      typeof responseMessage === 'string' &&
      responseMessage.trim().length > 0
    ) {
      return responseMessage;
    }
    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  return fallback;
};

export const useFcmRegistration = (): UseFcmRegistrationResult => {
  const {
    requestPermissionAndToken,
    disableNotifications,
    fcmToken: latestToken,
    error: fcmError,
  } = useFCM();
  const storeSlice = useFCMStore((state) => ({
    fcmToken: state.fcmToken,
    isNotificationEnabled: state.isNotificationEnabled,
    setNotificationEnabled: state.setNotificationEnabled,
    setFCMToken: state.setFCMToken,
  })) satisfies StoreSlice;
  const {
    fcmToken,
    isNotificationEnabled,
    setNotificationEnabled,
    setFCMToken,
  } = storeSlice;
  const [submitting, setSubmitting] = useState(false);

  const enable = useCallback(async () => {
    if (submitting) {
      return false;
    }
    setSubmitting(true);
    try {
      const token = await requestPermissionAndToken();
      if (!token) {
        setNotificationEnabled(false);
        setFCMToken(null);
        const message = toErrorMessage(
          fcmError,
          '알림 권한이 거부되었어요. 브라우저 설정에서 권한을 허용해 주세요.',
        );
        if (message.includes('거부')) {
          notify.warning(message);
        } else {
          notify.error(message);
        }
        return false;
      }

      await registerFcmToken(token);
      setNotificationEnabled(true);
      setFCMToken(token);
      notify.success('알림이 활성화되었어요.');
      return true;
    } catch (error: unknown) {
      setNotificationEnabled(false);
      setFCMToken(null);
      try {
        await Promise.resolve(disableNotifications());
      } catch (disableError: unknown) {
        console.error(
          'Failed to disable foreground notifications after error:',
          disableError,
        );
      }
      const message = toErrorMessage(
        error,
        '알림 활성화에 실패했어요. 네트워크 상태를 확인해 주세요.',
      );
      notify.error(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [
    disableNotifications,
    fcmError,
    requestPermissionAndToken,
    setFCMToken,
    setNotificationEnabled,
    submitting,
  ]);

  const disable = useCallback(async () => {
    if (submitting) {
      return false;
    }
    setSubmitting(true);
    try {
      await deleteFcmToken();
      setNotificationEnabled(false);
      setFCMToken(null);
      await Promise.resolve(disableNotifications());
      notify.info('알림이 비활성화되었어요.');
      return true;
    } catch (error: unknown) {
      const message = toErrorMessage(
        error,
        '알림 비활성화에 실패했어요. 잠시 후 다시 시도해 주세요.',
      );
      notify.error(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [disableNotifications, setFCMToken, setNotificationEnabled, submitting]);

  return useMemo(
    () => ({
      token: latestToken ?? fcmToken,
      enabled: isNotificationEnabled,
      enabling: submitting,
      enable,
      disable,
    }),
    [disable, enable, fcmToken, isNotificationEnabled, latestToken, submitting],
  );
};
