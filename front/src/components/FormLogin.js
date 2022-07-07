import '../styles/FormLogin.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FormLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidE, setInvalidE] = useState(false);
  const [invalidP, setInvalidP] = useState(false);

  const handleFocusE = (e) => {
    setInvalidE(!e.target.validity.valid);
  };
  const handleFocusP = (e) => {
    setInvalidP(!e.target.validity.valid);
  };

  function handleSubmit(e) {
    e.preventDefault();
    onLogin({
      email,
      password,
    });
  }
  return (
    <form className="form-login" onSubmit={handleSubmit}>
      <img src="..\images\welcome.jpg" alt="Welcome" />
      <h2>Welcome back!</h2>
      <input
        type="email"
        className={invalidE ? 'error' : ''}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={handleFocusE}
        pattern="([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,5})$"
        required
      />
      {invalidE ? <span>Votre email n'est pas correct!</span> : null}
      <input
        type="password"
        placeholder="Mot de passe"
        className={invalidP ? 'error' : ''}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={handleFocusP}
        pattern="^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$"
        required
      />
      {invalidP ? <span>Votre mot de passe n'est pas correct!</span> : null}
      <button type="submit" className="form-login-btn">
        Se connecter
      </button>
      <p className="form-login-p">
        Vous n'avez pas de compte?{' '}
        <Link className="form-login-a" to={`/signin`}>
          S'inscrire
        </Link>
      </p>
    </form>
  );
}
