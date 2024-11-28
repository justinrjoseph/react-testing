import { Entity } from '@mswjs/data/lib/glossary';
import { PrimaryKey } from '@mswjs/data/lib/primaryKey';
import { ManyOf, OneOf } from '@mswjs/data/lib/relations/Relation';
import { screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';

import { delay, http, HttpResponse } from 'msw';

import { db } from '../mocks/db';
import { server } from '../mocks/server';

type Category = {
  id: PrimaryKey<number>;
  name: () => string;
  product: ManyOf<'product'>
}

type Product = {
  id: PrimaryKey<number>;
  categoryId: () => number;
  name: () => string;
  price: () => number;
  category: OneOf<'category'>
}

export function getHeading(): HTMLHeadingElement {
  return screen.getByRole('heading');
}

export function queryBtn(): HTMLButtonElement {
  return screen.queryByRole('button') as HTMLButtonElement;
}

export function findByText(content: string): Promise<HTMLElement> {
  return screen.findByText(new RegExp(content, 'i'));
}

export function queryCombobox(): HTMLElement | null {
  return screen.queryByRole('combobox');
}

export async function openCombobox(): Promise<void> {
  await mockUserEvent().click(queryCombobox()!);
}

export function mockUserEvent(): UserEvent {
  return userEvent.setup();
}

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

export function createCategory(): Entity<{ category: Category }, 'category'> {
  return db.category.create();
}

export function deleteCategories(ids: number[]): void {
  db.category.deleteMany({ where: { id: { in: ids } } });
}

export function createProduct(): Entity<{ product: Product }, 'product'> {
  return db.product.create();
}

export function deleteProducts(ids: number[]): void {
  db.product.deleteMany({ where: { id: { in: ids } } });
}