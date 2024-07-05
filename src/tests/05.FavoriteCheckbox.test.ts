import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import * as musicsAPI from '../services/musicsAPI';
import renderPath from './helpers/renderPath';
import { defaultUser, musicAPIDefaultResponse } from './mocks';

describe('5 - Crie o mecanismo para adicionar músicas na lista de músicas favoritas', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.setItem('user', JSON.stringify(defaultUser));
    localStorage.setItem('favorite_songs', JSON.stringify([]));
  });

  afterEach(() => localStorage.clear());

  it('Será validado se existe um checkbox para cada música da lista',
    async () => {
      vi.spyOn(musicsAPI, 'default').mockImplementation(
        () => Promise.resolve(musicAPIDefaultResponse) as any,
      );

      renderPath("/album/123");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(screen.getByTestId('checkbox-music-1484688057')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-music-1484688223')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-music-1484688244')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-music-1484688264')).toBeInTheDocument();
    });

  it('Será validado se ao clicar no checkbox, a imagem do coração muda de preenchido para vazio ou vice-versa.',
    async () => {
      vi.spyOn(musicsAPI, 'default').mockImplementation(
        () => Promise.resolve(musicAPIDefaultResponse) as any,
      );

      renderPath("/album/123");

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      const checkbox = screen.getByTestId('checkbox-music-1484688223');

      const img = within(checkbox).getByAltText('favorite');
      expect(img).toHaveAttribute('src', '/src/images/empty_heart.png');

      userEvent.click(checkbox);

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(img).toHaveAttribute('src', '/src/images/checked_heart.png');

      userEvent.click(checkbox);

      await waitFor(
        () => expect(screen.queryAllByText('Carregando...')).toHaveLength(0),
        { timeout: 3000 }
      );

      expect(img).toHaveAttribute('src', '/src/images/empty_heart.png');
    });
});
