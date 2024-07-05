import {
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import * as userAPI from '../services/userAPI';
import renderPath from './helpers/renderPath';

describe('1 - Crie um formulário para identificação', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('Será validado se ao navegar para a rota /, o input e o botão especificados estão presentes',
    async () => {
      renderPath("/");

      expect(screen.getByTestId('login-name-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-submit-button')).toBeInTheDocument();
    });

  it('Será validado se o botão só é habilitado se o input de nome tiver 3 ou mais caracteres',
    async () => {
      renderPath("/");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      const loginNameInput: HTMLInputElement = screen.getByTestId('login-name-input');
      expect(loginNameInput).toBeInTheDocument();
      expect(loginNameInput.value).toBe('');

      const loginSubmitButton = screen.getByTestId('login-submit-button');
      expect(loginSubmitButton).toBeInTheDocument();
      expect(loginSubmitButton).toBeDisabled();

      userEvent.type(loginNameInput, 'N');
      expect(loginNameInput.value).toBe('N');
      expect(loginSubmitButton).toBeDisabled();

      userEvent.type(loginNameInput, 'a');
      expect(loginNameInput.value).toBe('Na');
      expect(loginSubmitButton).toBeDisabled();

      userEvent.type(loginNameInput, 'm');
      expect(loginNameInput.value).toBe('Nam');
      expect(loginSubmitButton).toBeEnabled();

      userEvent.type(loginNameInput, 'e');
      expect(loginNameInput.value).toBe('Name');
      expect(loginSubmitButton).toBeEnabled();
    });

  it('Será validado se ao clicar no botão habilitado, a função createUser da userAPI é chamada',
    async () => {
      const spy = vi.spyOn(userAPI, 'createUser');

      renderPath("/");

      userEvent.type(screen.getByTestId('login-name-input'), 'Name');
      userEvent.click(screen.getByTestId('login-submit-button'));

      expect(spy).toBeCalled();
    });

  it('Será validado se ao clicar no botão, a mensagem Carregando... é exibida e a informação do usuário é salva corretamente',
    async () => {
      renderPath("/");

      userEvent.type(screen.getByTestId('login-name-input'), 'Name');
      userEvent.click(screen.getByTestId('login-submit-button'));

      const loadingElement = screen.getByText('Carregando...');
      expect(loadingElement).toBeInTheDocument();

      await waitForElementToBeRemoved(
        () => screen.getAllByText('Carregando...'),
        { timeout: 3500 },
      );
      expect(loadingElement).not.toBeInTheDocument();

      const storedUserName = JSON.parse(localStorage.getItem('user') as string).name;
      expect(storedUserName).toBe('Name');
    });
});
