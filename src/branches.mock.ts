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

// Временная структура филиалов для проверки маршрутов, фильтров и страниц.
export const branches: Branch[] = [
  {
    id: 'branch-central',
    slug: 'central',
    active: true,
    mock: false,
    name: 'Филиал «Центральный»',
    shortName: 'Центральный',
    city: 'Москва',
    district: 'Центральный район',
    address: '',
    latitude: null,
    longitude: null,
    nearestMetro: '',
    travelTime: '',
    workingHours: '',
    phone: '',
    routeUrl: '',
    ageGroups: ['Детям', 'Подросткам', 'Взрослым'],
    directionIds: ['languages', 'school', 'creative', 'kids-development'],
    courseIds: ['english-kids', 'english-a1', 'school-prep', 'drawing-start'],
    shortDescription: 'Филиал для языков, школьных предметов, творчества и детских программ.',
    fullDescription:
      'Точка для практических занятий в небольших группах: языки, школьные предметы, творчество и детские программы.',
    heroImages: [
      {
        src: 'assets/home-reception.webp',
        alt: 'Ресепшен образовательного центра Практика.',
      },
      {
        src: 'assets/home-discussion.webp',
        alt: 'Занятие в аудитории Практики.',
      },
    ],
    galleryImages: [
      {
        src: 'assets/home-reception.webp',
        alt: 'Зона ожидания Практики.',
      },
      {
        src: 'assets/home-discussion.webp',
        alt: 'Групповое занятие в Практике.',
      },
      {
        src: 'assets/home-method-cards.webp',
        alt: 'Методические карточки на учебном столе.',
      },
    ],
    teachers: [],
    schedule: [],
    reviews: [],
    mapPosition: { x: 34, y: 38 },
    seoTitle: 'Филиал Центральный — Практика',
    seoDescription: 'Страница филиала Практики с направлениями, курсами и формой записи.',
  },
  {
    id: 'branch-north',
    slug: 'north',
    active: true,
    mock: false,
    name: 'Филиал «Северный»',
    shortName: 'Северный',
    city: 'Москва',
    district: 'Северный район',
    address: '',
    latitude: null,
    longitude: null,
    nearestMetro: '',
    travelTime: '',
    workingHours: '',
    phone: '',
    routeUrl: '',
    ageGroups: ['Детям', 'Подросткам'],
    directionIds: ['robotics', 'it', 'ai', 'design'],
    courseIds: ['robotics-7-9', 'python-start', 'ai-teens', 'digital-design-kids'],
    shortDescription: 'Филиал с техническими, проектными и цифровыми направлениями.',
    fullDescription:
      'Точка для робототехники, IT, цифровых программ и проектных занятий для детей и подростков.',
    heroImages: [
      {
        src: 'assets/home-robotics.webp',
        alt: 'Занятие по робототехнике.',
      },
      {
        src: 'assets/home-robotics-teacher.webp',
        alt: 'Преподаватель с учебным роботом.',
      },
    ],
    galleryImages: [
      {
        src: 'assets/home-robotics.webp',
        alt: 'Детская робототехника в аудитории.',
      },
      {
        src: 'assets/home-robotics-teacher.webp',
        alt: 'Робот на учебном столе.',
      },
      {
        src: 'assets/home-team-table.webp',
        alt: 'Командная работа за учебным столом.',
      },
    ],
    teachers: [],
    schedule: [],
    reviews: [],
    mapPosition: { x: 62, y: 28 },
    seoTitle: 'Филиал Северный — Практика',
    seoDescription: 'Страница технического филиала Практики с робототехникой, IT и цифровыми программами.',
  },
  {
    id: 'branch-south',
    slug: 'south',
    active: true,
    mock: false,
    name: 'Филиал «Южный»',
    shortName: 'Южный',
    city: 'Санкт-Петербург',
    district: 'Южный район',
    address: '',
    latitude: null,
    longitude: null,
    nearestMetro: '',
    travelTime: '',
    workingHours: '',
    phone: '',
    routeUrl: '',
    ageGroups: ['Подросткам', 'Взрослым'],
    directionIds: ['driving', 'languages', 'business', 'communications'],
    courseIds: ['category-b', 'spoken-english', 'sales-manager', 'public-speaking'],
    shortDescription: 'Филиал для взрослых маршрутов, языков, коммуникаций и автошколы.',
    fullDescription:
      'Точка для взрослых программ: языки, коммуникации, бизнес-навыки и автошкола.',
    heroImages: [
      {
        src: 'assets/home-driving-instructor.webp',
        alt: 'Инструктор автошколы у автомобиля.',
      },
      {
        src: 'assets/home-adults-dashboard.webp',
        alt: 'Взрослое занятие за ноутбуком.',
      },
    ],
    galleryImages: [
      {
        src: 'assets/home-driving-instructor.webp',
        alt: 'Занятие автошколы.',
      },
      {
        src: 'assets/home-adults-dashboard.webp',
        alt: 'Занятие для взрослых.',
      },
      {
        src: 'assets/home-team-kitchen.webp',
        alt: 'Зона кофе в образовательном центре.',
      },
    ],
    teachers: [],
    schedule: [],
    reviews: [],
    mapPosition: { x: 48, y: 64 },
    seoTitle: 'Филиал Южный — Практика',
    seoDescription: 'Страница филиала Практики для взрослых направлений, языков, коммуникаций и автошколы.',
  },
];

export function findBranch(slug: string) {
  return branches.find((branch) => branch.slug === slug && branch.active);
}
