import { http, HttpResponse } from 'msw';

import { productsMock } from './data';

export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json([
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Beauty' },
      { id: 3, name: 'Gardening' },
    ])
  }),
  http.get('/products', () => {
    return HttpResponse.json(productsMock)
  }),
  http.get('/products/:id', ({ params }) => {
    const id = +params.id;

    if (id === -1) return HttpResponse.error();

    if (!id) return new HttpResponse(null, { status: 404 });

    const product = productsMock.find((item) => item.id === id)

    return HttpResponse.json(product || null);
  })
];