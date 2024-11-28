import { render, RenderResult } from '@testing-library/react';

import Label from '../../src/components/Label';
import en from "../../src/providers/language/data/en.json";
import es from "../../src/providers/language/data/es.json";
import { LanguageProvider } from '../../src/providers/language/LanguageProvider';
import { Language } from '../../src/providers/language/type';

import { getByText } from '../helpers/template';

const languages:[Language, Language] = ['en', 'es'];

const english = en as { [key: string]: string };
const spanish = es as { [key: string]: string };

const englishLabels = Object.keys(english)
  .map((key) => ({ key, label: english[key], language: languages.at(0)! }));

const spanishLabels = Object.keys(spanish)
  .map((key) => ({ key, label: spanish[key], language: languages.at(1)! }))

describe('Label', () => {
  function renderComponent({ key = '', language }:{ key?: string; language: Language }): RenderResult {
    return render(
      <LanguageProvider language={language}>
        <Label labelId={key} />
      </LanguageProvider>
    );
  }

  describe('should render', () => {
    describe('<x> (EN)', () => {
      it.each(englishLabels)('<$label>', ({ key, label, language }) => {
        renderComponent({ key, language });

        expect(getByText(label)).toBeInTheDocument();
      });
    });

    describe('<x> (ES)', () => {
      it.each(spanishLabels)('<$label>', ({ key, label, language }) => {
        renderComponent({ key, language });

        expect(getByText(label)).toBeInTheDocument();
      });
    });

    describe('should throw an error for invalid <x> label', () => {
      it.each(languages)('<%s>', (language) => {
        expect(() => renderComponent({ language })).toThrowError()
      });
    });
  });
});