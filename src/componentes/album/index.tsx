import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import getMusics from '../../services/musicsAPI';
import Loading from '../loading';
import { AlbumSongType, LoadStateProps } from '../../types';
import MusicCard from '../musicCard';

function Album({
  loading, setLoading, stateResult, setStateResult }:
LoadStateProps & { stateResult: AlbumSongType[],
  setStateResult: (value: (AlbumSongType)[]) => void }) {
  const { id } = useParams();

  const showAlbum = async () => {
    if (id) {
      setLoading(true);
      const result: any = await getMusics(id);
      if (result) {
        setStateResult([...result]);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    showAlbum();
  }, []);

  return (
    <div>
      { loading ? <Loading /> : (
        <div>
          <img src={ stateResult[0]?.artworkUrl100 } alt="" />
          <br />
          <p data-testid="artist-name">{stateResult[0]?.artistName}</p>
          <p data-testid="album-name">{stateResult[0]?.collectionName}</p>
          <br />
          <MusicCard stateResult={ stateResult } />
        </div>
      )}
    </div>
  );
}

export default Album;
