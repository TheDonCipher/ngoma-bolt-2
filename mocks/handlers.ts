import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth handlers
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: '1',
        address: '0x123',
        role: 'FAN',
      },
    });
  }),

  // User profile handlers
  http.get('/api/profile', () => {
    return HttpResponse.json({
      username: 'testuser',
      bio: 'Test bio',
      avatarUrl: 'https://example.com/avatar.jpg',
    });
  }),

  // Search handlers
  http.get('/api/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    
    return HttpResponse.json({
      items: [
        {
          id: '1',
          title: `Result for ${query}`,
          type: 'track',
        },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
      hasMore: false,
    });
  }),

  // Notification handlers
  http.get('/api/notifications', () => {
    return HttpResponse.json({
      items: [
        {
          id: '1',
          type: 'TRACK_RELEASE',
          title: 'New Track Released',
          message: 'Check out the new track!',
          timestamp: new Date().toISOString(),
          read: false,
        },
      ],
      total: 1,
    });
  }),
];
