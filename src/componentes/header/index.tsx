import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Loading from '../loading';
import { LoadStateProps, UserType } from '../../types';
import { getUser } from '../../services/userAPI';

function Header({ loading, setLoading }: LoadStateProps) {
  const [showUser, setShowUser] = useState<UserType>();

  const showName = async () => {
    setLoading(true);
    const result = await getUser();
    console.log(result.name);
    if (result) {
      setShowUser(result);
    }
    setLoading(false);
  };

  useEffect(() => {
    showName();
  }, []);

  return (
    <header data-testid="header-component">
      {loading ? <Loading /> : (
        <h2 data-testid="header-user-name">{showUser?.name}</h2>
      )}
      <NavLink to="/search" data-testid="link-to-search">Search</NavLink>
      <NavLink to="/favorites" data-testid="link-to-favorites">Favorites</NavLink>
      <NavLink to="/profile" data-testid="link-to-profile">Profile</NavLink>
    </header>
  );
}

export default Header;
