# Content Map

## IA Thesis

Главная сущность каталога — направление. Пользователь двигается по цепочке:

```text
Направление -> Курс -> Программа курса
```

Небольшие темы, инструменты и отдельные навыки не создаются как самостоятельные курсы. Они живут внутри модулей полноценного курса.

## Routes

- `/` — общая главная "Практики".
- `/directions` — каталог направлений с фильтрами по аудитории и возрасту.
- `/directions/:direction` — страница направления и список его курсов.
- `/courses` — каталог всех полноценных курсов.
- `/courses/:course` — страница курса с описанием, результатом и модулями.
- `/children` — подборка курсов для детей.
- `/teens` — подборка курсов для подростков.
- `/adults` — подборка курсов для взрослых.
- `/branches` — выбор города/района/филиала.
- `/about` — о проекте и принципе обучения через практику.
- `/contacts` — контакты и заявка.

Legacy routes `/:direction` and `/:direction/:course` still resolve for compatibility, but new navigation should use `/directions/...` and `/courses/...`.

## Content Model

- `Direction` — крупная область обучения: языки, IT, маркетинг, творчество, автошкола и т. д.
- `Course` — законченная образовательная программа, на которую можно записаться.
- `CourseModule` — темы внутри курса.

Examples:

- `Маркетинг -> Интернет-маркетолог -> Основы маркетинга / ЦА / Позиционирование и УТП / Каналы / Аналитика`.
- `Автошкола -> Категория B -> ПДД / устройство автомобиля / практика / экзамен`.

## Shared Page Blocks

- Header.
- Hero.
- Audience switcher.
- Direction cards.
- Course cards.
- Course modules.
- Branch selector.
- Lead form.
- FAQ accordion.
- Footer.

## Required Unknowns

These must be replaced after confirmation:

- branch addresses;
- phone number;
- messenger URLs;
- prices;
- teachers and instructors;
- reviews;
- legal links and documents;
- official course durations and group sizes;
- approved final SVG logo and icon set.
