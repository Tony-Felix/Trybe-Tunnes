import { useEffect, useState } from 'react';
import { AlbumSongType } from '../../types';

function Favorite() {
  const [stateFavorite, setStateFavorite] = useState<AlbumSongType[]>();

  useEffect(() => {
    const local = localStorage.getItem('favorite_songs');
    if (local !== null) {
      setStateFavorite(JSON.parse(local));
    }
  }, []);

  return (
    <div>
      <div>
        {stateFavorite && (
          <ul>
            {stateFavorite.map((music) => (
              <div key={ music.trackId }>
                <p>{music.trackName}</p>
                <audio data-testid="audio-component" src={ music.previewUrl } controls>
                  <track kind="captions" />
                </audio>
              </div>
            ))}
          </ul>
        ) }
      </div>
    </div>
  );
}

export default Favorite;
