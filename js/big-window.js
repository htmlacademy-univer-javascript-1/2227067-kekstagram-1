import { isEscapeKey } from './util.js';

const bigPicture = document.querySelector('.big-picture');
const srcPicture = bigPicture.querySelector('.big-picture__img');
const likesPicture = bigPicture.querySelector('.likes-count');
const commentsPicture = bigPicture.querySelector('.social__comments');
const descriptionPicture = bigPicture.querySelector('.social__caption');
const countComments = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

let commentCounter = 0;

const closeBigWindow = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  closeButton.removeEventListener('click', closeBigWindow);
  document.removeEventListener('keydown', closeBigWindowOnEsc);
  commentsLoader.removeEventListener('click', loadComments);
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
  li.classList.add('hidden');
  commentsPicture.appendChild(li);
};

const initialComments = (comments) => {
  while (commentsPicture.lastElementChild) {
    commentsPicture.removeChild(commentsPicture.lastElementChild);
  }
  for (const comment of comments) {
    renderComment(comment);
  }
  let initialNumber;
  if (comments.length > 5) {
    initialNumber = 5;
    commentsLoader.classList.remove('hidden');
    countComments.textContent = `5 из ${comments.length} комментариев`;
  } else {
    initialNumber = comments.length;
    commentsLoader.classList.add('hidden');
    countComments.textContent = `${comments.length} из ${comments.length} комментариев`;
  }
  const elemComments = commentsPicture.children;
  let i = 0;
  for (const element of elemComments) {
    if (i >= initialNumber) {
      break;
    }
    element.classList.remove('hidden');
    i++;
  }
  commentCounter = i;
};

function loadComments() {
  const elemComments = commentsPicture.children;
  commentCounter += 5;
  let i = 0;
  for (const element of elemComments) {
    if (i >= commentCounter) {
      break;
    }
    element.classList.remove('hidden');
    i++;
  }
  countComments.textContent = `${i} из ${elemComments.length} комментариев`;
  if (commentCounter >= elemComments.length) {
    commentsLoader.classList.add('hidden');
  }
}

const openBigWindow = (post) => {
  commentCounter = 0;

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeButton.addEventListener('click', closeBigWindow);
  document.addEventListener('keydown', closeBigWindowOnEsc);

  commentsLoader.addEventListener('click', loadComments);

  srcPicture.querySelector('img').src = post.url;
  likesPicture.textContent = post.likes;
  descriptionPicture.textContent = post.description;

  const comments = post.comments;
  initialComments(comments);
};

export { openBigWindow };
