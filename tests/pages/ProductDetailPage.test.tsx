import { waitForElementToBeRemoved } from '@testing-library/react';

import { deleteMockProduct, mockProduct } from '../helpers/data';
import { mockNavigation } from '../helpers/routing';
import { getByText, getHeading, queryByText } from '../helpers/template';

describe('ProductDetailPage', () => {
  it('should render product details', async () => {
    const product = mockProduct();

    mockNavigation(`products/${product.id}`);

    await waitForElementToBeRemoved(() => queryByText(/loading/i));

    expect(getHeading(product.name)).toBeInTheDocument();
    expect(getByText(`$${product.price}`)).toBeInTheDocument();

    deleteMockProduct(product.id);
  });
});