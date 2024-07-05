import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import renderPath from './helpers/renderPath';
import { defaultUser, searchAlbumDefaultResponse } from './mocks';

import * as searchAlbumsAPI from '../services/searchAlbumsAPI';

describe('2 - Crie o formulário para pesquisar artistas', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(defaultUser));
    vi.restoreAllMocks();
  });

  afterEach(() => localStorage.clear());

  it('Será validado se ao navegar para a rota /search, o input e o botão estão presentes na tela',
    async () => {
      renderPath("/");

      userEvent.type(screen.getByTestId('login-name-input'), 'Name');
      userEvent.click(screen.getByTestId('login-submit-button'));

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 6000 }
      );

      expect(screen.getByTestId('search-artist-input')).toBeInTheDocument();
      expect(screen.getByTestId('search-artist-button')).toBeInTheDocument();
    });

  it('Será validado se o botão está habilitado somente se o input de nome tiver 2 ou mais caracteres',
    async () => {
      renderPath("/search");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      const searchArtistInput: HTMLInputElement = screen.getByTestId('search-artist-input');
      expect(searchArtistInput).toBeInTheDocument();
      expect(searchArtistInput.value).toBe('');

      const searchArtistButton = screen.getByTestId('search-artist-button');
      expect(searchArtistButton).toBeInTheDocument();
      expect(searchArtistButton).toBeDisabled();

      userEvent.type(searchArtistInput, 'U');
      expect(searchArtistInput.value).toBe('U');
      expect(searchArtistButton).toBeDisabled();

      userEvent.type(searchArtistInput, '2');
      expect(searchArtistInput.value).toBe('U2');
      expect(searchArtistButton).toBeEnabled();
    });

  it('Será validado se ao clicar em pesquisar, a requisição é feita usando a searchAlbumsAPI', async () => {
    const spy = vi
      .spyOn(searchAlbumsAPI, 'default')
      .mockImplementation(() => Promise.resolve([]));
    renderPath('/search');

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    userEvent.type(screen.getByTestId('search-artist-input'), 'Artist Name');
    userEvent.click(screen.getByTestId('search-artist-button'));

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    expect(spy).toBeCalledWith('Artist Name');
  });

  it('Será validado se ao clicar no botão, o texto Resultado de álbuns de: <artista> aparece na tela e o input é limpo', async () => {
    vi
      .spyOn(searchAlbumsAPI, 'default')
      .mockImplementation(() => Promise.resolve(searchAlbumDefaultResponse));
    renderPath('/search');

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    const searchArtistInput = screen.getByTestId('search-artist-input');

    userEvent.type(searchArtistInput, 'U2');
    userEvent.click(screen.getByTestId('search-artist-button'));

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    const searchMessage = await screen.findByText(/Resultado de álbuns de: U2/i);

    expect(searchMessage).toBeInTheDocument();
    expect((screen.getByTestId('search-artist-input') as HTMLInputElement).value).toBe('');
  });

  it('Será validado se ao receber o retorno da API, os álbuns são listados na tela', async () => {
    vi
      .spyOn(searchAlbumsAPI, 'default')
      .mockImplementation(() => Promise.resolve(searchAlbumDefaultResponse));
    renderPath('/search');

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    userEvent.type(screen.getByTestId('search-artist-input'), 'Artist Name');
    userEvent.click(screen.getByTestId('search-artist-button'));

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    await waitFor(() => {
      expect(screen.getByText("Greatest Hits")).toBeInTheDocument();
      expect(screen.getByText("Greatest Hits: The Ultimate Collection (Deluxe Edition)")).toBeInTheDocument();
      expect(
        screen.queryByText('Nenhum álbum foi encontrado')
      ).not.toBeInTheDocument();
    });
  });

  it('Será validado se caso a API não retorne nenhum álbum, a mensagem Nenhum álbum foi encontrado é exibida', async () => {
    vi
      .spyOn(searchAlbumsAPI, 'default')
      .mockImplementation(() => Promise.resolve([]));
    renderPath('/search');

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    userEvent.type(screen.getByTestId('search-artist-input'), 'Artist Name');
    userEvent.click(screen.getByTestId('search-artist-button'));

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    const noAlbumFoundMessage = await screen.findByText(
      /Nenhum álbum foi encontrado/i
    );
    expect(noAlbumFoundMessage).toBeInTheDocument();
  });

  it('Será validado se existe um link para cada álbum listado que redirecione para a rota /album/:id', async () => {
    vi
      .spyOn(searchAlbumsAPI, 'default')
      .mockImplementation(() => Promise.resolve(searchAlbumDefaultResponse));
    renderPath('/search');

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    userEvent.type(screen.getByTestId('search-artist-input'), 'Artist Name');
    userEvent.click(screen.getByTestId('search-artist-button'));

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    const link01 = await screen.findByTestId('link-to-album-1484688048');
    const link02 = await screen.findByTestId('link-to-album-1440677662');

    expect(link01).toBeInTheDocument();
    expect(link02).toBeInTheDocument();

    expect(link01).toHaveAttribute('href', '/album/1484688048');
    expect(link02).toHaveAttribute('href', '/album/1440677662');
  });
});
