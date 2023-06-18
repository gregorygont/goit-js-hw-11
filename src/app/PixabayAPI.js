import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '37327294-d8696cb85b1b72eb2fd6f02c1';
// Імпорт axios і налаштування базового URL для запитів до API Pixabay.
// Оголошення константи API_KEY, яка використовується для доступу до API.


export class PixabayAPI {
    #page = 1;
    #per_page = 40;
    #query = '';
    #totalPages = 0;

    async getPhotos() {
        const params = {
            page: this.#page,
            q: this.#query,
            per_page: this.#per_page,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
        }


        const urlAXIOS = `?key=${API_KEY}`;
                const { data } = await axios.get(urlAXIOS, { params, });
        return data;
    }

        get query() {
        this.#query;
    }

    set query(newQuery) {
        this.#query = newQuery;
    }

    incrementPage() {
        this.#page += 1;
    }

    resetPage() {
        this.#page = 1;
    }

    setTotal(total) {
        this.#totalPages = total;
    }

    hasMorePhotos() {
        return this.#page < Math.ceil(this.#totalPages / this.#per_page);
    }
}

// Визначаємо клас PixabayAPI, який надає методи для отримання фотографій з API Pixabay. 
// Основний функціонал класу включає:
// Оголошення приватних полів класу, таких як page, per_page, query та totalPages, які зберігають 
// поточні значення сторінки, кількості елементів на сторінці, пошукового запиту та загальної 
// кількості сторінок результатів.
// Метод getPhotos(), який виконує запит до API Pixabay з використанням axios.get(). 
// Він використовує поточні значення сторінки, запиту та кількості елементів на сторінці для 
// створення запиту. Повертає відповідь API в форматі JSON.
// Методи get query(), set query(newQuery), incrementPage(), resetPage(), setTotal(total) 
// і hasMorePhotos(), які надають доступ до приватних полів класу та виконують операції зміни запиту,
// збільшення/скидання сторінки, встановлення загальної кількості сторінок та перевірки наявності 
// більше фотографій для завантаження.
// Цей код дозволяє взаємодіяти з API Pixabay для отримання фотографій, зміни параметрів запиту 
// та переходу між сторінками результатів.