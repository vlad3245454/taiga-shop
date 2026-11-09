# Сайт-витрина (Сибирь и Алтай), Благовещенск

Статический сайт: HTML/CSS/JS без фреймворков. Подходит для GitHub Pages и любого дешёвого хостинга.

## Предпросмотр
Каталог читается из `products.json`, поэтому открывать нужно через веб-сервер:
```bash
python3 -m http.server 8080
```
Затем откройте http://localhost:8080

## Структура
- `index.html`, `catalog.html`, `order.html`, `about.html`, `gallery.html`, `faq.html`, `contacts.html` — страницы
- `config.js` — название, контакты, ссылка Max, путь к логотипу, endpoint форм
- `products.json` — категории и товары
- `css/style.css`, `js/app.js` — оформление и логика
- `assets/` — логотип (`logo.png`), `favicon.svg`, `img/` (картинки-заглушки)

## Список заглушек (что заменить)
| Что | Где |
|---|---|
| Название магазина `Магия тайги` | `config.js` → `shopName`. В `<title>` и `og:title` каждого HTML тоже есть запасное `Магия тайги` — заменить поиском по проекту (JS подставляет название сам) |
| Слоган | `config.js` → `tagline` |
| Логотип | положить файл `assets/logo.png` (или изменить `logoPath` в `config.js`). Подхватится в шапке, hero, подвале и favicon. Пока файла нет — круглая заглушка с буквой |
| Ссылка Max | `config.js` → `maxUrl` (например `https://max.ru/...`) |
| Адрес сайта (для Open Graph и schema.org) | `config.js` → `siteUrl` |
| Отправка заказа и формы контактов | `config.js` → `orderEndpoint`, `feedbackEndpoint` (например Formspree: `https://formspree.io/f/xxxx`) |
| Товары и цены (12 демо-товаров) | `products.json` |
| Фото товаров | заменить файлы в `assets/img/` и пути `image` в `products.json` |
| Фото галереи (8 заглушек) | `assets/img/gallery-1.svg … gallery-8.svg`, разметка в `gallery.html` |
| Текст «О нас» (временный) | `about.html`, блок с классом `temp` |
| Ответы FAQ (временные) | `faq.html`, абзацы с классом `temp` |
| Картинка для соцсетей (`og:image`) | не добавлена; добавить `<meta property="og:image">` в `<head>` страниц |

Временные тексты подсвечены жёлтой полосатой рамкой. После замены уберите класс `temp` и подпись «Временный текст».

## Как это работает
- Корзина хранится в `localStorage` (ключ `storageKey` в `config.js`).
- «Отправить заказ в Max»: текст заказа копируется в буфер обмена и открывается чат Max (у Max нет ссылки с готовым текстом). Если `maxUrl` пуст — подсказка позвонить.
- Разметка schema.org `LocalBusiness` (адрес, график) генерируется из `config.js`.
