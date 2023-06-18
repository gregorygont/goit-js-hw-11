export function createMarkup(photos) {
  return photos
    .map(
      ({
        tags,
        webformatURL,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return /*html*/ `
            <a href='${largeImageURL}' class="card-link js-card-link">
              <div class="photo-card">
                <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                  <div class="info-item info-item-likes">
                    <button type="button" class="circle" onclick="style.boxShadow='inset -1px -1px 3px white, inset 1px 1px 3px rgba(0, 0, 0, 0.1)'">
                      <i class="bi bi-heart-fill" onclick="style.color='#ff0000'"></i>
                    </button>
                    <div class="box-likes"><b>Likes</b>
                    <span id="value">${likes}</span>
                    </div>
                                        
                  </div>
                  <p class="info-item">
                    <b>Views</b>
                    ${views}
                  </p>
                  <p class="info-item">
                    <b>Comments</b>
                    ${comments}
                  </p>
                  <p class="info-item">
                    <b>Downloads</b>
                    ${downloads}
                  </p>
                </div>
              </div>
            </a>`;
      }
    )
    .join('');
}

// Функція createMarkup, приймає масив об'єктів photos як аргумент. Функція обробляє кожен елемент масиву
// photos та створює HTML-розмітку для кожного фото. Для кожного фото з масиву photos, функція використовує
// деструктуризацію, щоб отримати необхідні властивості: tags, webformatURL, largeImageURL, likes, views,
// comments і downloads. Потім, з використанням шаблонних літералів (template literals) JavaScript, функція
// формує HTML-розмітку, що містить інформацію про фото та його властивості. Створюється посилання <a> з
// href, що вказує на largeImageURL, класом card-link та обробником події js-card-link. Всередині посилання
// знаходиться контейнер <div> із класом photo-card. Усередині контейнера розміщується зображення <img> з
// класом photo, src, що вказує на webformatURL, та альтернативним текстом alt, що містить tags.
// Використовується атрибут loading="lazy", щоб зображення завантажувалося ліниво, покращуючи продуктивність.
// Після зображення слідує блок із класом info, що містить додаткову інформацію про фото. У блоці info
// знаходяться кілька абзаців (<p>), кожен з яких є властивістю фото з відповідним значенням. Наприклад,
// views, comments і downloads. У блоці info також є елемент із класом info-item-likes, який містить кнопку
// із класом circle та іконку серця. При натисканні на кнопку або іконку виконуються певні дії, такі як
// зміна стилів елементів. Насамкінець, функція map() застосовується до масиву photos, щоб створити
// HTML-розмітку для кожного фото. Результати об'єднуються за допомогою join(''), щоб отримати один рядок
// HTML-коду, що містить розмітку для всіх фото. У результаті функція createMarkup генерує HTML-код,
// який відображає список фотографій з інформацією про кожну фотографію, включаючи властивості, такі як
// лайки, перегляди, коментарі та завантаження. Цей код можна використовувати для динамічного створення
// та оновлення галереї фотографій на веб-сторінці.
