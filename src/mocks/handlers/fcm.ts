import { delay, http, HttpResponse } from 'msw';

type FcmTokenRequest = { token?: string };

const postToken = http.post<never, FcmTokenRequest>(
  '*/api/v1/fcm/token',
  async ({ request }) => {
    const body = ((await request.json().catch(() => ({}))) ??
      {}) as FcmTokenRequest;
    await delay(120);
    if (!body.token || body.token === 'fail') {
      return new HttpResponse('서버 오류', { status: 500 });
    }
    return HttpResponse.json('FCM 토큰이 저장되었습니다.');
  },
);

const deleteToken = http.delete('*/api/v1/fcm/token', async () => {
  await delay(80);
  return HttpResponse.json('FCM 토큰이 삭제되었습니다.');
});

export const fcmHandlers = [postToken, deleteToken];
