import '../styles/FormLogin.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signin({ onSignin }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidF, setInvalidF] = useState(false);
  const [invalidE, setInvalidE] = useState(false);
  const [invalidP, setInvalidP] = useState(false);

  const handleFocusF = (e) => {
    setInvalidF(!e.target.validity.valid);
  };
  const handleFocusE = (e) => {
    setInvalidE(!e.target.validity.valid);
  };
  const handleFocusP = (e) => {
    setInvalidP(!e.target.validity.valid);
  };

  function handleSubmit(e) {
    e.preventDefault();
    onSignin({
      firstName,
      email,
      password,
    });
  }

  return (
    <form className="form-login" onSubmit={handleSubmit}>
      <img src="../images/team.webp" alt="Team Check" />
      <h2>Créez votre compte en quelques minutes!</h2>
      <input
        type="text"
        placeholder="Votre prénom"
        className={invalidF ? 'error' : ''}
        value={firstName}
        name="firstname"
        onChange={(e) => setFirstName(e.target.value)}
        required
        onBlur={handleFocusF}
        pattern="([a-zA-ZàâäéèëêîïôöùûüçæœÂÀÄÉÈÊËÎÏÔÖÛÜÙÇÆŒ]{2,})+([-'\s][a-zA-ZàâäéèëêîïôöùûüçæœÂÀÄÉÈÊËÎÏÔÖÛÜÙÇÆŒ]+)?$"
        title="Veuillez entrer votre prénom!"
      />
      {invalidF ? <span>Veuillez entrer votre prénom!</span> : null}
      <input
        type="email"
        placeholder="Votre email"
        className={invalidE ? 'error' : ''}
        value={email}
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        onBlur={handleFocusE}
        pattern="([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,5})$"
        title="Veuillez entrer un email valide!"
        required
      />
      {invalidE ? <span>Veuillez entrer un email valide!</span> : null}
      <input
        type="password"
        placeholder="Votre mot de passe"
        className={invalidP ? 'error' : ''}
        value={password}
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        onBlur={handleFocusP}
        pattern="^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$"
        title="Veuillez entrer un mot de passe de minimum 8 caratères comprenant au
        moins 1 majuscule, 1 chiffre, 1 minuscule et 1 caractère spécial!"
        required
      />
      {invalidP ? (
        <span>
          Veuillez entrer un mot de passe de minimum 8 caratères comprenant au
          moins 1 majuscule, 1 chiffre, 1 minuscule et 1 caractère spécial!
        </span>
      ) : null}
      <button type="submit" className="form-login-btn">
        Créer un compte
      </button>
      <p className="form-login-p">
        Vous avez déjà un compte?{' '}
        <Link className="form-login-a" to={`/login`}>
          Se connecter
        </Link>
      </p>
    </form>
  );
}
