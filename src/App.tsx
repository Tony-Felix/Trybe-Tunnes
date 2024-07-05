import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './componentes/login';
import Search from './componentes/search';
import Album from './componentes/album';
import { AlbumSongType, AlbumType } from './types';
import Layout from './componentes/layout';
import Favorite from './componentes/favorito';

function App() {
  const [artist, setArtist] = useState('');
  const [resultArray, setResultArray] = useState<AlbumType[]>([]);
  const [loading, setLoading] = useState(false);
  const [stateResult, setStateResult] = useState<AlbumSongType[]>([]);

  return (
    <Routes>
      <Route
        path="/"
        element={ <Login loading={ loading } setLoading={ setLoading } /> }
      />
      <Route
        path="/"
        element={ <Layout
          loading={ loading }
          setLoading={ setLoading }
        /> }
      >
        <Route
          path="/album/:id"
          element={ <Album
            stateResult={ stateResult }
            setStateResult={ setStateResult }
            loading={ loading }
            setLoading={ setLoading }
          /> }
        />
        <Route
          path="/search"
          element={
            <Search
              resultArray={ resultArray }
              setResultArray={ setResultArray }
              loading={ loading }
              setLoading={ setLoading }
              artist={ artist }
              setArtist={ setArtist }
            />
          }
        />
        <Route
          path="/favorites"
          element={ <Favorite /> }
        />
      </Route>
    </Routes>
  );
}

export default App;
