import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';
import { faker } from '@faker-js/faker';

export const db = factory({
  category: {
    id: primaryKey(() => faker.number.int()),
    name: () => faker.commerce.department(),
    product: manyOf('product')
  },
  product: {
    id: primaryKey(() => faker.number.int()),
    categoryId: () => faker.number.int(),
    name: () => faker.commerce.productName(),
    price: () => faker.number.int({ min: 1, max: 100 }),
    category: oneOf('category')
  }
});