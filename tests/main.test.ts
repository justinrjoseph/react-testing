import { it, expect, describe } from 'vitest';

import { Category } from '../src/entities';

describe('group', () => {
  it('should', async () => {
    const response = await fetch('/categories');

    const categories = await response.json() as Category[];
    console.log(categories);

    expect(categories.length).toBe(3);
  });
});