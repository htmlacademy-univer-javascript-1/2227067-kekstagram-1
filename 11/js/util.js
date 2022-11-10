
const getRandomNumber = (min, max) => {
  if (min < 0 || max < 0) {
    throw new Error('Not for negative numbers!');
  }
  const newFrom = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const newTo = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const randomNumber = Math.floor(Math.random() * (newTo - newFrom + 1) + newFrom);
  return randomNumber;
};

const getRandomArrayElement = (array) => array[getRandomNumber(0, array.length - 1)];

const isEscapeKey = (evt) => evt.key === 'Escape';

const isCorrectLength = (str, maxLength) => str.length <= maxLength;

const showAlert = (message, alertShowTime) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, alertShowTime);
};

export { getRandomNumber, getRandomArrayElement, isEscapeKey, isCorrectLength, showAlert };
