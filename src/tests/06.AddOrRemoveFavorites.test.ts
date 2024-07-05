import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import * as musicsAPI from '../services/musicsAPI';
import * as favoriteSongsAPI from '../services/favoriteSongsAPI';
import renderPath from './helpers/renderPath';
import { defaultUser, musicAPIDefaultResponse } from './mocks';

describe('6 - Faça a requisição para adicionar e remover as músicas favoritas ao clicar no checkbox', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.setItem('user', JSON.stringify(defaultUser));
    localStorage.setItem('favorite_songs', JSON.stringify([]));
  });

  afterEach(() => localStorage.clear());

  it('Será validado se a função addSong é chamada quando algum checkbox é marcado',
    async () => {
      vi.spyOn(musicsAPI, 'default').mockImplementation(
        () => Promise.resolve(musicAPIDefaultResponse) as any,
      );

      const spy = vi.spyOn(favoriteSongsAPI, 'addSong');

      renderPath("/album/123");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      userEvent.click(screen.getByTestId('checkbox-music-1484688057'));
      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(spy).toHaveBeenCalled();
    });

  it('Será validado se a função removeSong é chamada quando algum checkbox é desmarcado',
    async () => {
      vi.spyOn(musicsAPI, 'default').mockImplementation(
        () => Promise.resolve(musicAPIDefaultResponse) as any,
      );

      const spy = vi.spyOn(favoriteSongsAPI, 'removeSong');

      renderPath("/album/123");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      userEvent.click(screen.getByTestId('checkbox-music-1484688057'));

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      userEvent.click(screen.getByTestId('checkbox-music-1484688057'));

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(spy).toHaveBeenCalled();
    });

  it('Será validado se o número de checkboxes marcados como checked aumenta quando um checkbox é clicado',
    async () => {
      vi.spyOn(musicsAPI, 'default').mockImplementation(
        () => Promise.resolve(musicAPIDefaultResponse) as any,
      );

      renderPath("/album/123");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(0);
      expect(screen.getAllByRole('checkbox', { checked: false })).toHaveLength(4);

      userEvent.click(screen.getByTestId('checkbox-music-1484688057'));
      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(1);
      expect(screen.queryAllByRole('checkbox', { checked: false })).toHaveLength(3);

      userEvent.click(screen.getByTestId('checkbox-music-1484688223'));
      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(2);
      expect(screen.queryAllByRole('checkbox', { checked: false })).toHaveLength(2);
    });

  it('Será validado se o número de checkboxes marcados como checked diminui quando um checkbox marcado é clicado',
    async () => {
      vi.spyOn(musicsAPI, 'default').mockImplementation(
        () => Promise.resolve(musicAPIDefaultResponse) as any,
      );

      renderPath("/album/12");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      userEvent.click(screen.getByTestId('checkbox-music-1484688057'));

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      userEvent.click(screen.getByTestId('checkbox-music-1484688223'));

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(2);
      expect(screen.getAllByRole('checkbox', { checked: false })).toHaveLength(2);

      userEvent.click(screen.getByTestId('checkbox-music-1484688057'));
      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(1);
      expect(screen.queryAllByRole('checkbox', { checked: false })).toHaveLength(3);

      userEvent.click(screen.getByTestId('checkbox-music-1484688223'));
      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(0);
      expect(screen.queryAllByRole('checkbox', { checked: false })).toHaveLength(4);
    });
});
