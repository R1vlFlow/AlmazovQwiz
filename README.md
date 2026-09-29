# AlmazovQwiz Beta 2.2.0

Обновлённая система карточек для анатомии.

## Что изменено

- Новая шторка выбора режима вместо обычного select: **Изучение, Карточки, Тест, Экзамен, Написание**.
- В тестах и экзаменах создаётся отдельная случайная последовательность.
- Алгоритм перемешивания старается не ставить подряд карточки одной темы и одного типа.
- Тест: до 12 вопросов; экзамен: до 20 вопросов.
- Кнопка «Случайный вопрос» внутри сессии.
- Навигация «Назад» не возвращает случайно выбранный старый вопрос браузерной историей: она корректно завершает текущую сессию и возвращает к наборам.
- Добавлены отдельные тематические наборы:
  - Череп
  - Позвонки
  - Рёбра и грудина
  - Скелет верхней конечности
  - Скелет нижней конечности
  - Осевой скелет
- Добавлены 274 карточки в новых наборах, включая визуальные вопросы.
- Визуальные карточки поддерживают маркер выделенной области.
- Визуальные изображения подключены из Wikimedia Commons с открытыми лицензиями; источники указаны ниже.
- Старая широкая база и существующие наборы сохранены.

## Визуальные источники

1. HumerusFront.png — Wikimedia Commons, public domain:
   https://commons.wikimedia.org/wiki/File:HumerusFront.png
2. HumerusBack.png — Wikimedia Commons, CC BY-SA 3.0:
   https://commons.wikimedia.org/wiki/File:HumerusBack.png
3. Atlas vertebrae.jpg — Wikimedia Commons, CC BY-SA 3.0:
   https://commons.wikimedia.org/wiki/File:Atlas_vertebrae.jpg
4. Gray122.png — Wikimedia Commons:
   https://commons.wikimedia.org/wiki/File:Gray122.png
5. Scapula.png — Wikimedia Commons, CC BY-SA 4.0:
   https://commons.wikimedia.org/wiki/File:Scapula.png
6. Femur front.png — Wikimedia Commons, public domain:
   https://commons.wikimedia.org/wiki/File:Femur_front.png
7. Tibia svg hariadhi.svg — Wikimedia Commons, CC BY-SA 4.0:
   https://commons.wikimedia.org/wiki/File:Tibia_svg_hariadhi.svg
8. Skull foramina labeled.svg — Wikimedia Commons, CC BY-SA:
   https://commons.wikimedia.org/wiki/File:Skull_foramina_labeled.svg

> Визуальные изображения используются как внешние источники, поэтому для полноценной офлайн-работы их можно на следующем этапе перенести в локальный `assets/anatomy/` после проверки лицензий и атрибуции.

## Структура

- `index.html` — оболочка приложения
- `app.js` — логика, банк карточек, алгоритм сессий
- `styles.css` — интерфейс
- `sw.js` — Service Worker
- `assets/cards/` — текущие изображения учебника
