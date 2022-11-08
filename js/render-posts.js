import { getPosts } from './data.js';

const blockPictures = document.querySelector('.pictures');
const postTemplate = document.querySelector('#picture').content;
const postPicture = postTemplate.querySelector('.picture');

const renderPost = (post) => {
  const clonePostPicture = postPicture.cloneNode(true);
  clonePostPicture.querySelector('.picture__img').src = post.url;
  clonePostPicture.querySelector('.picture__comments').textContent = post.comments.length;
  clonePostPicture.querySelector('.picture__likes').textContent = post.likes;
  blockPictures.appendChild(clonePostPicture);
};

const renderPosts = () => {
  const posts = getPosts();
  for (const post of posts) {
    renderPost(post);
  }
};

export { renderPosts };

