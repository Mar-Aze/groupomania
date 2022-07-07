import '../styles/FormLogin.css';
import { useEffect, useState } from 'react';
import Api from '../Api';
import { useParams } from 'react-router-dom';
import FormUpdateUser from '../components/FormUpdateUser';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import Nav from '../components/Nav';

const api = new Api();

export default function UpdateUser() {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    api
      .getUserById(id)
      .then((response) => {
        setUser(response);
      })
      .catch((error) => {
        alert("L'utilisateur n'a pas pu être trouvé");
      });
  }, [id]);

  return (
    <div>
      <Banner />
      <Nav
        navName1={'Mur'}
        navPath1={'/wall'}
        navName2={'Se déconnecter'}
        navPath2={'/logout'}
      />
      {user ? <FormUpdateUser user={user} /> : ''}
      <Footer />
    </div>
  );
}
