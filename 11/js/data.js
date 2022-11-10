import { getRandomNumber, getRandomArrayElement } from './util.js';

const NAMES = [
  'Владимир',
  'Алексей',
  'Иван',
  'Никита',
  'Денис',
  'Дмитрий',
  'Михаил',
  'Максим',
  'Алёна',
  'Настя',
  'Мария',
  'Елена',
  'Елизавета',
  'Екатерина',
  'Юлия',
  'Алина'
];

const MESSAGES = [
  'Прекрасное фото',
  'Сразу видно, снято профессионалом',
  'Это настолько ужасно, что я не могу смотреть',
  'Как забыть то, что я только что увидел',
  'Это несомненно лучшее фото, что я видел!',
  'Это очень круто!',
  'Невероятный шедевр',
  'Можешь больше в своей жизни не фотографировать?!',
  'Мне очень нравится)',
  'Выкладывай фото почаще, пожалуйста',
  'Что это такое!?',
];

const DESCRIPTIONS = [
  'Смотрите, что сфоткал!',
  'Моё любимое фото',
  'Что можете сказать по этому поводу?',
  'Красиво, не правда ли?',
  'Сегодня я нашёл это и сфоткал)',
  'Мне очень нравится фотографировать',
  'Мне кажется или я профессионал?',
  'Вроде неплохо, но мог лучше',
];

const NUMBER_POSTS = 25;

let idCounter = 1;
let idComCounter = 1;
let urlCounter = 1;

const getID = () => idCounter++;

const getComID = () => idComCounter++;

const getURL = () => urlCounter++;

const createComment = () => ({
  id: getComID(),
  avatar: `img/avatar-${getRandomNumber(1, 6)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

const createPost = () => ({
  id: getID(),
  url: `photos/${getURL()}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomNumber(5, 50),
  comments: Array.from({ length: getRandomNumber(2, 17)}, createComment)
});

const getPosts = () => Array.from({ length: NUMBER_POSTS }, createPost);

export { getPosts };
