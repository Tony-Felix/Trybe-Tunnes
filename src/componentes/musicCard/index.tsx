import { AlbumSongType } from '../../types';
import emptyHeart from '../../images/empty_heart.png';
import filledHeart from '../../images/checked_heart.png';
import { addSong, removeSong } from '../../services/favoriteSongsAPI';

interface MusicCardProps {
  stateResult: AlbumSongType[];
}
function MusicCard({ stateResult }: MusicCardProps) {
  const handleClick = (music: AlbumSongType) => {
    const image = document.getElementById(`${music?.trackId}`);
    const input = document.getElementById(`checkBox-${music.trackId}`);
    let srcNovo;

    input?.setAttribute('checked', `${!input.getAttribute('checked')}`);

    if (image?.getAttribute('src') !== filledHeart) {
      srcNovo = filledHeart;
      addSong(music);
    } else {
      srcNovo = emptyHeart;
      removeSong(music);
    }

    image?.setAttribute(
      'src',
      srcNovo,
    );
  };

  return (
    <div>
      <div>
        {stateResult && stateResult.length > 0 && (
          <ul>
            {stateResult.slice(1).map((music) => (
              <div key={ music.trackId }>
                <p>{music.trackName}</p>
                <audio data-testid="audio-component" src={ music.previewUrl } controls>
                  <track kind="captions" />
                </audio>
                <label
                  htmlFor={ `checkBox-${music.trackId}` }
                  data-testid={ `checkbox-music-${music.trackId}` }
                >
                  <img
                    id={ `${music.trackId}` }
                    src={ emptyHeart }
                    alt="favorite"
                  />
                  <input
                    style={ { display: 'none' } }
                    name={ `checkBox-${music.trackId}` }
                    id={ `checkBox-${music.trackId}` }
                    type="checkbox"
                    checked={ false }
                    onClick={ () => handleClick(music) }
                  />
                </label>
              </div>
            ))}
          </ul>
        ) }
      </div>
    </div>
  );
}

export default MusicCard;
