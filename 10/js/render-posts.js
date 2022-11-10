import { openBigWindow } from './big-window.js';
import { getData } from './api.js';
import { showAlert } from './util.js';

const blockPictures = document.querySelector('.pictures');
const postTemplate = document.querySelector('#picture').content;
const postPicture = postTemplate.querySelector('.picture');

const renderPost = (post) => {
  const clonePostPicture = postPicture.cloneNode(true);
  clonePostPicture.querySelector('.picture__img').src = post.url;
  clonePostPicture.querySelector('.picture__comments').textContent = post.comments.length;
  clonePostPicture.querySelector('.picture__likes').textContent = post.likes;
  blockPictures.appendChild(clonePostPicture);
  clonePostPicture.addEventListener('click', () => {
    openBigWindow(post);
  });
};

const renderPosts = () => {
  getData((posts) => {
    for (const post of posts) {
      renderPost(post);
    }
  },
  () => {
    showAlert('Ошибка загрузки данных!', 0);
  });
};

export { renderPosts };

