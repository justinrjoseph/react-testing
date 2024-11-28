import { Entity } from '@mswjs/data/lib/glossary';

import { User } from '../../src/entities';

import { db } from '../mock-server/db';

import { Category, Product } from './model';

export function mockUser({ isAdmin = false } = {}): User {
  return { name: 'Justin', isAdmin } as User;
}

export function mockCategory(): Entity<{category: Category;}, 'category'> {
  return db.category.create();
}

export function deleteMockCategories(ids: number[]): void {
  db.category.deleteMany({where: {id: {in: ids}}});
}

export function mockProduct(): Entity<{product: Product;}, 'product'> {
  return db.product.create();
}

export function deleteMockProducts(ids: number[]): void {
  db.product.deleteMany({where: {id: {in: ids}}});
}
