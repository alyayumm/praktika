export type Audience = 'self' | 'child';

export type DirectionSlug =
  | 'languages'
  | 'driving'
  | 'robotics'
  | 'school'
  | 'creative'
  | 'digital';

export interface Program {
  slug: string;
  title: string;
  audience: Audience[];
  age: string;
  summary: string;
  result: string;
  format: string;
}

export interface Direction {
  slug: DirectionSlug;
  title: string;
  shortTitle: string;
  headline: string;
  summary: string;
  audience: Audience[];
  ages: string[];
  doodle: string;
  image: string;
  heroImage?: string;
  programs: Program[];
  outcomes: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export interface Branch {
  id: string;
  title: string;
  district: string;
  address: string;
  availability: DirectionSlug[];
}

export const audienceLabels: Record<Audience, string> = {
  self: 'Для себя',
  child: 'Для ребёнка',
};

export const directions: Direction[] = [
  {
    slug: 'languages',
    title: 'Языковые курсы',
    shortTitle: 'Языки',
    headline: 'Иностранный язык через разговор, ошибки и живую практику',
    summary:
      'Занятия для детей, подростков и взрослых: говорим, разбираем ошибки, возвращаемся к реальным ситуациям и не прячемся за учебником.',
    audience: ['self', 'child'],
    ages: ['6+', '12+', '18+'],
    doodle: 'Речевые облака, подчёркивания и правки',
    image: 'assets/direction-icon-languages.png',
    programs: [
      {
        slug: 'english-adults',
        title: 'Английский для взрослых',
        audience: ['self'],
        age: '18+',
        summary: 'Разговорная практика, рабочие сценарии и уверенность в реальных диалогах.',
        result: 'Студент собирает личный словарь ситуаций и начинает говорить без долгой подготовки.',
        format: 'Группа или индивидуально; длительность и стоимость требуют подтверждения.',
      },
      {
        slug: 'english-kids',
        title: 'Английский для детей',
        audience: ['child'],
        age: '6+',
        summary: 'Мягкий вход в язык через игры, речь, повторение и понятную обратную связь.',
        result: 'Ребёнок понимает базовые фразы, отвечает вслух и не боится ошибиться.',
        format: 'Группа по возрасту; расписание и стоимость требуют подтверждения.',
      },
    ],
    outcomes: [
      'говорить в бытовых и учебных ситуациях',
      'понимать свои типовые ошибки',
      'держать регулярный темп практики',
    ],
    faqs: [
      {
        question: 'Можно ли начать с нуля?',
        answer: 'Да. Уровень и формат группы лучше определить после короткой консультации.',
      },
      {
        question: 'Есть ли занятия для взрослых?',
        answer: 'Да, направление рассчитано и на взрослых учеников, и на детей.',
      },
    ],
  },
  {
    slug: 'driving',
    title: 'Автошкола',
    shortTitle: 'Автошкола',
    headline: 'Учиться водить через понятный маршрут, движение и разбор ошибок',
    summary:
      'Направление для тех, кто хочет пройти путь от теории к уверенному вождению с понятной структурой занятий и практическими ориентирами.',
    audience: ['self'],
    ages: ['16+', '18+'],
    doodle: 'Траектории, стрелки, разметка и движение',
    image: 'assets/direction-icon-driving.png',
    heroImage: 'assets/mascot-driving.png',
    programs: [
      {
        slug: 'category-b',
        title: 'Категория B',
        audience: ['self'],
        age: '18+',
        summary: 'Базовый маршрут обучения вождению: теория, практика, разбор сложных ситуаций.',
        result: 'Ученик понимает правила движения, тренирует манёвры и готовится к экзаменационному маршруту.',
        format: 'Точный график, филиалы и стоимость требуют подтверждения.',
      },
      {
        slug: 'first-drive',
        title: 'Первая консультация по обучению',
        audience: ['self'],
        age: '16+',
        summary: 'Помогает понять сроки, формат и удобный филиал до выбора программы.',
        result: 'Появляется понятный план: где заниматься, с чего начать и какие документы нужны.',
        format: 'Консультация; условия требуют подтверждения.',
      },
    ],
    outcomes: [
      'видеть обучение как маршрут, а не набор случайных занятий',
      'разбирать ошибки после практики',
      'понимать требования к экзамену и дальнейшим шагам',
    ],
    faqs: [
      {
        question: 'Можно ли сначала получить консультацию?',
        answer: 'Да. Форма заявки передаёт выбранное направление и страницу, чтобы менеджер видел контекст.',
      },
      {
        question: 'Где проходят занятия?',
        answer: 'Филиалы для автошколы нужно подтвердить после передачи актуального списка адресов.',
      },
    ],
  },
  {
    slug: 'robotics',
    title: 'Робототехника',
    shortTitle: 'Роботы',
    headline: 'Собирать, проверять гипотезы и видеть, как идея начинает двигаться',
    summary:
      'Практическое направление для детей и подростков: схемы, детали, логика, командная работа и понятный результат занятия.',
    audience: ['child'],
    ages: ['7+', '10+', '12+'],
    doodle: 'Схемы, провода и детали',
    image: 'assets/direction-icon-robotics.png',
    programs: [
      {
        slug: 'robotics-8-12',
        title: 'Робототехника 8-12',
        audience: ['child'],
        age: '8-12',
        summary: 'Сборка, простая логика, тесты и мини-задачи на каждом занятии.',
        result: 'Ребёнок связывает идею, схему и действие устройства.',
        format: 'Группа по возрасту; расписание и стоимость требуют подтверждения.',
      },
    ],
    outcomes: [
      'собирать модель по задаче',
      'понимать причинно-следственные связи',
      'исправлять ошибку через тест, а не угадывание',
    ],
    faqs: [
      {
        question: 'Нужна ли подготовка?',
        answer: 'Для стартовых групп предварительная подготовка не обязательна.',
      },
    ],
  },
  {
    slug: 'school',
    title: 'Школьные предметы',
    shortTitle: 'Школа',
    headline: 'Разобраться в теме через черновик, вопрос и повторную попытку',
    summary:
      'Поддержка по школьным предметам без ощущения наказания: меньше страха, больше понятных шагов и регулярной практики.',
    audience: ['child'],
    ages: ['7+', '10+', '14+'],
    doodle: 'Формулы, черновые записи и исправления',
    image: 'assets/direction-icon-school.png',
    programs: [
      {
        slug: 'math-support',
        title: 'Математика без провалов',
        audience: ['child'],
        age: '10+',
        summary: 'Закрываем пробелы, тренируем задачи и учимся объяснять ход решения.',
        result: 'Школьник понимает слабые места и получает план регулярной практики.',
        format: 'Индивидуально или мини-группа; условия требуют подтверждения.',
      },
    ],
    outcomes: [
      'видеть логику темы',
      'тренироваться без стыда за ошибку',
      'готовиться к контрольным через понятные шаги',
    ],
    faqs: [
      {
        question: 'Можно ли прийти с конкретной темой?',
        answer: 'Да. В заявке можно указать предмет и текущую задачу.',
      },
    ],
  },
  {
    slug: 'creative',
    title: 'Творческие занятия',
    shortTitle: 'Творчество',
    headline: 'Пробовать материалы, искать форму и собирать свой видимый результат',
    summary:
      'Направление для детей и взрослых, где важны попытка, след, выбор и удовольствие от процесса.',
    audience: ['self', 'child'],
    ages: ['5+', '12+', '18+'],
    doodle: 'Мазки, карандашные следы и бумага',
    image: 'assets/direction-icon-creative.png',
    heroImage: 'assets/mascot-creative.png',
    programs: [
      {
        slug: 'creative-lab',
        title: 'Творческая лаборатория',
        audience: ['self', 'child'],
        age: '5+',
        summary: 'Практика с материалами, быстрые задания и личная работа к концу занятия.',
        result: 'Участник пробует техники и собирает небольшой завершённый объект.',
        format: 'Возрастные группы; программа и стоимость требуют подтверждения.',
      },
    ],
    outcomes: [
      'пробовать разные техники',
      'развивать внимательность к форме и цвету',
      'доводить практику до результата',
    ],
    faqs: [
      {
        question: 'Можно ли взрослым?',
        answer: 'Да, направление предполагает отдельные сценарии для взрослых и детей.',
      },
    ],
  },
  {
    slug: 'digital',
    title: 'Цифровые навыки',
    shortTitle: 'Digital',
    headline: 'Делать руками: от курсора и окна до собственного цифрового проекта',
    summary:
      'Практика цифровых инструментов, логики интерфейсов и полезных навыков без сухой лекционной подачи.',
    audience: ['self', 'child'],
    ages: ['10+', '14+', '18+'],
    doodle: 'Курсоры, сетки, окна и пиксельные элементы',
    image: 'assets/direction-icon-digital.png',
    programs: [
      {
        slug: 'digital-start',
        title: 'Цифровой старт',
        audience: ['self', 'child'],
        age: '10+',
        summary: 'Базовые цифровые действия, аккуратность, файлы, сервисы и первый мини-проект.',
        result: 'Ученик увереннее работает с цифровыми инструментами и понимает логику процесса.',
        format: 'Формат и стоимость требуют подтверждения.',
      },
    ],
    outcomes: [
      'ориентироваться в цифровых инструментах',
      'создавать небольшой проект',
      'понимать структуру файлов, окон и действий',
    ],
    faqs: [
      {
        question: 'Это программирование?',
        answer: 'Наполнение зависит от программы. Сейчас нужна финальная матрица курсов.',
      },
    ],
  },
];

export const branches: Branch[] = [
  {
    id: 'branch-a',
    title: 'Филиал A',
    district: 'район требует подтверждения',
    address: 'адрес требует подтверждения',
    availability: ['languages', 'driving', 'school'],
  },
  {
    id: 'branch-b',
    title: 'Филиал B',
    district: 'район требует подтверждения',
    address: 'адрес требует подтверждения',
    availability: ['robotics', 'creative', 'digital', 'languages'],
  },
  {
    id: 'consultation',
    title: 'Подбор филиала',
    district: 'поможем выбрать после заявки',
    address: 'актуальный адрес уточняется менеджером',
    availability: ['languages', 'driving', 'robotics', 'school', 'creative', 'digital'],
  },
];

export const siteMap = [
  { path: '/', label: 'Главная' },
  { path: '/directions', label: 'Все направления' },
  { path: '/branches', label: 'Филиалы' },
  { path: '/about', label: 'О проекте' },
  { path: '/contacts', label: 'Контакты' },
  ...directions.map((direction) => ({
    path: `/${direction.slug}`,
    label: direction.title,
  })),
];

export function findDirection(slug: string) {
  return directions.find((direction) => direction.slug === slug);
}

export function findProgram(directionSlug: string, programSlug: string) {
  const direction = findDirection(directionSlug);
  return {
    direction,
    program: direction?.programs.find((item) => item.slug === programSlug),
  };
}

export function programPath(direction: Direction, program: Program) {
  return `/${direction.slug}/${program.slug}`;
}
