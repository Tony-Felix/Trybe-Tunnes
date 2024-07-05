import { Outlet } from 'react-router-dom';
import Header from '../header';
import { LoadStateProps } from '../../types';

function Layout({ loading, setLoading }: LoadStateProps) {
  return (
    <div>
      <Header loading={ loading } setLoading={ setLoading } />
      <Outlet />
    </div>
  );
}

export default Layout;
