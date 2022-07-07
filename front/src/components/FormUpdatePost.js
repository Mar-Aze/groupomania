import '../styles/FormLogin.css';
import '../styles/Post.css';
import { useState } from 'react';
import Api from '../Api';
import { useParams, useNavigate } from 'react-router-dom';

const api = new Api();

export default function FormUpdatePost({ post }) {
  const [img, setImg] = useState(post.img);
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const { id } = useParams();
  const navigate = useNavigate();
  const [invalid, setInvalid] = useState(false);

  const handleFocus = (e) => {
    setInvalid(!e.target.validity.valid);
  };

  function handleSubmit(e) {
    e.preventDefault();
    api
      .modifyPost({
        title,
        img,
        description,
        id,
      })
      .then(() => {
        navigate(`/wall/`);
      });
  }

  return (
    <form
      encType="multipart/form-data"
      method="put"
      action="/api/posts/:id"
      className="form-login"
      onSubmit={handleSubmit}
    >
      <h2>Modifiez votre post!</h2>
      <input
        type="file"
        name="file"
        placeholder="Télécharger une image ou vidéo"
        value=""
        onChange={(e) => setImg(e.target.files[0])}
        accept="image/*"
      />
      <img
        className="post-img-form-update"
        alt="posted pic"
        src={post.imageUrl}
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
        onBlur={handleFocus}
        required
      />
      {invalid ? <span>Merci de ne pas laisser ce champs vide!</span> : null}
      <button type="submit" className="form-login-btn">
        Modifier
      </button>
    </form>
  );
}
