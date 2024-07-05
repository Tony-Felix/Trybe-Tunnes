import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as musicsAPI from '../services/musicsAPI';
import renderPath from './helpers/renderPath';
import { defaultUser, musicAPIDefaultResponse, searchAlbumDefaultResponse } from './mocks';
import userEvent from '@testing-library/user-event';
import * as searchAlbumsAPI from '../services/searchAlbumsAPI';

describe('3 - Crie a lista de músicas do álbum selecionado', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.setItem('user', JSON.stringify(defaultUser));
    localStorage.setItem('favorite_songs', JSON.stringify([]));
  });

  afterEach(() => localStorage.clear());

  it('Será validado se o serviço de musicsAPI está sendo chamado', async () => {
    const spy = vi.spyOn(musicsAPI, 'default').mockImplementation(
      () => Promise.resolve(musicAPIDefaultResponse) as any,
    );

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

    userEvent.click(link01);

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    expect(spy).toHaveBeenCalledWith('1484688048');
  });

  it('Será validado se o nome da banda ou artista e o nome do álbum são exibidos', async () => {
    vi.spyOn(musicsAPI, 'default').mockImplementation(
      () => Promise.resolve(musicAPIDefaultResponse) as any,
    );

    renderPath("/album/12");

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    const artistNameElement = screen.getByTestId('artist-name');
    expect(artistNameElement).toBeInTheDocument();
    expect(artistNameElement).toHaveTextContent("Bon Jovi");

    const albumNameElement = screen.getByTestId('album-name');
    expect(albumNameElement).toBeInTheDocument();
    expect(albumNameElement).toHaveTextContent("Greatest Hits");
  });

  it('Será validado se todas músicas retornadas pela API são listadas', async () => {
    vi.spyOn(musicsAPI, 'default').mockImplementation(
      () => Promise.resolve(musicAPIDefaultResponse) as any,
    );

    renderPath("/album/12");

    await waitFor(
      () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
      { timeout: 3000 }
    );

    expect(screen.getByText("Livin' On a Prayer")).toBeInTheDocument();
    expect(screen.getByText("You Give Love a Bad Name")).toBeInTheDocument();
    expect(screen.getByText("It's My Life")).toBeInTheDocument();
    expect(screen.getByText('Have a Nice Day')).toBeInTheDocument();
    expect(screen.getAllByTestId('audio-component')).toHaveLength(4);
  });
});
