import {
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { vi } from 'vitest';

import * as userAPI from '../services/userAPI';
import * as musicsAPI from '../services/musicsAPI';
import renderPath from './helpers/renderPath';
import { defaultUser, musicAPIDefaultResponse } from './mocks';

describe('4 - Crie um componente de cabeçalho', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(defaultUser));
    localStorage.setItem('favorite_songs', JSON.stringify([]));
    vi.restoreAllMocks();
  });

  afterEach(() => localStorage.clear());

  it('Será validado se o Layout do componente Header é renderizado corretamente utilizando mock no outlet', async () => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual<any>('react-router-dom');
      return {
        ...actual,
        Outlet: () => <div data-testid="outlet-mockada" />,
      }
    });
  
    renderPath("/search");

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    expect(screen.getByTestId('outlet-mockada')).toBeInTheDocument();
    expect(screen.queryByTestId('search-artist-input')).not.toBeInTheDocument();
  });

  it('Será validado se o componente Header não é renderizado na página /',
    async () => {
      renderPath("/");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(screen.queryByTestId("header-component")).not.toBeInTheDocument();
    });

  it('Será validado se o componente Header é renderizado na página /search',
    async () => {
      renderPath("/search");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(screen.getByTestId("header-component")).toBeInTheDocument();
    });

  it('Será validado se o componente Header é renderizado na página /album/:id',
    async () => {
      vi.spyOn(musicsAPI, 'default').mockImplementation(
        () => Promise.resolve(musicAPIDefaultResponse) as any,
      );
      renderPath("/album/123");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(screen.getByTestId("header-component")).toBeInTheDocument();
    });

  it('Será validado se a função getUser é chamada ao renderizar o componente',
    async () => {
      const spy = vi.spyOn(userAPI, 'getUser');
      renderPath("/search");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(spy).toHaveBeenCalled();
    });

  it('Será validado se a mensagem de Carregando... é exibida ao renderizar o componente e é removida após o retorno da API',
    async () => {
      renderPath("/search");

      expect(screen.getByText('Carregando...')).toBeInTheDocument();

      await waitForElementToBeRemoved(
        () => screen.getAllByText('Carregando...'),
        { timeout: 3000 },
      );

      expect(screen.queryAllByText("Carregando...")).toHaveLength(0);
    });

  it('Será validado se o nome da pessoa usuária está presente na tela após o retorno da API',
    async () => {
      renderPath("/search");

      await waitForElementToBeRemoved(
        () => screen.getAllByText('Carregando...'),
        { timeout: 3000 },
      );

      const headerUserName = screen.getByTestId('header-user-name');
      expect(headerUserName).toBeInTheDocument();

      expect(headerUserName.textContent).toContain('User Test');
    });

  it('Será validado se os links de navegação são exibidos na página de pesquisa',
    async () => {
      renderPath("/search");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      const linkToSearch = screen.getByTestId('link-to-search');
      expect(linkToSearch).toBeInTheDocument();
      expect(linkToSearch).toHaveAttribute('href', '/search');

      const linkToFavorites = screen.getByTestId('link-to-favorites');
      expect(linkToFavorites).toBeInTheDocument();
      expect(linkToFavorites).toHaveAttribute('href', '/favorites');

      const linkToProfile = screen.getByTestId('link-to-profile');
      expect(linkToProfile).toBeInTheDocument();
      expect(linkToProfile).toHaveAttribute('href', '/profile');
    });
});
