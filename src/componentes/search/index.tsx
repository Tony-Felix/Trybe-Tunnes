import { useState } from 'react';
import { Link } from 'react-router-dom';
import searchAlbumsAPI from '../../services/searchAlbumsAPI';
import { LoadStateProps, AlbumType } from '../../types';
import Loading from '../loading';

function Search({
  loading, setLoading, resultArray, setResultArray, artist, setArtist }:
LoadStateProps &
{ setResultArray: any, resultArray: AlbumType[] }
& { artist: string, setArtist: any }) {
  const [albumNaoEncontrado, setAlbumNaoEncontrado] = useState(false);

  const [inputBuscar, setInputBuscar] = useState({
    buscar: '',
  });

  const isDisabled = !(/^.{2,30}$/.test(inputBuscar.buscar));

  const onClick = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setLoading(true);
    const results = await searchAlbumsAPI(inputBuscar.buscar);
    setAlbumNaoEncontrado(results.length === 0);
    setArtist(inputBuscar.buscar);
    if (results) {
      setResultArray([...results]);
    }
    setInputBuscar({
      buscar: '',
    });
    setLoading(false);
  };

  return (
    <div>
      { loading ? <Loading /> : (
        <form>
          <input
            onChange={
              ({ target }) => setInputBuscar({ ...inputBuscar, buscar: target.value })
            }
            name="busca"
            type="text"
            data-testid="search-artist-input"
            placeholder="Nome do Artista"
          />
          <button
            onClick={ onClick }
            disabled={ isDisabled }
            data-testid="search-artist-button"
          >
            Pesquisar
          </button>

          { !loading && resultArray.length > 0 && (
            <div>
              <ul>
                <p>{ `Resultado de álbuns de: ${artist}` }</p>
                { resultArray.map((artista) => (
                  <div key={ artista.collectionId }>
                    <Link
                      data-testid={ `link-to-album-${artista.collectionId}` }
                      to={ `/album/${artista.collectionId}` }
                    >
                      <p>{artista.collectionName}</p>
                      <img src={ artista.artworkUrl100 } alt="" />
                      <span>{artista.artistName}</span>
                    </Link>
                  </div>
                )) }
              </ul>
            </div>
          )}
          { albumNaoEncontrado && (
            <p>Nenhum álbum foi encontrado</p>
          )}
        </form>)}
    </div>
  );
}

export default Search;
