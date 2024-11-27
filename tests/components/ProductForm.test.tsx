import { render, screen } from '@testing-library/react';

import toast, {Toaster} from 'react-hot-toast';

import ProductForm from '../../src/components/ProductForm';
import { Category, Product } from '../../src/entities';

import AllProviders from '../AllProviders';
import { db } from '../mocks/db';
import { mockUserEvent, openCombobox, queryBtn } from '../shared/helpers';

describe('ProductForm', () => {
  let category: Category;
  let product: Product;

  const name = 'a';
  const price = '10';

  const onSubmitMock = vi.fn();

  beforeAll(() => {
    category = db.category.create();
    const { id: categoryId } = category;

    product = db.product.create({ categoryId });
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  async function renderComponent(product?: Product): Promise<void> {
    render(
      <>
        <ProductForm product={product} onSubmit={onSubmitMock} />
        <Toaster />
      </>
    , { wrapper: AllProviders });

    await screen.findByRole('form');
  }

  type FormData = { [K in keyof Partial<Product>]: string }

  async function fillOutAndSubmitForm({ name, price }: FormData): Promise<void> {
    await renderComponent();

    const userEvent = mockUserEvent();

    name && await userEvent.type(getNameInput(), name);
    price && await userEvent.type(getPriceInput(), price);

    await userEvent.tab();
    await openCombobox();

    const options = screen.getAllByRole('option');

    await userEvent.click(options.at(0)!);

    await userEvent.click(queryBtn());
  }

  function getNameInput(): HTMLElement {
    return screen.getByPlaceholderText(/name/i);
  }

  function getPriceInput(): HTMLElement {
    return screen.getByPlaceholderText(/price/i);
  }

  function getCategoriesDropdown(): HTMLElement {
    return screen.getByRole('combobox', { name: /category/i });
  }

  it('should render inputs', async () => {
    await renderComponent();

    expect(getNameInput()).toBeInTheDocument();
    expect(getPriceInput()).toBeInTheDocument();
    expect(getCategoriesDropdown()).toBeInTheDocument();
  });

  it('should focus first input', async () => {
    await renderComponent();

    expect(getNameInput()).toHaveFocus();
  });

  it('should pre-fill inputs when product being edited', async () => {
    await renderComponent(product);

    expect(getNameInput()).toHaveValue(product.name);
    expect(getPriceInput()).toHaveValue(`${product.price}`);
    expect(getCategoriesDropdown()).toHaveTextContent(category.name);
  });

  describe('--- validation-related ---', () => {
    function validateError(error: RegExp): void {
      expect(screen.getByRole('alert')).toHaveTextContent(error);
    }

    describe('should render an error if <x> <y>', () => {
      describe('<x: name>', () => {
        it.each([
          {
            scenario: 'is missing',
            error: /name|required/i,
          },
          {
            scenario: 'exceeds max length',
            name: name.repeat(256),
            error: /name|character\(s\)/i,
          }
        ])('<y: $scenario>', async ({ name, error }) => {
          await fillOutAndSubmitForm({ name, price });

          validateError(error);
        });
      });

      describe('<x: price>', () => {
        it.each([
          {
            scenario: 'is missing',
            error: /price|required/i,
          },
          {
            scenario: 'is not a number',
            error: /price|required/i,
          },
          {
            scenario: 'is 0',
            price: '0',
            error: /greater|equal|1/i,
          },
          {
            scenario: 'is negative',
            price: '-1',
            error: /greater|equal|1/i,
          },
          {
            scenario: 'exceeds 1000',
            price: '1001',
            error: /less than|equal|1000/i,
          }
        ])('<y: $scenario>', async ({ price, error }) => {
          await fillOutAndSubmitForm({ name, price });

          validateError(error);
        });
      });
    });
  });

  describe('--- submission-related ---', () => {
    afterEach(() => {
      const { id: categoryId } = category;

      expect(onSubmitMock).toHaveBeenCalledWith({
        name,
        price: +price,
        categoryId
      });
    });

    it('should submit successfully', async () => {
      await fillOutAndSubmitForm({ name, price });
    });

    it('should handle failed submission', async () => {
      onSubmitMock.mockRejectedValue({});

      vi.spyOn(toast, 'error');

      await fillOutAndSubmitForm({ name, price });

      expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred");

      expect(screen.getByRole('status')).toHaveTextContent(/unexpected error/i);
    });
  });

  describe('should <x> submit button post-submission', () => {
    it('<disable>', async () => {
      onSubmitMock.mockReturnValue(new Promise(() => {}));

      await fillOutAndSubmitForm({ name, price });

      expect(queryBtn()).toBeDisabled();
    });

    describe('<re-enable>', () => {
      afterEach(async () => {
        await fillOutAndSubmitForm({ name, price });

        expect(queryBtn()).toBeEnabled();
      });

      it('which succeeded', () => {
        onSubmitMock.mockReturnValue({});
      });

      it('which failed', () => {
        onSubmitMock.mockRejectedValue({});
      });
    });
  });
});