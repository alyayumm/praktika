export type Audience = 'children' | 'teens' | 'adults';

export type DirectionSlug =
  | 'languages'
  | 'school'
  | 'exams'
  | 'it'
  | 'robotics'
  | 'ai'
  | 'marketing'
  | 'design'
  | 'business'
  | 'communications'
  | 'finance'
  | 'career'
  | 'kids-development'
  | 'creative'
  | 'driving';

export type CourseFormat = 'course' | 'club' | 'intensive';

export interface CourseModule {
  title: string;
  topics: string[];
}

export interface Course {
  id: string;
  slug: string;
  directionId: DirectionSlug;
  title: string;
  description: string;
  summary: string;
  audience: Audience[];
  age?: string;
  format: CourseFormat;
  formatLabel: string;
  image?: string;
  duration?: string;
  groupSize?: string;
  popular?: boolean;
  result: string;
  modules: CourseModule[];
}

export type Program = Course;

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
  courses: Course[];
  /** Compatibility alias for old UI components. New code should use courses. */
  programs: Course[];
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
  children: 'Детям',
  teens: 'Подросткам',
  adults: 'Взрослым',
};

const allDirectionSlugs: DirectionSlug[] = [
  'languages',
  'school',
  'exams',
  'it',
  'robotics',
  'ai',
  'marketing',
  'design',
  'business',
  'communications',
  'finance',
  'career',
  'kids-development',
  'creative',
  'driving',
];

type CourseInput = Omit<Course, 'id' | 'summary' | 'modules'> & {
  modules?: CourseModule[];
};

type DirectionInput = Omit<Direction, 'programs'>;

function defaultModules(title: string): CourseModule[] {
  return [
    {
      title: `Модуль 1. Старт курса «${title}»`,
      topics: ['диагностика уровня', 'цель обучения', 'первый практический разбор'],
    },
    {
      title: 'Модуль 2. Основные инструменты',
      topics: ['ключевые понятия', 'практические задания', 'типовые ошибки'],
    },
    {
      title: 'Модуль 3. Практика и обратная связь',
      topics: ['работа над задачами', 'разбор результата', 'повторная попытка'],
    },
    {
      title: 'Модуль 4. Итоговый проект',
      topics: ['сборка результата', 'презентация работы', 'план следующего шага'],
    },
  ];
}

function course(input: CourseInput): Course {
  return {
    ...input,
    id: `${input.directionId}-${input.slug}`,
    summary: input.description,
    modules: input.modules ?? defaultModules(input.title),
  };
}

function direction(input: DirectionInput): Direction {
  return {
    ...input,
    programs: input.courses,
  };
}

const marketingModules: CourseModule[] = [
  {
    title: 'Модуль 1. Основы маркетинга',
    topics: ['рынок', 'продукт', 'потребитель', 'основные каналы продвижения'],
  },
  {
    title: 'Модуль 2. Целевая аудитория',
    topics: ['сегментация', 'потребности', 'Customer Journey', 'гипотезы спроса'],
  },
  {
    title: 'Модуль 3. Позиционирование',
    topics: ['конкуренты', 'ценностное предложение', 'УТП', 'сообщение бренда'],
  },
  {
    title: 'Модуль 4. Интернет-продвижение',
    topics: ['сайт', 'контент', 'рекламные каналы', 'воронка'],
  },
  {
    title: 'Модуль 5. Аналитика и итоговая стратегия',
    topics: ['метрики', 'отчётность', 'выводы', 'итоговый проект'],
  },
];

const salesModules: CourseModule[] = [
  {
    title: 'Модуль 1. Логика продажи',
    topics: ['этапы продаж', 'роль менеджера', 'контекст клиента'],
  },
  {
    title: 'Модуль 2. Диалог с клиентом',
    topics: ['выявление потребностей', 'презентация', 'вопросы'],
  },
  {
    title: 'Модуль 3. Возражения и переговоры',
    topics: ['типовые возражения', 'аргументация', 'закрытие следующего шага'],
  },
  {
    title: 'Модуль 4. Система работы',
    topics: ['CRM', 'повторные продажи', 'план коммуникаций'],
  },
];

const categoryBModules: CourseModule[] = [
  {
    title: 'Модуль 1. Теория и правила',
    topics: ['ПДД', 'знаки и разметка', 'разбор дорожных ситуаций'],
  },
  {
    title: 'Модуль 2. Устройство и безопасность',
    topics: ['основы устройства автомобиля', 'безопасное управление', 'первая помощь'],
  },
  {
    title: 'Модуль 3. Практическое вождение',
    topics: ['манёвры', 'городской маршрут', 'типовые ошибки'],
  },
  {
    title: 'Модуль 4. Подготовка к экзамену',
    topics: ['контрольные задания', 'экзаменационный маршрут', 'план повторения'],
  },
];

export const directions: Direction[] = [
  direction({
    slug: 'languages',
    title: 'Иностранные языки',
    shortTitle: 'Языки',
    headline: 'Иностранные языки через разговор, ошибки и живую практику',
    summary: 'Английский, китайский и другие языки для детей, подростков и взрослых.',
    audience: ['children', 'teens', 'adults'],
    ages: ['6+', '12+', '18+'],
    doodle: 'Речевые облака, подчёркивания и правки',
    image: 'assets/direction-icon-languages.png',
    heroImage: 'assets/mascot-languages-flags.webp',
    courses: [
      course({ directionId: 'languages', slug: 'english-a1', title: 'Английский A1', description: 'Полноценный стартовый курс английского языка для базового общения.', audience: ['teens', 'adults'], age: '12+', format: 'course', formatLabel: 'Офлайн · группы', image: 'assets/mascot-english-guard.webp', popular: true, result: 'Ученик понимает базовые фразы и начинает говорить в простых ситуациях.' }),
      course({ directionId: 'languages', slug: 'english-a2', title: 'Английский A2', description: 'Курс для продолжения: бытовые темы, грамматика и регулярная разговорная практика.', audience: ['teens', 'adults'], age: '12+', format: 'course', formatLabel: 'Офлайн · группы', image: 'assets/mascot-english-guard.webp', result: 'Появляется устойчивый словарь для повседневного общения.' }),
      course({ directionId: 'languages', slug: 'english-b1', title: 'Английский B1', description: 'Программа для уверенного общения, чтения и обсуждения знакомых тем.', audience: ['teens', 'adults'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', image: 'assets/mascot-english-guard.webp', result: 'Ученик поддерживает диалог и объясняет свою мысль без долгой подготовки.' }),
      course({ directionId: 'languages', slug: 'spoken-english', title: 'Разговорный английский', description: 'Практический курс для диалогов, обсуждений и снятия языкового барьера.', audience: ['teens', 'adults'], age: '14+', format: 'course', formatLabel: 'Офлайн · мини-группы', image: 'assets/mascot-english-guard.webp', popular: true, result: 'Больше живой речи и меньше страха ошибиться.' }),
      course({ directionId: 'languages', slug: 'business-english', title: 'Деловой английский', description: 'Курс для рабочих ситуаций: переписка, встречи, презентации и переговоры.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', image: 'assets/mascot-english-guard.webp', result: 'Ученик готовит рабочие фразы и сценарии под свою профессиональную задачу.' }),
      course({ directionId: 'languages', slug: 'english-kids', title: 'Английский для детей', description: 'Мягкое знакомство с языком через речь, игры, повторение и обратную связь.', audience: ['children'], age: '6+', format: 'course', formatLabel: 'Офлайн · детские группы', image: 'assets/mascot-english-guard.webp', result: 'Ребёнок понимает простые фразы и отвечает вслух.' }),
      course({ directionId: 'languages', slug: 'french-start', title: 'Французский с нуля', description: 'Стартовый курс французского языка: произношение, базовые фразы и первые диалоги.', audience: ['teens', 'adults'], age: '12+', format: 'course', formatLabel: 'Офлайн · группы', image: 'assets/mascot-french-baguette.webp', result: 'Ученик начинает читать, произносить и говорить в простых ситуациях.' }),
      course({ directionId: 'languages', slug: 'italian-start', title: 'Итальянский с нуля', description: 'Базовая программа итальянского языка для путешествий, общения и регулярной практики.', audience: ['teens', 'adults'], age: '12+', format: 'course', formatLabel: 'Офлайн · группы', image: 'assets/mascot-italian-vespa.webp', result: 'Появляется первый словарь, понятная грамматика и уверенность в простом диалоге.' }),
      course({ directionId: 'languages', slug: 'japanese-start', title: 'Японский с нуля', description: 'Вход в японский язык через письменность, произношение, лексику и культурный контекст.', audience: ['teens', 'adults'], age: '12+', format: 'course', formatLabel: 'Офлайн · группы', image: 'assets/mascot-japanese.webp', result: 'Ученик понимает базовую структуру языка и делает первые письменные и устные шаги.' }),
      course({ directionId: 'languages', slug: 'chinese-start', title: 'Китайский с нуля', description: 'Базовая программа китайского языка для первого системного входа.', audience: ['teens', 'adults'], age: '12+', format: 'course', formatLabel: 'Офлайн · группы', image: 'assets/mascot-chinese.webp', result: 'Появляется понятная база произношения, иероглифики и простых диалогов.' }),
    ],
    outcomes: ['говорить в бытовых и учебных ситуациях', 'понимать свои типовые ошибки', 'держать регулярный темп практики'],
    faqs: [
      { question: 'Можно ли начать с нуля?', answer: 'Да. Уровень и формат группы лучше определить после короткой консультации.' },
      { question: 'Есть ли занятия для взрослых?', answer: 'Да, направление рассчитано на взрослых, подростков и детей.' },
    ],
  }),
  direction({
    slug: 'school',
    title: 'Школьное образование',
    shortTitle: 'Школа',
    headline: 'Школьные предметы без провалов и страха ошибки',
    summary: 'Предметные курсы, повышение успеваемости и подготовка к школьному формату.',
    audience: ['children', 'teens'],
    ages: ['6+', '7+', '10+', '14+'],
    doodle: 'Формулы, черновые записи и исправления',
    image: 'assets/direction-icon-school.png',
    courses: [
      course({ directionId: 'school', slug: 'school-prep', title: 'Подготовка к школе', description: 'Большой курс подготовки к школьному формату: речь, письмо, математика и логика.', audience: ['children'], age: '5+', format: 'course', formatLabel: 'Офлайн · детские группы', popular: true, result: 'Ребёнок мягко входит в учебный режим и привыкает к заданиям.' }),
      course({ directionId: 'school', slug: 'math-1-4', title: 'Математика 1-4 класс', description: 'Курс для закрепления базы, задач и уверенного движения по школьной программе.', audience: ['children'], age: '7+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик понимает логику задач и закрывает пробелы.' }),
      course({ directionId: 'school', slug: 'russian-1-4', title: 'Русский язык 1-4 класс', description: 'Системная работа с чтением, письмом, правилами и школьными заданиями.', audience: ['children'], age: '7+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Появляется больше аккуратности и понимания правил.' }),
      course({ directionId: 'school', slug: 'math-5-7', title: 'Математика 5-7 класс', description: 'Курс для тем средней школы: вычисления, задачи, уравнения и геометрическая база.', audience: ['teens'], age: '11+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Подросток видит слабые места и тренирует их регулярно.' }),
      course({ directionId: 'school', slug: 'informatics-school', title: 'Информатика', description: 'Полноценная программа по школьной информатике и базовой логике алгоритмов.', audience: ['teens'], age: '12+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик увереннее решает задачи и понимает структуру темы.' }),
      course({ directionId: 'school', slug: 'physics', title: 'Физика', description: 'Курс по ключевым темам школьной физики с разбором задач и практических примеров.', audience: ['teens'], age: '13+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Появляется связь между формулой, смыслом и задачей.' }),
    ],
    outcomes: ['видеть логику темы', 'тренироваться без стыда за ошибку', 'готовиться к контрольным через понятные шаги'],
    faqs: [{ question: 'Можно ли прийти с конкретной темой?', answer: 'Да. В заявке можно указать предмет и текущую задачу.' }],
  }),
  direction({
    slug: 'exams',
    title: 'ОГЭ и ЕГЭ',
    shortTitle: 'Экзамены',
    headline: 'Подготовка к государственным экзаменам как цельная программа',
    summary: 'ОГЭ и ЕГЭ по предметам: диагностика, план, практика заданий и разбор ошибок.',
    audience: ['teens'],
    ages: ['14+', '16+'],
    doodle: 'Контрольные точки, галочки и разборы',
    image: 'assets/direction-icon-school.png',
    courses: [
      course({ directionId: 'exams', slug: 'oge-math', title: 'ОГЭ по математике', description: 'Полноценный курс подготовки к ОГЭ по математике с практикой заданий.', audience: ['teens'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Ученик получает план подготовки и тренирует типы заданий.' }),
      course({ directionId: 'exams', slug: 'oge-russian', title: 'ОГЭ по русскому языку', description: 'Курс подготовки к ОГЭ по русскому языку: тестовая часть, изложение и сочинение.', audience: ['teens'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Подросток понимает структуру экзамена и регулярно тренирует формат.' }),
      course({ directionId: 'exams', slug: 'ege-profile-math', title: 'ЕГЭ по профильной математике', description: 'Системная подготовка к профильной математике с разбором тем и задач.', audience: ['teens'], age: '16+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Появляется маршрут подготовки от диагностики до пробников.' }),
      course({ directionId: 'exams', slug: 'ege-russian', title: 'ЕГЭ по русскому языку', description: 'Курс подготовки к ЕГЭ по русскому языку с практикой тестов и сочинения.', audience: ['teens'], age: '16+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик тренирует экзаменационный формат и видит свои типовые ошибки.' }),
      course({ directionId: 'exams', slug: 'ege-informatics', title: 'ЕГЭ по информатике', description: 'Полноценная программа подготовки к ЕГЭ по информатике и задачам программирования.', audience: ['teens'], age: '16+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Подросток системно разбирает задания и тренирует решение.' }),
    ],
    outcomes: ['понимать структуру экзамена', 'двигаться по плану подготовки', 'разбирать ошибки после пробников'],
    faqs: [{ question: 'Можно ли готовиться только к отдельному заданию?', answer: 'Отдельные задания входят в курс как модули, а не создаются отдельными курсами.' }],
  }),
  direction({
    slug: 'it',
    title: 'IT и программирование',
    shortTitle: 'IT',
    headline: 'Программирование и цифровые профессии через проекты',
    summary: 'Python, frontend, тестирование, базы данных, no-code и детские IT-программы.',
    audience: ['children', 'teens', 'adults'],
    ages: ['8+', '12+', '16+', '18+'],
    doodle: 'Курсоры, сетки, окна и пиксельные элементы',
    image: 'assets/direction-icon-digital.png',
    heroImage: 'assets/mascot-it-github.webp',
    courses: [
      course({ directionId: 'it', slug: 'python-start', title: 'Python-разработчик с нуля', description: 'Курс основ программирования на Python: синтаксис, алгоритмы, данные и проекты.', audience: ['teens', 'adults'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Ученик пишет простые программы и понимает базовую структуру кода.' }),
      course({ directionId: 'it', slug: 'frontend-developer', title: 'Frontend-разработчик', description: 'HTML, CSS, JavaScript и создание интерфейсов в рамках цельной программы.', audience: ['teens', 'adults'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик собирает свои первые веб-интерфейсы.' }),
      course({ directionId: 'it', slug: 'web-development-start', title: 'Веб-разработка с нуля', description: 'Начальный курс по созданию сайтов и пониманию веб-процессов.', audience: ['teens', 'adults'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Появляется базовое понимание сайта как проекта.' }),
      course({ directionId: 'it', slug: 'qa-manual', title: 'Тестировщик ПО', description: 'Полный курс ручного тестирования: требования, тест-кейсы, дефекты и отчётность.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик понимает цикл тестирования и оформляет результаты проверки.' }),
      course({ directionId: 'it', slug: 'sql-databases', title: 'SQL и базы данных', description: 'Программа работы с реляционными базами данных, запросами и таблицами.', audience: ['teens', 'adults'], age: '16+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик понимает структуру данных и пишет базовые запросы.' }),
      course({ directionId: 'it', slug: 'kids-programming', title: 'Программирование для детей', description: 'Цельная детская программа основ программирования и логики.', audience: ['children'], age: '8+', format: 'course', formatLabel: 'Офлайн · детские группы', result: 'Ребёнок связывает команду, действие и результат.' }),
      course({ directionId: 'it', slug: 'kids-games', title: 'Создание игр для детей', description: 'Курс по созданию игр на визуальной платформе или аналогичном инструменте.', audience: ['children'], age: '9+', format: 'course', formatLabel: 'Офлайн · детские группы', result: 'Ребёнок собирает игру и понимает логику событий.' }),
    ],
    outcomes: ['создавать проекты руками', 'понимать логику цифровых инструментов', 'разбирать ошибки через тесты'],
    faqs: [{ question: 'Это только программирование?', answer: 'Нет. В направлении есть и код, и тестирование, и базы данных, и no-code.' }],
  }),
  direction({
    slug: 'ai',
    title: 'Искусственный интеллект',
    shortTitle: 'AI',
    headline: 'Нейросети как практический инструмент для учёбы, работы и бизнеса',
    summary: 'Курсы по безопасному и полезному применению AI в задачах, проектах и контенте.',
    audience: ['children', 'teens', 'adults'],
    ages: ['10+', '14+', '18+'],
    doodle: 'AI-облака, петли, подсказки и версии',
    image: 'assets/direction-icon-digital.png',
    courses: [
      course({ directionId: 'ai', slug: 'ai-start', title: 'Нейросети с нуля', description: 'Фундаментальный курс по возможностям, ограничениям и практическому применению AI.', audience: ['teens', 'adults'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Ученик понимает, где AI помогает и как проверять результат.' }),
      course({ directionId: 'ai', slug: 'ai-for-work', title: 'AI для работы', description: 'Комплексное использование нейросетей в офисных и профессиональных задачах.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Появляется набор рабочих сценариев и правил проверки ответа.' }),
      course({ directionId: 'ai', slug: 'ai-for-business', title: 'AI для бизнеса', description: 'Курс для предпринимателей и руководителей о применении нейросетей в процессах.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник собирает карту задач, где AI может помогать бизнесу.' }),
      course({ directionId: 'ai', slug: 'ai-for-marketing', title: 'AI для маркетинга', description: 'Полноценная программа применения AI в маркетинговых задачах и контенте.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик использует AI для гипотез, текстов, анализа и подготовки материалов.' }),
      course({ directionId: 'ai', slug: 'ai-content', title: 'AI для создания контента', description: 'Тексты, изображения, презентации, видео и работа с контентными задачами.', audience: ['teens', 'adults'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник создаёт и проверяет материалы под конкретную задачу.' }),
      course({ directionId: 'ai', slug: 'ai-teens', title: 'AI для подростков', description: 'Безопасное и эффективное применение нейросетей для учёбы и проектов.', audience: ['teens'], age: '12+', format: 'course', formatLabel: 'Офлайн · подростковые группы', result: 'Подросток учится использовать AI осознанно и проверять информацию.' }),
    ],
    outcomes: ['формулировать запросы', 'проверять ответы нейросетей', 'использовать AI для реальных задач'],
    faqs: [{ question: 'Это отдельные уроки по промптам?', answer: 'Нет. Промпты входят в модули больших курсов, а не становятся отдельными микрокурсами.' }],
  }),
  direction({
    slug: 'robotics',
    title: 'Робототехника',
    shortTitle: 'Роботы',
    headline: 'Робототехника через сборку, тесты и живой результат',
    summary: 'Практические курсы для детей и подростков: конструирование, логика, датчики, движение и командная работа.',
    audience: ['children', 'teens'],
    ages: ['7+', '10+', '12+'],
    doodle: 'Схемы, провода, детали и траектории',
    image: 'assets/direction-icon-robotics.png',
    courses: [
      course({ directionId: 'robotics', slug: 'robotics-7-9', title: 'Робототехника 7-9 лет', description: 'Стартовый курс сборки, простых механизмов, команд и проверки результата.', audience: ['children'], age: '7+', format: 'course', formatLabel: 'Офлайн · детские группы', popular: true, result: 'Ребёнок связывает деталь, команду и движение модели.' }),
      course({ directionId: 'robotics', slug: 'robotics-10-12', title: 'Робототехника 10-12 лет', description: 'Курс конструирования, датчиков, логики поведения и мини-проектов.', audience: ['children'], age: '10+', format: 'course', formatLabel: 'Офлайн · детские группы', result: 'Ученик собирает модель под задачу и тестирует гипотезы.' }),
      course({ directionId: 'robotics', slug: 'robotics-teens', title: 'Робототехника для подростков', description: 'Программа для более сложных инженерных задач, командной работы и проектной логики.', audience: ['teens'], age: '12+', format: 'course', formatLabel: 'Офлайн · подростковые группы', result: 'Подросток проектирует, собирает и дорабатывает роботизированную модель.' }),
      course({ directionId: 'robotics', slug: 'engineering-lab-kids', title: 'Инженерная лаборатория', description: 'Цельный курс экспериментов, конструирования и практических инженерных задач.', audience: ['children', 'teens'], age: '9+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик учится думать через задачу, прототип и проверку.' }),
      course({ directionId: 'robotics', slug: 'robots-and-programming', title: 'Роботы и программирование', description: 'Курс, где сборка модели соединяется с базовой логикой программирования.', audience: ['children', 'teens'], age: '10+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик понимает, как код влияет на физическое движение.' }),
    ],
    outcomes: ['собирать модель по задаче', 'проверять гипотезу через тест', 'исправлять ошибку без угадывания'],
    faqs: [{ question: 'Робототехника — это один урок по сборке?', answer: 'Нет. Это направление с цельными курсами по возрастам и уровню сложности.' }],
  }),
  direction({
    slug: 'marketing',
    title: 'Маркетинг',
    shortTitle: 'Маркетинг',
    headline: 'Маркетинг как цельная система: аудитория, предложение, каналы и аналитика',
    summary: 'Продвижение, реклама, бренды, контент и аналитика для взрослых и карьерных треков.',
    audience: ['adults'],
    ages: ['18+'],
    doodle: 'Воронки, стрелки, каналы и заметки',
    image: 'assets/direction-icon-digital.png',
    courses: [
      course({ directionId: 'marketing', slug: 'internet-marketer', title: 'Интернет-маркетолог', description: 'Комплексная программа по продвижению бизнеса в интернете.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Ученик собирает базовую стратегию продвижения.', modules: marketingModules }),
      course({ directionId: 'marketing', slug: 'smm-manager', title: 'SMM-менеджер', description: 'Полноценное обучение работе с социальными сетями, контентом и сообществом.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Ученик готовит контент-логику и понимает продвижение в соцсетях.' }),
      course({ directionId: 'marketing', slug: 'paid-ads-specialist', title: 'Специалист по интернет-рекламе', description: 'Курс по платному привлечению клиентов: медиаплан, креативы, аналитика и оптимизация.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик понимает цикл рекламной кампании и правила оценки результата.' }),
      course({ directionId: 'marketing', slug: 'content-marketer', title: 'Контент-маркетолог', description: 'Комплексный курс по созданию и продвижению контента.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик собирает контент-систему под аудиторию и канал.' }),
      course({ directionId: 'marketing', slug: 'brand-management', title: 'Бренд-менеджмент', description: 'Программа по созданию, развитию и управлению брендом.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник понимает позиционирование, визуальные и смысловые опоры бренда.' }),
      course({ directionId: 'marketing', slug: 'small-business-marketing', title: 'Маркетолог для малого бизнеса', description: 'Прикладная программа для владельцев малого бизнеса и локальных проектов.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник собирает практичный маркетинговый маршрут без лишней теории.' }),
    ],
    outcomes: ['понимать связь аудитории, продукта и канала', 'собирать стратегию продвижения', 'разбирать результат через аналитику'],
    faqs: [{ question: 'УТП — это отдельный курс?', answer: 'Нет. УТП находится внутри программы маркетинга как модуль позиционирования.' }],
  }),
  direction({
    slug: 'design',
    title: 'Дизайн',
    shortTitle: 'Дизайн',
    headline: 'Дизайн через визуальные задачи, инструменты и портфолио',
    summary: 'Графический дизайн, интерфейсы, Figma, презентации и визуальные коммуникации.',
    audience: ['children', 'teens', 'adults'],
    ages: ['10+', '14+', '18+'],
    doodle: 'Сетки, формы, карандашные линии и макеты',
    image: 'assets/direction-icon-creative.png',
    courses: [
      course({ directionId: 'design', slug: 'graphic-designer', title: 'Графический дизайнер', description: 'Курс по визуальной коммуникации, композиции, типографике и макетам.', audience: ['teens', 'adults'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Ученик собирает первые работы для портфолио.' }),
      course({ directionId: 'design', slug: 'ux-ui-designer', title: 'UX/UI-дизайнер', description: 'Программа по проектированию интерфейсов, пользовательских сценариев и экранов.', audience: ['teens', 'adults'], age: '16+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик понимает структуру интерфейса и собирает прототип.' }),
      course({ directionId: 'design', slug: 'web-designer', title: 'Веб-дизайнер', description: 'Курс по дизайну сайтов, лендингов и визуальной системе страницы.', audience: ['teens', 'adults'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик проектирует страницу от структуры до макета.' }),
      course({ directionId: 'design', slug: 'figma-start', title: 'Figma с нуля', description: 'Большая программа освоения Figma как рабочего инструмента дизайнера.', audience: ['teens', 'adults'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик уверенно работает с файлами, слоями, компонентами и прототипами.' }),
      course({ directionId: 'design', slug: 'presentation-design', title: 'Дизайн презентаций', description: 'Курс по структуре, визуальному ритму и оформлению презентаций.', audience: ['teens', 'adults'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник собирает понятную презентацию под задачу.' }),
      course({ directionId: 'design', slug: 'digital-design-kids', title: 'Digital-дизайн для детей', description: 'Детский курс визуальных цифровых проектов и аккуратной работы с макетом.', audience: ['children'], age: '10+', format: 'course', formatLabel: 'Офлайн · детские группы', result: 'Ребёнок создаёт простой цифровой визуальный проект.' }),
    ],
    outcomes: ['видеть композицию', 'работать с инструментами дизайна', 'собирать визуальный результат'],
    faqs: [{ question: 'Figma может быть отдельным курсом?', answer: 'Да, если это большая программа освоения инструмента, а не одно занятие.' }],
  }),
  direction({
    slug: 'business',
    title: 'Бизнес и управление',
    shortTitle: 'Бизнес',
    headline: 'Управление, проекты и команды через практические задачи',
    summary: 'Предпринимательство, управление командами, проектами, HR и офисные роли.',
    audience: ['adults'],
    ages: ['18+'],
    doodle: 'Маршруты, блок-схемы, роли и решения',
    image: 'assets/direction-icon-digital.png',
    courses: [
      course({ directionId: 'business', slug: 'entrepreneur-start', title: 'Предприниматель с нуля', description: 'Путь от идеи до запуска: продукт, клиент, модель и первые действия.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Участник получает карту запуска и первых управленческих решений.' }),
      course({ directionId: 'business', slug: 'small-business-management', title: 'Управление малым бизнесом', description: 'Курс по процессам, команде, деньгам и управлению локальным бизнесом.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Появляется более системный взгляд на бизнес как процесс.' }),
      course({ directionId: 'business', slug: 'project-manager', title: 'Project Manager', description: 'Курс по управлению проектами, задачами, сроками и коммуникацией команды.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник собирает проектную карту и правила контроля.' }),
      course({ directionId: 'business', slug: 'team-management', title: 'Управление командой', description: 'Программа для руководителей о задачах, ролях, обратной связи и ритме работы.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник понимает, как ставить задачи и держать командный фокус.' }),
      course({ directionId: 'business', slug: 'hr-manager', title: 'HR-менеджер', description: 'Курс по базовым HR-процессам: подбор, адаптация, коммуникация и документы.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик видит HR как систему процессов, а не набор разовых действий.' }),
      course({ directionId: 'business', slug: 'business-assistant', title: 'Бизнес-ассистент', description: 'Курс по организации задач, календаря, коммуникаций и материалов руководителя.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник умеет поддерживать рабочий контур руководителя.' }),
    ],
    outcomes: ['структурировать задачи', 'понимать роли и процессы', 'управлять следующим шагом'],
    faqs: [{ question: 'Это MBA?', answer: 'Нет. Это практичные прикладные курсы, точные форматы требуют подтверждения.' }],
  }),
  direction({
    slug: 'communications',
    title: 'Продажи и коммуникации',
    shortTitle: 'Продажи',
    headline: 'Диалог, продажа и выступление как тренируемый навык',
    summary: 'Продажи, переговоры, публичные выступления, клиентский сервис и речь.',
    audience: ['children', 'teens', 'adults'],
    ages: ['7+', '12+', '18+'],
    doodle: 'Речевые пузырьки, стрелки и заметки',
    image: 'assets/direction-icon-languages.png',
    courses: [
      course({ directionId: 'communications', slug: 'sales-manager', title: 'Менеджер по продажам', description: 'Полный курс продаж: этапы, потребности, презентация, возражения, CRM и повторные продажи.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Ученик понимает структуру продажи и тренирует диалог.', modules: salesModules }),
      course({ directionId: 'communications', slug: 'b2b-sales', title: 'B2B-продажи', description: 'Курс по сложным продажам, переговорам и работе с несколькими участниками решения.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник видит карту сделки и следующий шаг коммуникации.' }),
      course({ directionId: 'communications', slug: 'service-sales', title: 'Продажи услуг', description: 'Программа продаж нематериальных продуктов, доверия и объяснения ценности.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник лучше объясняет услугу и ведёт клиента к решению.' }),
      course({ directionId: 'communications', slug: 'client-service', title: 'Клиентский сервис', description: 'Курс по стандартам общения, конфликтам, поддержке и качеству клиентского опыта.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Появляется понятная логика сервиса и общения с клиентом.' }),
      course({ directionId: 'communications', slug: 'public-speaking', title: 'Ораторское мастерство', description: 'Полноценный курс речи, структуры выступления, голоса и уверенности.', audience: ['teens', 'adults'], age: '12+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Участник выступает понятнее и увереннее.' }),
      course({ directionId: 'communications', slug: 'kids-speech', title: 'Детская школа речи', description: 'Курс развития речи, выразительности и уверенного общения для детей.', audience: ['children'], age: '7+', format: 'course', formatLabel: 'Офлайн · детские группы', result: 'Ребёнок тренирует речь и учится выражать мысль.' }),
    ],
    outcomes: ['строить понятный диалог', 'тренировать выступления', 'разбирать сложные коммуникации'],
    faqs: [{ question: 'Работа с возражениями — отдельный курс?', answer: 'Нет. Это модуль внутри курса продаж или переговоров.' }],
  }),
  direction({
    slug: 'finance',
    title: 'Финансы и бухгалтерия',
    shortTitle: 'Финансы',
    headline: 'Финансовая грамотность и учёт как понятная система',
    summary: 'Финансовая грамотность, бухгалтерия, 1С, учёт и основы инвестирования.',
    audience: ['children', 'teens', 'adults'],
    ages: ['8+', '12+', '18+'],
    doodle: 'Таблицы, монеты, графики и расчёты',
    image: 'assets/direction-icon-school.png',
    courses: [
      course({ directionId: 'finance', slug: 'financial-literacy', title: 'Финансовая грамотность', description: 'Курс личных финансов, бюджета, расходов, накоплений и финансовых решений.', audience: ['teens', 'adults'], age: '12+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Участник понимает базовую логику денег и планирования.' }),
      course({ directionId: 'finance', slug: 'financial-literacy-kids', title: 'Финансовая грамотность для детей', description: 'Детская программа про деньги, выбор, цели и простые финансовые привычки.', audience: ['children'], age: '8+', format: 'course', formatLabel: 'Офлайн · детские группы', result: 'Ребёнок понимает базовые финансовые ситуации через практику.' }),
      course({ directionId: 'finance', slug: 'accountant-start', title: 'Бухгалтер с нуля', description: 'Курс базовой бухгалтерии, документов, учёта и отчётности.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик понимает основные операции и документы.' }),
      course({ directionId: 'finance', slug: 'one-c-accounting', title: '1С: Бухгалтерия', description: 'Программа работы с 1С в рамках бухгалтерских задач и операций.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик выполняет базовые операции в 1С.' }),
      course({ directionId: 'finance', slug: 'entrepreneur-finance', title: 'Финансы для предпринимателя', description: 'Курс о деньгах бизнеса, планировании, управленческих выводах и учёте.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник лучше понимает финансовую картину бизнеса.' }),
      course({ directionId: 'finance', slug: 'management-accounting', title: 'Управленческий учёт', description: 'Курс по управленческим таблицам, показателям и принятию решений.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник видит, какие данные нужны для решений.' }),
    ],
    outcomes: ['понимать финансовые решения', 'вести базовую структуру учёта', 'видеть связь цифр и действий'],
    faqs: [{ question: 'Можно ли сделать курс про одну кредитную карту?', answer: 'Нет. Это тема внутри финансовой грамотности, а не отдельный курс.' }],
  }),
  direction({
    slug: 'career',
    title: 'Профессии и карьера',
    shortTitle: 'Карьера',
    headline: 'Профориентация и профессии без дублей в каталоге',
    summary: 'Подборка профессиональных курсов из разных направлений: маркетинг, IT, дизайн, продажи и управление.',
    audience: ['teens', 'adults'],
    ages: ['14+', '18+'],
    doodle: 'Маршруты, цели и карьерные переходы',
    image: 'assets/direction-icon-digital.png',
    courses: [
      course({ directionId: 'career', slug: 'career-guidance-teens', title: 'Профориентация для подростков', description: 'Курс выбора направления: интересы, сильные стороны, проба профессий и план шага.', audience: ['teens'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Подросток видит несколько реалистичных образовательных маршрутов.' }),
      course({ directionId: 'career', slug: 'career-start-adults', title: 'Карьерный старт для взрослых', description: 'Курс для выбора новой профессиональной траектории и подготовки первых шагов.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник собирает план перехода и список навыков для развития.' }),
      course({ directionId: 'career', slug: 'resume-interview', title: 'Резюме и собеседование', description: 'Полноценная программа подготовки к поиску работы, резюме и интервью.', audience: ['teens', 'adults'], age: '16+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник готовит резюме и тренирует ответы на интервью.' }),
      course({ directionId: 'career', slug: 'digital-professions-overview', title: 'Цифровые профессии', description: 'Курс-знакомство с профессиональными направлениями в digital и IT.', audience: ['teens', 'adults'], age: '14+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник понимает различия ролей и выбирает дальнейший курс.' }),
      course({ directionId: 'career', slug: 'business-communication-career', title: 'Деловая коммуникация для карьеры', description: 'Курс рабочих коммуникаций, писем, встреч и презентации себя.', audience: ['teens', 'adults'], age: '16+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник увереннее общается в учебной или рабочей среде.' }),
    ],
    outcomes: ['не дублировать профессиональные курсы', 'выбирать маршрут по цели', 'понимать следующий образовательный шаг'],
    faqs: [{ question: 'Здесь дублируются курсы?', answer: 'Нет. Это подборка и карьерные маршруты; базовые курсы остаются в своих направлениях.' }],
  }),
  direction({
    slug: 'kids-development',
    title: 'Развитие детей',
    shortTitle: 'Развитие',
    headline: 'Мышление, речь и навыки обучения через понятные детские программы',
    summary: 'Логика, память, шахматы, речь, эмоциональный интеллект и предпринимательство для детей.',
    audience: ['children'],
    ages: ['5+', '7+', '9+'],
    doodle: 'Петли, вопросы, звёзды и попытки',
    image: 'assets/direction-icon-robotics.png',
    courses: [
      course({ directionId: 'kids-development', slug: 'speed-reading-memory', title: 'Скорочтение и развитие памяти', description: 'Цельная программа навыков чтения, внимания, памяти и понимания текста.', audience: ['children'], age: '7+', format: 'course', formatLabel: 'Офлайн · детские группы', popular: true, result: 'Ребёнок тренирует внимание, скорость и понимание.' }),
      course({ directionId: 'kids-development', slug: 'logic-thinking', title: 'Логика и мышление', description: 'Курс логических задач, закономерностей, рассуждения и самостоятельного поиска ответа.', audience: ['children'], age: '7+', format: 'course', formatLabel: 'Офлайн · детские группы', result: 'Ребёнок учится объяснять ход мысли.' }),
      course({ directionId: 'kids-development', slug: 'mental-arithmetic', title: 'Ментальная арифметика', description: 'Программа счёта, концентрации и работы с числовыми образами.', audience: ['children'], age: '6+', format: 'course', formatLabel: 'Офлайн · детские группы', result: 'Ребёнок тренирует счёт и внимание.' }),
      course({ directionId: 'kids-development', slug: 'chess', title: 'Шахматы', description: 'Полноценный курс шахматной логики, фигур, стратегий и практических партий.', audience: ['children'], age: '6+', format: 'course', formatLabel: 'Офлайн · детские группы', result: 'Ребёнок понимает правила, планы и последствия ходов.' }),
      course({ directionId: 'kids-development', slug: 'emotional-intelligence-kids', title: 'Эмоциональный интеллект для детей', description: 'Курс распознавания эмоций, общения, конфликтов и поддержки себя.', audience: ['children'], age: '7+', format: 'course', formatLabel: 'Офлайн · детские группы', result: 'Ребёнок лучше называет состояние и выбирает способ реакции.' }),
      course({ directionId: 'kids-development', slug: 'kids-entrepreneurship', title: 'Основы предпринимательства для детей', description: 'Курс детских проектов, идей, ценности, денег и презентации результата.', audience: ['children'], age: '9+', format: 'course', formatLabel: 'Офлайн · детские группы', result: 'Ребёнок пробует собрать идею в понятный мини-проект.' }),
    ],
    outcomes: ['развивать мышление через практику', 'учиться объяснять ход мысли', 'пробовать задачи без страха ошибки'],
    faqs: [{ question: 'Подготовка к школе здесь или в школьном направлении?', answer: 'Курс может показываться в подборке для детей, но хранится как единая программа, без дублей.' }],
  }),
  direction({
    slug: 'creative',
    title: 'Творчество',
    shortTitle: 'Творчество',
    headline: 'Творческие программы: пробовать материалы и доводить работу до результата',
    summary: 'Рисование, живопись, скетчинг, иллюстрация, театр и письмо.',
    audience: ['children', 'teens', 'adults'],
    ages: ['5+', '12+', '18+'],
    doodle: 'Мазки, карандашные следы и бумага',
    image: 'assets/direction-icon-creative.png',
    heroImage: 'assets/mascot-creative.png',
    courses: [
      course({ directionId: 'creative', slug: 'drawing-start', title: 'Рисование с нуля', description: 'Полноценный курс основ рисунка, формы, линии, наблюдения и практики.', audience: ['children', 'teens', 'adults'], age: '7+', format: 'course', formatLabel: 'Офлайн · группы', popular: true, result: 'Участник понимает базовые принципы рисунка и собирает первые работы.' }),
      course({ directionId: 'creative', slug: 'painting', title: 'Живопись', description: 'Курс работы с цветом, материалами, композицией и завершённой работой.', audience: ['teens', 'adults'], age: '12+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник создаёт живописные работы и понимает логику цвета.' }),
      course({ directionId: 'creative', slug: 'sketching', title: 'Скетчинг', description: 'Практический курс быстрых зарисовок, наблюдения и визуальных заметок.', audience: ['teens', 'adults'], age: '12+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник быстрее фиксирует форму и идею на бумаге.' }),
      course({ directionId: 'creative', slug: 'illustration', title: 'Иллюстрация', description: 'Курс создания образов, персонажей, сюжетов и серии иллюстраций.', audience: ['teens', 'adults'], age: '12+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник собирает иллюстративную работу с понятной идеей.' }),
      course({ directionId: 'creative', slug: 'manga-comics', title: 'Манга и комиксы', description: 'Курс визуального рассказа, персонажей, сцен и последовательности кадров.', audience: ['children', 'teens'], age: '10+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Ученик создаёт короткую визуальную историю.' }),
      course({ directionId: 'creative', slug: 'theatre-studio', title: 'Театральная студия', description: 'Курс сценической практики, речи, движения, этюдов и совместной работы.', audience: ['children', 'teens'], age: '7+', format: 'course', formatLabel: 'Офлайн · группы', result: 'Участник тренирует сценическое внимание и работу с ролью.' }),
    ],
    outcomes: ['пробовать разные техники', 'развивать внимательность к форме и цвету', 'доводить практику до результата'],
    faqs: [{ question: 'Можно ли сделать курс «Как нарисовать глаз»?', answer: 'Нет. Это урок внутри программы рисования или иллюстрации.' }],
  }),
  direction({
    slug: 'driving',
    title: 'Автошкола',
    shortTitle: 'Автошкола',
    headline: 'Категория водительского удостоверения как полноценный курс',
    summary: 'Подготовка водителей по категориям, где теория, практика и экзамен связаны в один маршрут.',
    audience: ['adults'],
    ages: ['16+', '18+'],
    doodle: 'Траектории, стрелки, разметка и движение',
    image: 'assets/direction-icon-driving.png',
    heroImage: 'assets/mascot-driving.png',
    courses: [
      course({ directionId: 'driving', slug: 'category-a', title: 'Категория A', description: 'Курс подготовки к управлению мотоциклом при наличии программы направления.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · теория и практика', result: 'Ученик проходит цельный маршрут подготовки по категории.' }),
      course({ directionId: 'driving', slug: 'category-a1', title: 'Категория A1', description: 'Курс подготовки по категории A1 при наличии подтверждённой программы.', audience: ['teens', 'adults'], age: '16+', format: 'course', formatLabel: 'Офлайн · теория и практика', result: 'Ученик понимает требования категории и маршрут обучения.' }),
      course({ directionId: 'driving', slug: 'category-b', title: 'Категория B', description: 'Полноценный курс подготовки водителей категории B: теория, практика и экзамен.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · теория и практика', popular: true, result: 'Ученик понимает правила, тренирует манёвры и готовится к экзаменационному маршруту.', modules: categoryBModules }),
      course({ directionId: 'driving', slug: 'category-c', title: 'Категория C', description: 'Курс подготовки по категории C при наличии соответствующей программы.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · теория и практика', result: 'Ученик проходит подготовку по требованиям категории.' }),
      course({ directionId: 'driving', slug: 'category-d', title: 'Категория D', description: 'Курс подготовки по категории D при наличии подтверждённой программы.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · теория и практика', result: 'Ученик получает понятный маршрут подготовки по категории.' }),
      course({ directionId: 'driving', slug: 'category-be', title: 'Категория BE', description: 'Курс подготовки к управлению составом транспортных средств категории BE.', audience: ['adults'], age: '18+', format: 'course', formatLabel: 'Офлайн · теория и практика', result: 'Ученик разбирает требования и практические задачи категории.' }),
    ],
    outcomes: ['видеть обучение как маршрут', 'разбирать ошибки после практики', 'понимать требования к экзамену и дальнейшим шагам'],
    faqs: [
      { question: 'Категория B — это один курс?', answer: 'Да. Внутри него уже находятся ПДД, устройство автомобиля, безопасность, первая помощь и практика.' },
      { question: 'Где проходят занятия?', answer: 'Филиалы для автошколы нужно подтвердить после передачи актуального списка адресов.' },
    ],
  }),
];

export const allCourses: Course[] = directions.flatMap((item) => item.courses);

export const popularCourses: Course[] = allCourses.filter((item) => item.popular).slice(0, 12);

export const branches: Branch[] = [
  {
    id: 'branch-a',
    title: 'Филиал A',
    district: 'район требует подтверждения',
    address: 'адрес требует подтверждения',
    availability: ['languages', 'school', 'exams', 'creative', 'kids-development'],
  },
  {
    id: 'branch-b',
    title: 'Филиал B',
    district: 'район требует подтверждения',
    address: 'адрес требует подтверждения',
    availability: ['it', 'robotics', 'ai', 'design', 'marketing', 'business', 'communications', 'finance'],
  },
  {
    id: 'consultation',
    title: 'Подбор филиала',
    district: 'поможем выбрать после заявки',
    address: 'актуальный адрес уточняется менеджером',
    availability: allDirectionSlugs,
  },
];

export const siteMap = [
  { path: '/', label: 'Главная' },
  { path: '/directions', label: 'Все направления' },
  { path: '/courses', label: 'Все курсы' },
  { path: '/children', label: 'Детям' },
  { path: '/teens', label: 'Подросткам' },
  { path: '/adults', label: 'Взрослым' },
  { path: '/branches', label: 'Филиалы' },
  { path: '/about', label: 'О проекте' },
  { path: '/contacts', label: 'Контакты' },
  ...directions.map((item) => ({
    path: `/directions/${item.slug}`,
    label: item.title,
  })),
  ...allCourses.map((item) => ({
    path: `/courses/${item.slug}`,
    label: item.title,
  })),
];

export function findDirection(slug: string) {
  return directions.find((item) => item.slug === slug);
}

export function findCourse(slug: string) {
  const courseItem = allCourses.find((item) => item.slug === slug);
  return {
    direction: courseItem ? findDirection(courseItem.directionId) : undefined,
    course: courseItem,
    program: courseItem,
  };
}

export function findProgram(directionSlug: string, programSlug: string) {
  if (!directionSlug || directionSlug === 'courses') {
    return findCourse(programSlug);
  }

  const directionItem = findDirection(directionSlug);
  const courseItem = directionItem?.courses.find((item) => item.slug === programSlug);
  return {
    direction: directionItem,
    course: courseItem,
    program: courseItem,
  };
}

export function directionPath(directionItem: Direction) {
  return `/directions/${directionItem.slug}`;
}

export function programPath(_direction: Direction, program: Program) {
  return `/courses/${program.slug}`;
}
