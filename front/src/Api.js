import { handleApiResponse } from './utils';

export default class Api {
  getAllPosts() {
    return fetch('http://localhost:3001/api/posts', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      },
    }).then(handleApiResponse);
  }

  getPostById(id) {
    return fetch(`http://localhost:3001/api/posts/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      },
    }).then(handleApiResponse);
  }

  getUserById(id) {
    return fetch(`http://localhost:3001/api/auth/users/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      },
    }).then(handleApiResponse);
  }

  login({ email, password }) {
    return fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(handleApiResponse);
  }

  signin({ email, password, firstName }) {
    const user = {
      firstName,
      email,
      password,
    };
    return fetch('http://localhost:3001/api/auth/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
      }),
    }).then(handleApiResponse);
  }

  createPost({ imageUrl, title, description, userId }) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', imageUrl);
    return fetch('http://localhost:3001/api/posts', {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      },
      body: formData,
    }).then(handleApiResponse);
  }

  modifyPost({ img, title, description, id }) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', img);
    return fetch(`http://localhost:3001/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      },
      body: formData,
    }).then(handleApiResponse);
  }

  deletePost(id) {
    return fetch(`http://localhost:3001/api/posts/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      },
    });
  }

  likePost(id) {
    return fetch(`http://localhost:3001/api/posts/${id}/like`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      },
    }).then(handleApiResponse);
  }

  deleteUser(id) {
    fetch(`http://localhost:3001/api/auth/users/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      },
    });
  }

  modifyUser({ firstName, imageUrl, email, department, id }) {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('email', email);
    formData.append('department', department);
    formData.append('file', imageUrl);
    return fetch(`http://localhost:3001/api/auth/users/${id}`, {
      method: 'PUT',
      headers: {
        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      },
      body: formData,
    }).then(handleApiResponse);
  }
}
