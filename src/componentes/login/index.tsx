import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../services/userAPI';
import { LoadStateProps } from '../../types';
import Loading from '../loading';

function Login({ loading, setLoading }: LoadStateProps) {
  const [inputLogin, setinputLogin] = useState({
    login: '',
  });

  const navigate = useNavigate();
  const isDisabled = !(/^.{3,30}$/.test(inputLogin.login));

  const onSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setLoading(true);
    await createUser({ name: inputLogin.login });
    setLoading(false);
    navigate('/search');
  };

  return (
    <div>
      { loading ? <Loading /> : (
        <form>
          <label htmlFor="login">Login</label>
          <input
            name="login"
            type="text"
            data-testid="login-name-input"
            onChange={
              ({ target }) => setinputLogin({ ...inputLogin, login: target.value })
            }
          />
          <button
            onClick={ onSubmit }
            disabled={ isDisabled }
            data-testid="login-submit-button"
          >
            Entrar
          </button>
        </form>)}
    </div>
  );
}

export default Login;
