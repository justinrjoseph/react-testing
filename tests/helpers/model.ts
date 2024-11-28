import { PrimaryKey } from '@mswjs/data/lib/primaryKey';
import { ManyOf, OneOf } from '@mswjs/data/lib/relations/Relation';

import { User } from '../../src/entities';

export type AuthStatus = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
}

export type Category = {
  id: PrimaryKey<number>;
  name: () => string;
  product: ManyOf<'product'>;
};
export type Product = {
  id: PrimaryKey<number>;
  categoryId: () => number;
  name: () => string;
  price: () => number;
  category: OneOf<'category'>;
};
