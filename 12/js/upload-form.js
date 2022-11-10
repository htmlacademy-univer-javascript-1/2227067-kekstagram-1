import { isEscapeKey, isCorrectLength } from './util.js';
import { sendData } from './api.js';

const inputFile = document.querySelector('#upload-file');
const editWindow = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('.img-upload__cancel');

const form = document.querySelector('.img-upload__form');
const hashtagForm = form.querySelector('.text__hashtags');
const descriptionForm = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

const previewPicture = editWindow.querySelector('.img-upload__preview').querySelector('img');

const resizeButton = editWindow.querySelector('.scale__control--smaller');
const zoomButton = editWindow.querySelector('.scale__control--bigger');
const sizePicture = editWindow.querySelector('.scale__control--value');

const effects = editWindow.querySelector('.effects__list');
const effectLevelValue = editWindow.querySelector('.effect-level__value');
const slider = editWindow.querySelector('.effect-level__slider');
const sliderBox = editWindow.querySelector('.img-upload__effect-level');

let checkBox;

const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');
const successSubmission = successTemplate.cloneNode(true);
const errorSubmission = errorTemplate.cloneNode(true);
const closeSuccessButton = successSubmission.querySelector('.success__button');
const closeErrorButton = errorSubmission.querySelector('.error__button');


//// Event Listeners and Initial Values

const setInitialValues = () => {
  hashtagForm.value = '';
  descriptionForm.value = '';
  submitButton.disabled = false;
  const errors = document.querySelectorAll('.text__error');
  for (const error of errors) {
    error.textContent = '';
  }
  sizePicture.value = '100%';
  previewPicture.style.transform = 'scale(1)';
  effectLevelValue.value = '';
  previewPicture.style.filter = '';
  previewPicture.className = '';
  checkBox = 'effect-none';
  editWindow.querySelector('#effect-none').checked = true;
  sliderBox.classList.add('hidden');
};

const closeEditWindow = () => {
  editWindow.classList.add('hidden');
  document.body.classList.remove('modal-open');

  closeButton.removeEventListener('click', closeEditWindow);
  document.removeEventListener('keydown', closeEditWindowOnEsc);

  hashtagForm.removeEventListener('keydown', stopEsc);
  descriptionForm.removeEventListener('keydown', stopEsc);

  slider.noUiSlider.destroy();
  inputFile.value = '';
  setInitialValues();
};

function closeEditWindowOnEsc(evt) {
  if (isEscapeKey(evt) && !document.body.contains(errorSubmission)) {
    closeEditWindow();
  }
}

function stopEsc(evt) {
  evt.stopPropagation();
}

const createSlider = () => {
  noUiSlider.create(slider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100
  });
};

inputFile.addEventListener('change', (evt) => {
  setInitialValues();

  evt.preventDefault();
  editWindow.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeButton.addEventListener('click', closeEditWindow);
  document.addEventListener('keydown', closeEditWindowOnEsc);

  hashtagForm.addEventListener('keydown', stopEsc);
  descriptionForm.addEventListener('keydown', stopEsc);

  resizeButton.addEventListener('click', resizePicture);
  zoomButton.addEventListener('click', zoomPicture);

  effects.addEventListener('change', setPictureEffect);
  createSlider();
  slider.noUiSlider.on('update', () => {
    setLevelEffect();
  });
});

//// Validation

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

const validateHashtag = (str) => {
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
  validateHashtag,
  'Некорректный хэштэг!'
);

pristine.addValidator(
  descriptionForm,
  validateDescription,
  'Количество символов не должно превышать 140!'
);

const closeSuccessMessage = () => {
  closeSuccessButton.removeEventListener('click', closeSuccessMessage);
  document.removeEventListener('keydown', closeSuccessMessageOnEsc);
  document.removeEventListener('click', clickOutOfSuccessBlock);
  document.body.removeChild(successSubmission);
};

function clickOutOfSuccessBlock(evt) {
  if (evt.target === successSubmission) {
    closeSuccessMessage();
  }
}

function closeSuccessMessageOnEsc(evt) {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
    closeSuccessMessage();
  }
}

const closeErrorMessage = () => {
  closeErrorButton.removeEventListener('click', closeErrorMessage);
  document.removeEventListener('keydown', closeErrorMessageOnEsc);
  document.removeEventListener('click', clickOutOfErrorBlock);
  document.body.removeChild(errorSubmission);
  editWindow.classList.remove('hidden');
};

function clickOutOfErrorBlock(evt) {
  if (evt.target === errorSubmission) {
    closeErrorMessage();
  }
}

function closeErrorMessageOnEsc(evt) {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
    closeErrorMessage();
  }
}

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    sendData(
      () => {
        closeEditWindow();
        submitButton.disabled = false;
        submitButton.textContent = 'Опубликовать';
        closeSuccessButton.addEventListener('click', closeSuccessMessage);
        document.addEventListener('click', clickOutOfSuccessBlock);
        document.addEventListener('keydown', closeSuccessMessageOnEsc);
        document.body.appendChild(successSubmission);
      },
      () => {
        editWindow.classList.add('hidden');
        submitButton.disabled = false;
        submitButton.textContent = 'Опубликовать';
        closeErrorButton.addEventListener('click', closeErrorMessage);
        document.addEventListener('click', clickOutOfErrorBlock);
        document.addEventListener('keydown', closeErrorMessageOnEsc);
        document.body.appendChild(errorSubmission);
      },
      new FormData(evt.target),
    );
  }
});

//// Photo editing

function resizePicture() {
  let currentSize = parseInt(sizePicture.value.replace('%', ''), 10);
  if (currentSize > 0) {
    currentSize -= 25;
    sizePicture.value = `${currentSize}%`;
    previewPicture.style.transform = `scale(${currentSize / 100})`;
  }
}

function zoomPicture() {
  let currentSize = parseInt(sizePicture.value.replace('%', ''), 10);
  if (currentSize < 100) {
    currentSize += 25;
    sizePicture.value = `${currentSize}%`;
    previewPicture.style.transform = `scale(${currentSize / 100})`;
  }
}

const updateSlider = (min, max, step, start) => {
  slider.noUiSlider.updateOptions({
    range: {
      min: min,
      max: max,
    },
    start: start,
    step: step
  });
};

function setPictureEffect(evt) {
  checkBox = evt.target.id;
  let effectClass;
  switch (checkBox) {
    case 'effect-chrome':
      effectClass = 'effects__preview--chrome';
      updateSlider(0, 1, 0.1, 1);
      break;
    case 'effect-sepia':
      effectClass = 'effects__preview--sepia';
      updateSlider(0, 1, 0.1, 1);
      break;
    case 'effect-marvin':
      effectClass = 'effects__preview--marvin';
      updateSlider(0, 100, 1, 100);
      break;
    case 'effect-phobos':
      effectClass = 'effects__preview--phobos';
      updateSlider(0, 3, 0.1, 3);
      break;
    case 'effect-heat':
      effectClass = 'effects__preview--heat';
      updateSlider(1, 3, 0.1, 3);
      break;
  }
  if (checkBox !== 'effect-none') {
    sliderBox.classList.remove('hidden');
    previewPicture.className = effectClass;
  } else {
    sliderBox.classList.add('hidden');
    previewPicture.className = '';
    previewPicture.style.filter = '';
  }
}

function setLevelEffect() {
  const sliderValue = slider.noUiSlider.get();
  effectLevelValue.value = sliderValue;
  let effectFilter;
  switch (checkBox) {
    case 'effect-chrome':
      effectFilter = `grayscale(${sliderValue})`;
      break;
    case 'effect-sepia':
      effectFilter = `sepia(${sliderValue})`;
      break;
    case 'effect-marvin':
      effectFilter = `invert(${sliderValue}%)`;
      break;
    case 'effect-phobos':
      effectFilter = `blur(${sliderValue}px)`;
      break;
    case 'effect-heat':
      effectFilter = `brightness(${sliderValue})`;
      break;
  }
  previewPicture.style.filter = effectFilter;
}
