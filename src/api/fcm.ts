import { apiClient } from '@/api/core/axiosInstance';
import type { FcmTokenRequest } from '@/types/fcm.types';

/** 서버에 FCM 토큰 등록 */
export const registerFcmToken = async (token: string) => {
  const payload: FcmTokenRequest = { token };
  const { data } = await apiClient.post<string>('/api/v1/fcm/token', payload);
  return data;
};

/** 서버에서 FCM 토큰 삭제 */
export const deleteFcmToken = async () => {
  const { data } = await apiClient.delete<string>('/api/v1/fcm/token');
  return data;
};
