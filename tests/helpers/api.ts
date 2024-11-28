import { delay, http, HttpResponse } from 'msw';

import { server } from '../mock-server';

export function mockEmptyResponse(endpoint: 'categories' | 'products'): void {
  server.use(http.get(`${endpoint}`, () => HttpResponse.json([])));
}

export function mockApiDelay(endpoint: 'categories' | 'products'): void {
  server.use(http.get(`/${endpoint}`, async () => {
    await delay();
    return HttpResponse.json([]);
  }));
}

export function mockApiError(endpoint: 'categories' | 'products' | `products/${number}`):void {
  server.use(http.get(`/${endpoint}`, () => HttpResponse.error()))
}