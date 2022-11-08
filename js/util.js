
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

const isCorrectLength = (str, maxLength) => str.length <= maxLength;

isCorrectLength('str', 5);

export { getRandomNumber, getRandomArrayElement };
