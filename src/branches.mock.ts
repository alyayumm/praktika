import type { DirectionSlug } from './data';

export type BranchImage = {
  src: string;
  alt: string;
};

export type BranchTeacher = {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  photo?: string;
};

export type BranchScheduleItem = {
  id: string;
  date: string;
  time: string;
  directionId: DirectionSlug;
  courseId?: string;
  ageGroup: string;
  seatsStatus: string;
};

export type BranchReview = {
  id: string;
  author: string;
  context: string;
  rating?: number;
  text: string;
};

export interface Branch {
  id: string;
  slug: string;
  active: boolean;
  mock: boolean;
  name: string;
  shortName: string;
  city: string;
  district: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  nearestMetro: string;
  travelTime: string;
  workingHours: string;
  phone: string;
  routeUrl: string;
  ageGroups: string[];
  directionIds: DirectionSlug[];
  courseIds: string[];
  shortDescription: string;
  fullDescription: string;
  heroImages: BranchImage[];
  galleryImages: BranchImage[];
  teachers: BranchTeacher[];
  schedule: BranchScheduleItem[];
  reviews: BranchReview[];
  mapPosition: {
    x: number;
    y: number;
  };
  seoTitle: string;
  seoDescription: string;
}

// Временные демонстрационные данные. Реальные адреса, телефоны, расписание,
// координаты, преподаватели и отзывы нужно заменить после подтверждения.
export const branches: Branch[] = [
  {
    id: 'mock-central',
    slug: 'demo-central',
    active: true,
    mock: true,
    name: 'Демо-филиал «Центральный»',
    shortName: 'Центральный',
    city: 'Москва',
    district: 'Центральный район',
    address: 'Демо-адрес требует подтверждения',
    latitude: null,
    longitude: null,
    nearestMetro: 'ориентир требует подтверждения',
    travelTime: 'время в пути требует подтверждения',
    workingHours: 'часы работы требуют подтверждения',
    phone: '',
    routeUrl: '',
    ageGroups: ['Детям', 'Подросткам', 'Взрослым'],
    directionIds: ['languages', 'school', 'creative', 'kids-development'],
    courseIds: ['english-kids', 'english-a1', 'school-prep', 'drawing-start'],
    shortDescription: 'Пример карточки филиала для проверки фильтров, карты и страницы филиала.',
    fullDescription:
      'Это демонстрационная запись. Реальное название, адрес, ориентир, часы работы, телефон, расписание, преподавателей и отзывы нужно заменить после передачи подтверждённых данных.',
    heroImages: [
      {
        src: 'assets/home-reception.webp',
        alt: 'Демонстрационное фото ресепшена образовательного центра Практика.',
      },
      {
        src: 'assets/home-discussion.webp',
        alt: 'Демонстрационное фото занятия в аудитории Практики.',
      },
    ],
    galleryImages: [
      {
        src: 'assets/home-reception.webp',
        alt: 'Демонстрационное фото зоны ожидания.',
      },
      {
        src: 'assets/home-discussion.webp',
        alt: 'Демонстрационное фото группового занятия.',
      },
      {
        src: 'assets/home-method-cards.webp',
        alt: 'Демонстрационное фото методических карточек.',
      },
    ],
    teachers: [],
    schedule: [],
    reviews: [],
    mapPosition: { x: 34, y: 38 },
    seoTitle: 'Демо-филиал Центральный — Практика',
    seoDescription: 'Демонстрационная страница филиала Практики. Данные требуют подтверждения.',
  },
  {
    id: 'mock-north',
    slug: 'demo-north',
    active: true,
    mock: true,
    name: 'Демо-филиал «Северный»',
    shortName: 'Северный',
    city: 'Москва',
    district: 'Северный район',
    address: 'Демо-адрес требует подтверждения',
    latitude: null,
    longitude: null,
    nearestMetro: 'ориентир требует подтверждения',
    travelTime: 'время в пути требует подтверждения',
    workingHours: 'часы работы требуют подтверждения',
    phone: '',
    routeUrl: '',
    ageGroups: ['Детям', 'Подросткам'],
    directionIds: ['robotics', 'it', 'ai', 'design'],
    courseIds: ['robotics-7-9', 'python-start', 'ai-teens', 'digital-design-kids'],
    shortDescription: 'Пример филиала с техническими и проектными направлениями.',
    fullDescription:
      'Демонстрационный филиал показывает, как будет выглядеть страница для точки с робототехникой, IT и цифровыми программами. Фактические данные нужно заменить.',
    heroImages: [
      {
        src: 'assets/home-robotics.webp',
        alt: 'Демонстрационное фото занятия по робототехнике.',
      },
      {
        src: 'assets/home-robotics-teacher.webp',
        alt: 'Демонстрационное фото преподавателя с учебным роботом.',
      },
    ],
    galleryImages: [
      {
        src: 'assets/home-robotics.webp',
        alt: 'Демонстрационное фото детской робототехники.',
      },
      {
        src: 'assets/home-robotics-teacher.webp',
        alt: 'Демонстрационное фото робота на занятии.',
      },
      {
        src: 'assets/home-team-table.webp',
        alt: 'Демонстрационное фото командной работы за столом.',
      },
    ],
    teachers: [],
    schedule: [],
    reviews: [],
    mapPosition: { x: 62, y: 28 },
    seoTitle: 'Демо-филиал Северный — Практика',
    seoDescription: 'Демонстрационная страница технического филиала Практики. Данные требуют подтверждения.',
  },
  {
    id: 'mock-south',
    slug: 'demo-south',
    active: true,
    mock: true,
    name: 'Демо-филиал «Южный»',
    shortName: 'Южный',
    city: 'Санкт-Петербург',
    district: 'Южный район',
    address: 'Демо-адрес требует подтверждения',
    latitude: null,
    longitude: null,
    nearestMetro: 'ориентир требует подтверждения',
    travelTime: 'время в пути требует подтверждения',
    workingHours: 'часы работы требуют подтверждения',
    phone: '',
    routeUrl: '',
    ageGroups: ['Подросткам', 'Взрослым'],
    directionIds: ['driving', 'languages', 'business', 'communications'],
    courseIds: ['category-b', 'spoken-english', 'sales-manager', 'public-speaking'],
    shortDescription: 'Пример филиала для взрослых маршрутов, языков и автошколы.',
    fullDescription:
      'Это mock-запись для проверки шаблона филиала, маршрута, формы записи и фильтров. Реальные адреса, расписание и состав направлений требуют подтверждения.',
    heroImages: [
      {
        src: 'assets/home-driving-instructor.webp',
        alt: 'Демонстрационное фото инструктора автошколы у автомобиля.',
      },
      {
        src: 'assets/home-adults-dashboard.webp',
        alt: 'Демонстрационное фото взрослого занятия за ноутбуком.',
      },
    ],
    galleryImages: [
      {
        src: 'assets/home-driving-instructor.webp',
        alt: 'Демонстрационное фото автошколы.',
      },
      {
        src: 'assets/home-adults-dashboard.webp',
        alt: 'Демонстрационное фото занятия для взрослых.',
      },
      {
        src: 'assets/home-team-kitchen.webp',
        alt: 'Демонстрационное фото зоны кофе.',
      },
    ],
    teachers: [],
    schedule: [],
    reviews: [],
    mapPosition: { x: 48, y: 64 },
    seoTitle: 'Демо-филиал Южный — Практика',
    seoDescription: 'Демонстрационная страница филиала Практики для взрослых направлений. Данные требуют подтверждения.',
  },
];

export function findBranch(slug: string) {
  return branches.find((branch) => branch.slug === slug && branch.active);
}
