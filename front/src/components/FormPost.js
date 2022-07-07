import '../styles/FormLogin.css';
import { useState } from 'react';

export default function FormPost({ onCreatePost }) {
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const userId = JSON.parse(localStorage.getItem('userId'));
  const [invalid, setInvalid] = useState(false);

  const handleFocus = (e) => {
    setInvalid(!e.target.validity.valid);
  };

  function handleSubmit(e) {
    e.preventDefault();
    onCreatePost({
      imageUrl,
      title,
      description,
      userId,
    });
  }

  return (
    <form
      id={userId}
      encType="multipart/form-data"
      className="form-login"
      onSubmit={handleSubmit}
      action="/api/posts"
      method="post"
    >
      <h2>C'est parti! Créez vos posts!</h2>
      <input
        type="file"
        placeholder="Télécharger une image ou vidéo"
        value=""
        onChange={(e) => setImageUrl(e.target.files[0])}
        name="file"
        accept="image/*"
      />
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        type="text"
        placeholder="Description"
        className={invalid ? 'error' : ''}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        onBlur={handleFocus}
      />
      {invalid ? <span>Merci de ne pas laisser ce champs vide!</span> : null}
      <button type="submit" className="form-login-btn">
        Publier
      </button>
      <img src="..\images\discuss.jpg" alt="Bavardages" />
    </form>
  );
}
