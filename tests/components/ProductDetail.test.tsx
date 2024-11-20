import { render } from '@testing-library/react';

import ProductDetail from '../../src/components/ProductDetail';

import { productsMock } from '../mocks/data';
import {findByText} from '../shared/helpers';

describe('ProductDetail', () => {
  describe('should render <x>', () => {
    it('<product details>', async () => {
      const id = 1;

      render(<ProductDetail productId={id} />);

      const product = productsMock.find((item) => item.id === id);

      expect(await findByText(product!.name)).toBeInTheDocument();
      expect(await findByText(`\\$${product!.price}`)).toBeInTheDocument();
    });

    it(`<messaging when product doesn't exist>`, async () => {
      render(<ProductDetail productId={productsMock.length + 1}/>);

      expect(await findByText('not found')).toBeInTheDocument();
    });

    describe(`<error>`, () => {
      it('when productId invalid', async () => {
        render(<ProductDetail productId={0}/>);

        expect(await findByText('invalid productid')).toBeInTheDocument();
      });

      it('when API call fails', async () => {
        render(<ProductDetail productId={-1} />);

        expect(await findByText('network down')).toBeInTheDocument();
      });
    });
  });
});