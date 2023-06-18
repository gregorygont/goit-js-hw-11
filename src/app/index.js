import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createMarkup } from './createMarkup';
import { PixabayAPI } from './PixabayAPI';
import { refs } from './refs';
import { notifyInit } from './notifyInit';
import { spinnerPlay, spinnerStop } from './spinner';

const modalLightboxGallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

spinnerPlay();

window.addEventListener('load', () => {
  console.log('All resources finished loading!');

  spinnerStop();
});

// Викликаєтмо функцію spinnerPlay(), яка запускає анімацію завантаження (спіннер).
// Додаємо подію load на вікно браузера, яка спрацьовує після повного завантаження всіх ресурсів сторінки.
// При спрацюванні події виводиться повідомлення 'All resources finished loading!', а потім викликається
// функція spinnerStop(), яка, зупиняє анімацію завантаження.

refs.btnLoadMore.classList.add('is-hidden');

const pixaby = new PixabayAPI();

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

// З класу refs.btnLoadMore видаляємо клас 'is-hidden', що робить кнопку видимою.
// Створюємо новий об'єкт pixaby з класу PixabayAPI.
// Створюємо об'єкт options з певними властивостями.

const loadMorePhotos = async function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      pixaby.incrementPage();

      spinnerPlay();

      try {
        spinnerPlay();

        const { hits } = await pixaby.getPhotos();
        const markup = createMarkup(hits);
        refs.gallery.insertAdjacentHTML('beforeend', markup);

        if (pixaby.hasMorePhotos) {
          const lastItem = document.querySelector('.gallery a:last-child');
          observer.observe(lastItem);
        } else
          Notify.info(
            "We're sorry, but you've reached the end of search results.",
            notifyInit
          );

        modalLightboxGallery.refresh();
        scrollPage();
      } catch (error) {
        Notify.failure(error.message, 'Something went wrong!', notifyInit);
        clearPage();
      } finally {
        spinnerStop();
      }
    }
  });
};

// Оголошуємо асинхронну функцію loadMorePhotos з параметрами entries і observer.
// Всередині функції loadMorePhotos перебираються всі entries (елементи), отримані від observer.
// Якщо елемент entry перетинає область, встановлену параметром rootMargin, то відміняється спостерігання
// за цим елементом (observer.unobserve(entry.target)), збільшується значення сторінки pixaby.incrementPage()
// і запускається функція spinnerPlay().
// Виконується асинхронне отримання фотографій з класу pixaby (pixaby.getPhotos()). Отриманий результат
// деструктуризується, із нього створюється розмітка (markup), яка вставляється в елемент refs.gallery.
// Перевіряється, чи є ще фотографії для завантаження (pixaby.hasMorePhotos). Якщо є, то встановлюється
// спостереження за останнім елементом галереї (observer.observe(lastItem)). Якщо немає, то виводиться
// повідомлення про досягнення кінця результатів пошуку.
// Оновлюємо галерею в модальному вікні (modalLightboxGallery.refresh()) і прокручується сторінка (scrollPage()).
// У випадку помилки показується повідомлення про помилку (Notify.failure(error.message, 'Something went wrong!',
// notifyInit)) і викликається функція clearPage().
// Незалежно від результату виконання блоку try-catch, викликається функція spinnerStop(), яка, зупиняє анімацію завантаження.

const observer = new IntersectionObserver(loadMorePhotos, options);

const onSubmitClick = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.target;

  const search_query = searchQuery.value.trim().toLowerCase();

  if (!search_query) {
    clearPage();
    Notify.info('Enter data to search!', notifyInit);

    refs.searchInput.placeholder = 'What`re we looking for?';
    return;
  }

  pixaby.query = search_query;

  clearPage();

  try {
    spinnerPlay();
    const { hits, total } = await pixaby.getPhotos();

    if (hits.length === 0) {
      Notify.failure(
        `Sorry, there are no images matching your ${search_query}. Please try again.`,
        notifyInit
      );

      return;
    }

    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    pixaby.setTotal(total);
    Notify.success(`Hooray! We found ${total} images.`, notifyInit);

    if (pixaby.hasMorePhotos) {
      const lastItem = document.querySelector('.gallery a:last-child');
      observer.observe(lastItem);
    }

    modalLightboxGallery.refresh();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!', notifyInit);

    clearPage();
  } finally {
    spinnerStop();
  }
};

// Створюємо новий об'єкт observer з класу IntersectionObserver, якому передається функція loadMorePhotos і об'єкт options.
// Цей об'єкт observer відстежує перетин елементів з областю видимості і викликає функцію loadMorePhotos, коли ці елементи перетинаються.
// Оголошуємо асинхронна функція onSubmitClick, яка приймає параметр event.
// Відбувається запобігання стандартної поведінки події (event.preventDefault()).
// Отримується значення поля введення з ім'ям searchQuery з форми, з якої відбулась подія event.target.
// Видаляються зайві пробіли з початку та кінця рядка та перетворюється введений рядок на нижній регістр (toLowerCase()).
// Перевіряється, чи введено значення для пошуку (search_query). Якщо ні, то викликається функція clearPage(), виводиться інформаційне
// повідомлення про необхідність ввести дані для пошуку (Notify.info('Enter data to search!', notifyInit)) і змінюється плейсхолдер
// поля введення на "What're we looking for?". Потім функція завершує свою роботу (return).
// Задається властивість query об'єкта pixaby з введеним рядком пошуку (pixaby.query = search_query).
// Викликається функція clearPage(), яка очищує сторінку від попереднього вмісту.
// У блоку try виконується наступне:
// Запускається анімація завантаження (spinnerPlay()).
// Виконується асинхронне отримання фотографій з класу pixaby (pixaby.getPhotos()). Отримані дані деструктуризуються, отримуються
// масив фотографій (hits) і загальна кількість фотографій (total).
// Якщо довжина масиву hits дорівнює 0, виводиться повідомлення про відсутність зображень, що відповідають введеному пошуковому запиту
// (Notify.failure(...)), і функція завершує свою роботу (return).
// Створюється розмітка (markup) з масиву фотографій hits і вставляється в елемент refs.gallery.
// Встановлюється значення загальної кількості фотографій (total) в об'єкті pixaby.
// Виводиться повідомлення про успішний результат пошуку з кількістю знайдених зображень (Notify.success(...)).
// Якщо є ще фотографії для завантаження (pixaby.hasMorePhotos), то встановлюється спостереження за останнім елементом галереї
// (observer.observe(lastItem)).
// Оновлюється галерея в модальному вікні (modalLightboxGallery.refresh()).
// У блоку catch оброблюється помилка: виводиться повідомлення про помилку (Notify.failure(...)) і викликається функція clearPage().
// У блоку finally зупиняється анімація завантаження (spinnerStop()).

const onLoadMore = async () => {
  pixaby.incrementPage();

  if (!pixaby.hasMorePhotos) {
    refs.btnLoadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
    notifyInit;
  }
  try {
    const { hits } = await pixaby.getPhotos();
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    modalLightboxGallery.refresh();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!', notifyInit);

    clearPage();
  }
};

// Функція onLoadMore інкрементує сторінку (pixaby.incrementPage()), що дозволяє отримувати наступну порцію
// фотографій з піксаби. Перевіряє, чи є ще більше фотографій для завантаження (pixaby.hasMorePhotos).
// Якщо немає, то: додає клас "is-hidden" до елемента з ідентифікатором "btnLoadMore" , що робить його невидимим на сторінці.
// Виводить повідомлення за допомогою Notify.info() з текстом "We're sorry...".
// Викликає функцію notifyInit.
// У випадку, якщо є ще фотографії для завантаження, функція виконується наступне:
// Отримує фотографії за допомогою функції pixaby.getPhotos() і деструктуризує об'єкт, щоб отримати властивість
// "hits" з результатами. Створює розмітку (markup) за допомогою функції createMarkup() і передає отримані
// фотографії (hits) як аргумент. Вставляє отриману розмітку в кінець галереї за допомогою
// refs.gallery.insertAdjacentHTML('beforeend', markup). Оновлює галерею світлової скриньки
// (modalLightboxGallery.refresh()). Якщо під час отримання фотографій або оновлення галереї сталася
// помилка, виконується наступне:
// Виводить повідомлення про помилку за допомогою Notify.failure() з текстом помилки і заголовком
// "Something went wrong!".
// Викликає функцію notifyInit.
// Викликає функцію clearPage(), яка очищає сторінку.

function clearPage() {
  pixaby.resetPage();
  refs.gallery.innerHTML = '';
  refs.btnLoadMore.classList.add('is-hidden');
}

// Оголошуєм функцію clearPage(), яка очищає сторінку.
// pixaby.resetPage() скидає значення сторінки в піксабі до початкового значення.
// refs.gallery.innerHTML = '' очищає вміст галереї, встановлюючи порожній рядок в якості HTML-вмісту.
// refs.btnLoadMore.classList.add('is-hidden') додає клас "is-hidden" до елемента з ідентифікатором "btnLoadMore",
// що робить його невидимим на сторінці.

refs.form.addEventListener('submit', onSubmitClick); // додаєм обробник події "submit" до форми, який викликає функцію onSubmitClick під час подання форми.
refs.btnLoadMore.addEventListener('click', onLoadMore); //додаєм обробник події "click" до кнопки з ідентифікатором "btnLoadMore", який викликає функцію onLoadMore під час натискання на кнопку "Load More".



//  smooth scrolling
function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.photo-gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// Оголошуєм функцію scrollPage(), яка викликається для прокручування сторінки.
// У цій функції виконується наступне:
// За допомогою методу querySelector('.photo-gallery') вибирається перший елемент з класом "photo-gallery"
// в документі. За допомогою .firstElementChild отримується перший дочірній елемент цього вибраного елемента
// (перший дочірній елемент .photo-gallery). За допомогою .getBoundingClientRect() отримується об'єкт
// DOMRect, який містить властивості, такі як height, width, top, bottom, left, right, що описують розміри
// та позицію вибраного елемента на сторінці.
// За допомогою деструктуризації об'єкта, властивість height зберігається в змінну cardHeight.
// Викликається метод window.scrollBy(), який прокручує сторінку на вказану величину. У даному випадку,
// сторінка прокручується вниз на висоту cardHeight помножену на 2.
// behavior: 'smooth' вказує, що прокручування має бути плавним.


//Button smooth scroll up

window.addEventListener('scroll', scrollFunction);

// Встановлюєм обробник події scroll на об'єкт window.
// При прокручуванні сторінки буде викликатися функція scrollFunction.

function scrollFunction() {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    refs.btnUpWrapper.style.display = 'flex';
  } else {
    refs.btnUpWrapper.style.display = 'none';
  }
}
refs.btnUp.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Оголошуєм функцію scrollFunction(), яка перевіряє, наскільки прокручена сторінка і відповідно встановлює
// видимість кнопки повернення вгору. Умова document.body.scrollTop > 30 || document.documentElement.scrollTop > 30
// перевіряє, чи сторінка прокручена вниз на відстань більше 30 пікселів, якщо так, то виконується блок коду
// у фігурних дужках. У цьому блоку коду refs.btnUpWrapper.style.display = 'flex'; встановлює видимість
// для елемента з ідентифікатором btnUpWrapper на значення 'flex', що робить його видимим.
// Якщо умова не виконується (сторінка не прокручена вниз на відстань більше 30 пікселів), то виконується
// блок коду у ключовому слові else. У цьому блоку коду refs.btnUpWrapper.style.display = 'none'; встановлює
// видимість для елемента з ідентифікатором btnUpWrapper на значення 'none', що робить його невидимим.
// Додаєм обробник події click до кнопки з ідентифікатором btnUp. При натисканні на цю кнопку сторінка
// прокручується до верху за допомогою window.scrollTo({ top: 0, behavior: 'smooth' });.
// behavior: 'smooth' вказує, що прокручування має бути плавним.