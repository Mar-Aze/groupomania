import Banner from '../components/Banner';
import Footer from '../components/Footer';
import Api from '../Api';
import { useState, useEffect } from 'react';
import User from '../components/User';
import Nav from '../components/Nav';
import { useNavigate } from 'react-router-dom';

const api = new Api();

export default function Account() {
  const [user, setUser] = useState([]);
  const id = JSON.parse(localStorage.getItem('userId'));
  const navigate = useNavigate();

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

  const onDeleteUser = ({ id }) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte?')) {
      api.deleteUser(id);
      navigate(`/logout`);
    }
  };
  return (
    <div>
      <Banner />
      <Nav
        navName1={'Mur'}
        navPath1={'/wall'}
        navName2={'Se déconnecter'}
        navPath2={'/logout'}
      />
      <User
        firstName={user.firstName}
        imageUrl={user.imageUrl}
        onDeleteUser={onDeleteUser}
        email={user.email}
        department={user.department}
        alt={user.alt}
        id={user.id}
      />
      <img
        className="home-illustration"
        src="../images/compte.jpg"
        alt="illustration compte"
      />
      <Footer />
    </div>
  );
}
