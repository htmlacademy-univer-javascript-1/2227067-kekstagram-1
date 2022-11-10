import { openBigWindow } from './big-window.js';
import { getData } from './api.js';
import { showAlert } from './util.js';

const blockPictures = document.querySelector('.pictures');
const postTemplate = document.querySelector('#picture').content;
const postPicture = postTemplate.querySelector('.picture');
const picturesFilter = document.querySelector('.img-filters');
const filterButtonDefault = document.querySelector('[id=filter-default]');
const filterButtonRandom = document.querySelector('[id=filter-random]');
const filterButtonDiscussed = document.querySelector('[id=filter-discussed]');

const previousPosts = new Set();
let timeoutId;

const renderPost = (post) => {
  const clonePostPicture = postPicture.cloneNode(true);
  clonePostPicture.querySelector('.picture__img').src = post.url;
  clonePostPicture.querySelector('.picture__comments').textContent = post.comments.length;
  clonePostPicture.querySelector('.picture__likes').textContent = post.likes;
  blockPictures.appendChild(clonePostPicture);
  previousPosts.add(clonePostPicture);
  clonePostPicture.addEventListener('click', () => {
    openBigWindow(post);
  });
};

const delayRender = (posts) => {
  for (const post of previousPosts) {
    blockPictures.removeChild(post);
  }
  previousPosts.clear();

  clearTimeout(timeoutId);
  timeoutId = setTimeout(
    () => {
      for (const post of posts) {
        renderPost(post);
      }
    },
    500
  );
};

const renderPosts = (posts) => {
  for (const post of posts) {
    renderPost(post);
  }
  picturesFilter.classList.remove('img-filters--inactive');
  let currentFilter = 'filter-default';
  filterButtonDefault.addEventListener('click', () => {
    if (currentFilter !== 'filter-default') {
      currentFilter = 'filter-default';
      filterButtonDefault.classList.add('img-filters__button--active');
      filterButtonRandom.classList.remove('img-filters__button--active');
      filterButtonDiscussed.classList.remove('img-filters__button--active');
      delayRender(posts);
    }
  });
  filterButtonRandom.addEventListener('click', () => {
    if (currentFilter !== 'filter-random') {
      currentFilter = 'filter-random';
      filterButtonDefault.classList.remove('img-filters__button--active');
      filterButtonRandom.classList.add('img-filters__button--active');
      filterButtonDiscussed.classList.remove('img-filters__button--active');
      const tempPosts = posts.slice(0, 10).sort(() => Math.random() - 0.5);
      delayRender(tempPosts);
    }
  });
  filterButtonDiscussed.addEventListener('click', () => {
    if (currentFilter !== 'filter-discussed') {
      currentFilter = 'filter-discussed';
      filterButtonDefault.classList.remove('img-filters__button--active');
      filterButtonRandom.classList.remove('img-filters__button--active');
      filterButtonDiscussed.classList.add('img-filters__button--active');
      const tempPosts = posts.slice(0).sort((a, b) => b.comments.length - a.comments.length);
      delayRender(tempPosts);
    }
  });
};

const renderData = () => {
  getData((posts) => {
    renderPosts(posts);
  },
  () => {
    showAlert('Ошибка загрузки данных!', 0);
  });
};

export { renderData };

