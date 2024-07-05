import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import * as userAPI from '../services/userAPI';
import renderPath from './helpers/renderPath';
import { defaultUser } from './mocks';

describe('9 - Crie a exibição de perfil', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.setItem('user', JSON.stringify(defaultUser));
  });

  afterEach(() => localStorage.clear());

  it('Será validado se a API getUser é usada para recuperar as informações da pessoa logada',
    async () => {
      const spy = vi.spyOn(userAPI, 'getUser');

      renderPath("/profile");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(spy).toBeCalled();
    });

  it('Será validado se as informações da pessoa logada são exibidas na tela',
    async () => {
      renderPath("/profile");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(screen.getAllByText('User Test')).toHaveLength(2);
      expect(screen.getByText('email@test.com')).toBeInTheDocument();
      expect(screen.getByText('Lorem ipsum')).toBeInTheDocument();
      expect(screen.getByTestId('profile-image')).toHaveAttribute('src', 'url-to-image');
    });

  it('Será validado se foi criado um link para a rota de edição de perfil com o texto Editar perfil',
    async () => {
      renderPath("/profile");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );
      const link = screen.getByText("Editar perfil");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/profile/edit');
    });
});
