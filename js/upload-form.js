import { isEscapeKey, isCorrectLength } from './util.js';

const inputFile = document.querySelector('#upload-file');
const editWindow = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('.img-upload__cancel');
const submitButton = document.querySelector('.img-upload__submit');
const form = document.querySelector('.img-upload__form');
const hashtagForm = document.querySelector('.text__hashtags');
const descriptionForm = document.querySelector('.text__description');

const closeEditWindow = () => {
  editWindow.classList.add('hidden');
  document.body.classList.remove('modal-open');

  closeButton.removeEventListener('click', closeEditWindow);
  document.removeEventListener('keydown', closeEditWindowOnEsc);

  hashtagForm.removeEventListener('keydown', stopEsc);
  descriptionForm.removeEventListener('keydown', stopEsc);

  inputFile.value = '';
};

function closeEditWindowOnEsc(evt) {
  if (isEscapeKey(evt)) {
    closeEditWindow();
  }
}

function stopEsc(evt) {
  evt.stopPropagation();
}

inputFile.addEventListener('change', (evt) => {
  evt.preventDefault();
  editWindow.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeButton.addEventListener('click', closeEditWindow);
  document.addEventListener('keydown', closeEditWindowOnEsc);
  hashtagForm.addEventListener('keydown', stopEsc);
  descriptionForm.addEventListener('keydown', stopEsc);
});


let hashtagResult = true;
let descriptionResult = true;

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper-valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'text__error'
}, true);

const validateDescription = (str) => {
  const result = isCorrectLength(str, 140);
  descriptionResult = result;
  if (hashtagResult && descriptionResult) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
  return result;
};

const validateHashTag = (str) => {
  const hashtags = str.split(' ');
  const regex = /(^\s*$)|(^#[A-Za-zА-Яа-яЁё0-9]{1,19}$)/;
  let result = true;
  for (const hashtag of hashtags) {
    result = regex.test(hashtag);
    if (!result) {
      break;
    }
  }
  hashtagResult = result;
  if (hashtagResult && descriptionResult) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
  return result;
};

pristine.addValidator(
  hashtagForm,
  validateHashTag,
  'Некорректный хэштэг!'
);

pristine.addValidator(
  descriptionForm,
  validateDescription,
  'Количество символов не должно превышать 140!'
);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
});
