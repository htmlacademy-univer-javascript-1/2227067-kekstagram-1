const random = (min, max) => {
  if (min < 0 || max < 0) {
    throw new Error('Такое задавать нельзяяя');
  }
  const newFrom = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const newTo = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const randomNumber = Math.floor(Math.random() * (newTo - newFrom + 1) + newFrom);
  return randomNumber;
};

const strLength = (str, maxLength) => str.length <= maxLength;

random(5, 10);
strLength('str', 3);
strLength('str', 5);
//Test push
