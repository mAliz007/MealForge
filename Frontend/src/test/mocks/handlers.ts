// frontend/src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Intercept standard authentications securely for tests later
  http.post('/api/v1/auth/login', async () => {
    return HttpResponse.json({
      user: { id: 'admin-101', email: 'admin@dining.com', role: 'ADMIN' },
      token: 'fake-jwt-token-string',
    }, { status: 200 });
  }),
];