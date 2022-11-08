import { isEscapeKey } from './util.js';

const bigPicture = document.querySelector('.big-picture');
const srcPicture = bigPicture.querySelector('.big-picture__img');
const likesPicture = bigPicture.querySelector('.likes-count');
const commentsCountPicture = bigPicture.querySelector('.comments-count');
const commentsPicture = bigPicture.querySelector('.social__comments');
const descriptionPicture = bigPicture.querySelector('.social__caption');

const closeButton = bigPicture.querySelector('.big-picture__cancel');

//
const countComments = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
countComments.classList.add('hidden');
commentsLoader.classList.add('hidden');
//

const closeBigWindow = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  closeButton.removeEventListener('click', closeBigWindow);
  document.removeEventListener('keydown', closeBigWindowOnEsc);
};

function closeBigWindowOnEsc(evt) {
  if (isEscapeKey(evt)) {
    closeBigWindow();
  }
}

const renderComment = (comment) => {
  const li = document.createElement('li');
  li.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = '35';
  img.height = '35';

  const p = document.createElement('p');
  p.classList.add('social__text');
  p.textContent = comment.message;

  li.appendChild(img);
  li.appendChild(p);
  commentsPicture.appendChild(li);
};

const openBigWindow = (post) => {
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeButton.addEventListener('click', closeBigWindow);
  document.addEventListener('keydown', closeBigWindowOnEsc);

  srcPicture.querySelector('img').src = post.url;
  likesPicture.textContent = post.likes;
  commentsCountPicture.textContent = post.comments.length;
  descriptionPicture.textContent = post.description;

  const comments = post.comments;
  while (commentsPicture.lastElementChild) {
    commentsPicture.removeChild(commentsPicture.lastElementChild);
  }
  for (const comment of comments) {
    renderComment(comment);
  }
};

export { openBigWindow };
