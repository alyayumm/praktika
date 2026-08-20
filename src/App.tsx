import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Audience,
  allCourses,
  audienceLabels,
  branches,
  directionPath,
  directions,
  findDirection,
  findProgram,
  popularCourses,
  programPath,
  siteMap,
} from './data';
import type { Branch, Direction, Program } from './data';

const navItems = [
  { path: '/directions', label: 'Направления' },
  { path: '/courses', label: 'Курсы' },
  { path: '/children', label: 'Детям' },
  { path: '/teens', label: 'Подросткам' },
  { path: '/adults', label: 'Взрослым' },
  { path: '/branches', label: 'Филиалы' },
];

const advantageBadges = [
  {
    title: 'Обучение через практику',
    text: 'Пробуем, ошибаемся, разбираем и повторяем.',
    icon: 'practice',
  },
  {
    title: 'Небольшие группы',
    text: 'Преподаватель видит темп и вопросы каждого.',
    icon: 'group',
  },
  {
    title: 'Преподаватели-практики',
    text: 'Занятия строятся вокруг действия и обратной связи.',
    icon: 'teacher',
  },
  {
    title: 'Для разных возрастов',
    text: 'От детских групп до взрослых маршрутов обучения.',
    icon: 'ages',
  },
  {
    title: 'Удобные филиалы',
    text: 'Можно выбрать направление и ближайшую точку.',
    icon: 'branch',
  },
  {
    title: 'Первое занятие',
    text: 'Формат знакомства перед выбором программы.',
    icon: 'trial',
  },
] as const;

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Практика — образовательный центр для детей и взрослых',
    description:
      'Практика — офлайн-образование через действие: языки, автошкола, робототехника, школьные предметы, творчество и цифровые навыки.',
  },
  '/directions': {
    title: 'Направления обучения — Практика',
    description: 'Каталог направлений Практики для детей и взрослых с фильтром по аудитории и возрасту.',
  },
  '/courses': {
    title: 'Все курсы — Практика',
    description: 'Каталог полноценных курсов образовательного центра Практика: направления, аудитории, форматы и программы модулей.',
  },
  '/children': {
    title: 'Курсы детям — Практика',
    description: 'Подборка курсов Практики для детей без дублирования каталога направлений.',
  },
  '/teens': {
    title: 'Курсы подросткам — Практика',
    description: 'Подборка курсов Практики для подростков: экзамены, IT, языки, дизайн, творчество и профориентация.',
  },
  '/adults': {
    title: 'Курсы взрослым — Практика',
    description: 'Подборка курсов Практики для взрослых: языки, маркетинг, IT, AI, бизнес, продажи, финансы и творчество.',
  },
  '/branches': {
    title: 'Филиалы — Практика',
    description: 'Выберите удобный филиал Практики и направление обучения.',
  },
  '/about': {
    title: 'О проекте — Практика',
    description: 'Практика строит обучение как живой процесс: действие, ошибка, обратная связь и повторение.',
  },
  '/contacts': {
    title: 'Запись на пробное занятие — Практика',
    description: 'Оставьте заявку на пробное занятие или консультацию в образовательном центре Практика.',
  },
};

function stripRepoBase(pathname: string) {
  if (pathname === '/praktika') return '/';
  if (pathname.startsWith('/praktika/')) return pathname.replace('/praktika', '') || '/';
  return pathname || '/';
}

function getRoute() {
  const path = stripRepoBase(window.location.pathname);
  const search = window.location.search;
  return `${path}${search}`;
}

function cleanPath(route: string) {
  return route.split('?')[0] || '/';
}

function deploymentBase() {
  return window.location.pathname.startsWith('/praktika') ? '/praktika' : '';
}

function audienceFromParam(value: string | null): Audience {
  if (value === 'child' || value === 'children') return 'children';
  if (value === 'teens') return 'teens';
  if (value === 'self' || value === 'adults') return 'adults';
  return 'adults';
}

function trackingFields() {
  const params = new URLSearchParams(window.location.search);
  const names = ['utm_source', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'yclid', 'roistat'];
  return names.reduce<Record<string, string>>((acc, name) => {
    acc[name] = params.get(name) ?? '';
    return acc;
  }, {});
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [audience, setAudience] = useState<Audience>(() => {
    const params = new URLSearchParams(window.location.search);
    return audienceFromParam(params.get('audience'));
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (path: string) => {
    const nextUrl = `${deploymentBase()}${path}`;
    window.history.pushState({}, '', nextUrl);
    setRoute(getRoute());
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPop = () => setRoute(getRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextAudience = params.get('audience');
    if (nextAudience) {
      setAudience(audienceFromParam(nextAudience));
    }
  }, [route]);

  const path = cleanPath(route);

  useEffect(() => {
    const meta = getMeta(path);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [path]);

  return (
    <div className="app-shell">
      <Header
        navigate={navigate}
        currentPath={path}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main>
        {renderRoute({ path, navigate, audience, setAudience })}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

function getMeta(path: string) {
  if (pageMeta[path]) return pageMeta[path];
  const parts = path.split('/').filter(Boolean);
  const directionSlug = parts[0] === 'directions' ? parts[1] : parts[0];
  const direction = directionSlug ? findDirection(directionSlug) : undefined;
  if (direction && parts.length === 1) {
    return {
      title: `${direction.title} — Практика`,
      description: `${direction.summary} Запишитесь на пробное занятие или консультацию.`,
    };
  }
  if (direction && parts[0] === 'directions' && parts.length === 2) {
    return {
      title: `${direction.title} — Практика`,
      description: `${direction.summary} Выберите полноценный курс направления.`,
    };
  }
  if (parts[0] === 'courses' && parts[1]) {
    const { direction: courseDirection, program } = findProgram('courses', parts[1]);
    if (courseDirection && program) {
      return {
        title: `${program.title} — ${courseDirection.title} — Практика`,
        description: `${program.summary} Формат, филиал и стоимость уточняются после заявки.`,
      };
    }
  }
  if (direction && parts[1]) {
    const { program } = findProgram(direction.slug, parts[1]);
    if (program) {
      return {
        title: `${program.title} — ${direction.title} — Практика`,
        description: `${program.summary} Формат, филиал и стоимость уточняются после заявки.`,
      };
    }
  }
  return {
    title: 'Страница не найдена — Практика',
    description: 'Вернитесь к направлениям Практики и выберите подходящий курс.',
  };
}

function BrandLogo() {
  return <img className="brand-logo" src="assets/logo-praktika.png?v=20260820b" alt="Практика" />;
}

function renderRoute(args: {
  path: string;
  navigate: (path: string) => void;
  audience: Audience;
  setAudience: (audience: Audience) => void;
}) {
  const { path, navigate, audience, setAudience } = args;
  const parts = path.split('/').filter(Boolean);

  if (path === '/') {
    return <HomePage navigate={navigate} audience={audience} setAudience={setAudience} />;
  }
  if (path === '/directions') {
    return <DirectionsPage navigate={navigate} audience={audience} setAudience={setAudience} />;
  }
  if (path === '/courses') {
    return <CoursesPage navigate={navigate} audience={audience} setAudience={setAudience} />;
  }
  if (path === '/children' || path === '/teens' || path === '/adults') {
    return <AudiencePage audience={parts[0] as Audience} navigate={navigate} />;
  }
  if (path === '/branches') {
    return <BranchesPage navigate={navigate} />;
  }
  if (path === '/about') {
    return <AboutPage navigate={navigate} />;
  }
  if (path === '/contacts') {
    return <ContactsPage />;
  }
  if (parts[0] === 'directions' && parts[1]) {
    const direction = findDirection(parts[1]);
    if (direction) return <DirectionPage direction={direction} navigate={navigate} />;
  }
  if (parts[0] === 'courses' && parts[1]) {
    const { direction, program } = findProgram('courses', parts[1]);
    if (direction && program) {
      return <ProgramPage direction={direction} program={program} navigate={navigate} />;
    }
  }
  if (parts.length === 1) {
    const direction = findDirection(parts[0]);
    if (direction) return <DirectionPage direction={direction} navigate={navigate} />;
  }
  if (parts.length === 2) {
    const { direction, program } = findProgram(parts[0], parts[1]);
    if (direction && program) {
      return <ProgramPage direction={direction} program={program} navigate={navigate} />;
    }
  }
  return <NotFoundPage navigate={navigate} />;
}

function Header({
  navigate,
  currentPath,
  menuOpen,
  setMenuOpen,
}: {
  navigate: (path: string) => void;
  currentPath: string;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
}) {
  return (
    <header className="site-header">
      <button className="brand-link" type="button" onClick={() => navigate('/')} aria-label="На главную">
        <BrandLogo />
      </button>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav id="main-navigation" className={menuOpen ? 'nav-list is-open' : 'nav-list'} aria-label="Основная навигация">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={currentPath === cleanPath(item.path) ? 'nav-link is-active' : 'nav-link'}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
        <button className="header-cta" type="button" onClick={() => navigate('/courses')}>
          Найти курс
        </button>
      </nav>
    </header>
  );
}

function HomePage({
  navigate,
  audience,
  setAudience,
}: {
  navigate: (path: string) => void;
  audience: Audience;
  setAudience: (audience: Audience) => void;
}) {
  const popularPrograms = popularCourses.map((program) => ({
    direction: findDirection(program.directionId) ?? directions[0],
    program,
  }));
  const featuredDirections = ['languages', 'driving', 'robotics', 'school', 'creative', 'it']
    .map((slug) => findDirection(slug))
    .filter((direction): direction is Direction => Boolean(direction));
  const audienceStages = [
    {
      label: 'Детям',
      text: 'Играть, пробовать, узнавать мир',
      image: 'assets/home-kids-certificates.webp',
      path: '/children',
    },
    {
      label: 'Подросткам',
      text: 'Найти интерес и разложить навыки',
      image: 'assets/home-robotics.webp',
      path: '/teens',
    },
    {
      label: 'Взрослым',
      text: 'Осваивать новое для работы и жизни',
      image: 'assets/home-adults-dashboard.webp',
      path: '/adults',
    },
  ];

  return (
    <>
      <section className="hero section-dark">
        <div className="hero-copy">
          <h1>Сегодня можно научиться новому</h1>
          <p>
            Офлайн-занятия для детей, подростков и взрослых: языки, автошкола,
            робототехника, школьные предметы, творчество и цифровые навыки.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => navigate('/directions')}>
              Подобрать занятие
            </button>
            <AudienceSwitch audience={audience} onChange={setAudience} />
          </div>
        </div>
        <div className="hero-visual hero-visual--reference" aria-hidden="true">
          <img className="hero-main-mascot" src="assets/mascot-main.png" alt="" />
          <figure className="hero-bubble hero-bubble--robotics">
            <img src="assets/home-robotics.webp" alt="" />
            <figcaption>Робототехника для детей</figcaption>
          </figure>
          <figure className="hero-bubble hero-bubble--driving">
            <img src="assets/home-driving-instructor.webp" alt="" />
            <figcaption>Вождение с нуля</figcaption>
          </figure>
          <figure className="hero-bubble hero-bubble--english">
            <img src="assets/home-discussion.webp" alt="" />
            <figcaption>Английский для общения</figcaption>
          </figure>
        </div>
      </section>

      <div className="home-flow">
        <HomeFlowDecor />

      <section className="section section-directions" id="directions">
        <div className="section-heading split-heading">
          <div>
            <h2>Куда тянет сегодня?</h2>
            <p>
              Начните с направления, аудитории или ближайшего филиала. Дальше сайт ведёт
              на отдельную посадочную страницу курса.
            </p>
          </div>
          <button className="text-button" type="button" onClick={() => navigate('/directions')}>
            Полный каталог
          </button>
        </div>
        <DirectionRail directions={featuredDirections} navigate={navigate} />
        <img className="directions-peek-mascot" src="assets/mascot-main.png" alt="" aria-hidden="true" />
      </section>

      <section className="section audience-section">
        <div className="audience-panel">
          <div>
            <h2>Занятия для каждого этапа</h2>
            <p>
              Выберите возрастной сценарий: сайт покажет направления, которые проще
              сравнивать именно для этой аудитории.
            </p>
          </div>
          <AudienceSwitch audience={audience} onChange={setAudience} />
        </div>
        <div className="audience-stage-grid">
          {audienceStages.map((stage) => (
            <AudienceStageCard
              key={stage.label}
              label={stage.label}
              text={stage.text}
              image={stage.image}
              onClick={() => navigate(stage.path)}
            />
          ))}
        </div>
      </section>

      <section className="section how-section">
        <div className="section-heading">
          <h2>Не просто слушать — делать</h2>
          <p>Подвесные бейджи свисают из предыдущего блока и показывают, за счёт чего обучение ощущается живым, понятным и прикладным.</p>
        </div>
        <BenefitBadges />
        <div className="story-photo-row story-photo-row--learning">
          <StoryPhoto
            src="assets/home-adults-dashboard.webp"
            alt="Взрослые ученики разбирают учебный материал за ноутбуком в аудитории Практики."
            caption="Разбор, вопрос, следующий шаг"
          />
          <StoryPhoto
            src="assets/home-kids-certificates.webp"
            alt="Дети держат сертификаты после занятия в образовательном центре Практика."
            caption="Первый результат можно держать в руках"
          />
        </div>
      </section>

      <section className="section section-blue popular-section">
        <div className="section-heading">
          <h2>Популярные курсы</h2>
          <p>Сейчас это стартовая витрина. Цены, расписание и преподаватели ждут подтверждённых данных.</p>
        </div>
        <div className="program-grid">
          {popularPrograms.map(({ direction, program }) => (
            <ProgramCard
              key={`${direction.slug}-${program.slug}`}
              direction={direction}
              program={program}
              navigate={navigate}
            />
          ))}
        </div>
        <div className="course-photo-pair" aria-label="Занятия в Практике">
          <StoryPhoto
            src="assets/home-art-teacher.webp"
            alt="Преподаватель творческого курса рисует фирменный цветок на занятии."
            caption="Творчество с преподавателем"
            variant="portrait"
          />
          <StoryPhoto
            src="assets/home-driving-instructor.webp"
            alt="Инструктор автошколы у синего автомобиля держит планшет и ключ."
            caption="Автошкола как понятный маршрут"
            variant="portrait"
          />
        </div>
      </section>

      <section className="section branch-preview">
        <div className="branch-copy">
          <h2>Ближайший филиал без угадывания</h2>
          <p>
            В этой версии филиалы показаны как структура выбора. Реальные адреса нужно
            заменить после передачи подтверждённого списка.
          </p>
          <button className="secondary-button" type="button" onClick={() => navigate('/branches')}>
            Выбрать филиал
          </button>
        </div>
        <div className="branch-stack">
          <figure className="branch-photo">
            <img src="assets/home-reception.webp" alt="Ресепшен и зона ожидания образовательного центра Практика." loading="lazy" />
          </figure>
          <BranchList compact />
        </div>
      </section>

      <section className="section people-section">
        <div className="section-heading">
          <h2>Преподаватели и инструкторы</h2>
          <p>
            Блок предусмотрен в структуре. Имена, роли, фото и опыт не добавлены, потому
            что в ТЗ нет подтверждённых данных.
          </p>
        </div>
        <div className="people-gallery people-gallery--three">
          <StoryPhoto
            src="assets/home-method-cards.webp"
            alt="Сотрудник Практики раскладывает карточки методики на учебном столе."
            caption="Методика собирается руками"
            variant="portrait"
          />
          <StoryPhoto
            src="assets/home-robotics-teacher.webp"
            alt="Преподаватель робототехники держит учебного робота в аудитории."
            caption="Преподаватели показывают на практике"
            variant="portrait"
          />
          <StoryPhoto
            src="assets/home-team-kitchen.webp"
            alt="Команда Практики общается в зоне кофе с фирменными кружками."
            caption="Центр живёт не только в аудитории"
          />
        </div>
        <div className="confirmation-strip">
          <span>Требуется контент</span>
          <strong>фото, роли, направления, регалии и правила публикации</strong>
        </div>
      </section>

      <section className="section">
        <FAQ
          items={[
            {
              question: 'Можно ли выбрать направление без звонка?',
              answer: 'Да. Каталог и переключатель аудитории помогают сузить выбор до заявки.',
            },
            {
              question: 'Почему нет точных цен?',
              answer:
                'В исходном ТЗ цены не указаны. Чтобы не придумывать коммерческие условия, сайт показывает места, куда они будут добавлены после подтверждения.',
            },
            {
              question: 'Можно ли подключить amoCRM?',
              answer:
                'Форма уже хранит страницу, referer и UTM-поля в скрытых данных, чтобы подготовить будущую интеграцию.',
            },
          ]}
        />
      </section>

      <LeadSection selectedDirection={directions[0]} />
      </div>
    </>
  );
}

function HomeFlowDecor() {
  return (
    <div className="flow-decor" aria-hidden="true">
      <span className="flow-blob flow-blob--one" />
      <span className="flow-blob flow-blob--two" />
      <span className="flow-blob flow-blob--three" />
      <svg className="flow-line flow-line--one" viewBox="0 0 1200 520" role="presentation" focusable="false">
        <path d="M-20 160 C170 20 330 350 520 185 C700 28 780 410 980 250 C1100 154 1160 200 1230 138" />
      </svg>
      <svg className="flow-line flow-line--two" viewBox="0 0 1200 520" role="presentation" focusable="false">
        <path d="M40 420 C220 290 180 95 390 150 C560 195 500 395 720 365 C910 335 890 105 1150 150" />
      </svg>
      <svg className="flow-line flow-line--three" viewBox="0 0 1200 520" role="presentation" focusable="false">
        <path d="M-10 260 C150 110 320 430 470 245 C620 60 730 120 790 280 C850 445 1030 390 1220 210" />
      </svg>
    </div>
  );
}

function StoryPhoto({
  src,
  alt,
  caption,
  variant,
}: {
  src: string;
  alt: string;
  caption: string;
  variant?: 'portrait';
}) {
  return (
    <figure className={variant ? `story-photo story-photo--${variant}` : 'story-photo'}>
      <img src={src} alt={alt} loading="lazy" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function AudienceStageCard({
  label,
  text,
  image,
  onClick,
}: {
  label: string;
  text: string;
  image: string;
  onClick: () => void;
}) {
  return (
    <button className="audience-stage-card" type="button" onClick={onClick}>
      <img src={image} alt="" loading="lazy" />
      <span>{label}</span>
      <strong>{text}</strong>
    </button>
  );
}

function BenefitBadges() {
  return (
    <div className="benefit-badge-rail" aria-label="Преимущества Практики">
      {advantageBadges.map((badge, index) => (
        <div className={`benefit-hanger benefit-hanger--${index + 1}`} key={badge.title}>
          <span className="badge-strap" />
          <span className="badge-clip" />
          <article className="benefit-badge">
            <span className="badge-ring" />
            <div className={`badge-pattern badge-pattern--${index + 1}`} aria-hidden="true">
              <span />
            </div>
            <div className="badge-body">
              <BenefitIcon icon={badge.icon} />
              <h3>{badge.title}</h3>
              <p>{badge.text}</p>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}

function BenefitIcon({ icon }: { icon: (typeof advantageBadges)[number]['icon'] }) {
  const common = {
    width: 42,
    height: 42,
    viewBox: '0 0 48 48',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
  };

  if (icon === 'practice') {
    return (
      <svg className="badge-icon" {...common}>
        <path d="M9 30c7-15 19-17 30-12" />
        <path d="M15 32c7 6 17 6 25-2" />
        <path d="M31 10l7 7-8 2" />
      </svg>
    );
  }

  if (icon === 'group') {
    return (
      <svg className="badge-icon" {...common}>
        <path d="M16 20a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
        <path d="M32 22a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
        <path d="M7 39c2-8 8-12 16-10 5 1 8 4 10 10" />
        <path d="M27 30c6-1 11 2 14 8" />
      </svg>
    );
  }

  if (icon === 'teacher') {
    return (
      <svg className="badge-icon" {...common}>
        <path d="M12 34V13h24v17" />
        <path d="M17 18h14" />
        <path d="M17 24h9" />
        <path d="M30 36l5 5 6-14" />
      </svg>
    );
  }

  if (icon === 'ages') {
    return (
      <svg className="badge-icon" {...common}>
        <path d="M12 34c0-8 4-13 10-13s10 5 10 13" />
        <path d="M22 21a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
        <path d="M34 31c4 1 7 4 8 8" />
        <path d="M34 22a4 4 0 1 0 0-8" />
      </svg>
    );
  }

  if (icon === 'branch') {
    return (
      <svg className="badge-icon" {...common}>
        <path d="M12 40V18l12-8 12 8v22" />
        <path d="M20 40V27h8v13" />
        <path d="M14 20h20" />
        <path d="M10 40h28" />
      </svg>
    );
  }

  return (
    <svg className="badge-icon" {...common}>
      <path d="M12 12h24v24H12z" />
      <path d="M18 25l5 5 9-12" />
      <path d="M10 18c4-5 8-7 14-7" />
    </svg>
  );
}

function DirectionsPage({
  navigate,
  audience,
  setAudience,
}: {
  navigate: (path: string) => void;
  audience: Audience;
  setAudience: (audience: Audience) => void;
}) {
  const [age, setAge] = useState('all');
  const filtered = directions.filter((direction) => {
    const audienceMatch = direction.audience.includes(audience);
    const ageMatch = age === 'all' || direction.ages.includes(age);
    return audienceMatch && ageMatch;
  });
  const ages = Array.from(new Set(directions.flatMap((direction) => direction.ages)));

  return (
    <InnerPage title="Все направления" intro="Выберите аудиторию, возраст и направление, чтобы перейти на отдельную страницу.">
      <div className="filters-row">
        <AudienceSwitch audience={audience} onChange={setAudience} />
        <label className="field compact-field">
          <span>Возраст</span>
          <select value={age} onChange={(event) => setAge(event.target.value)}>
            <option value="all">Любой</option>
            {ages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="catalog-grid">
        {filtered.map((direction) => (
          <DirectionCard key={direction.slug} direction={direction} navigate={navigate} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">Для выбранной связки пока нет направления. Попробуйте другой возраст.</div>
      ) : null}
    </InnerPage>
  );
}

function CoursesPage({
  navigate,
  audience,
  setAudience,
}: {
  navigate: (path: string) => void;
  audience: Audience;
  setAudience: (audience: Audience) => void;
}) {
  const [directionSlug, setDirectionSlug] = useState<Direction['slug'] | 'all'>('all');
  const filtered = allCourses.filter((program) => {
    const audienceMatch = program.audience.includes(audience);
    const directionMatch = directionSlug === 'all' || program.directionId === directionSlug;
    return audienceMatch && directionMatch;
  });

  return (
    <InnerPage
      title="Все курсы"
      intro="Каталог показывает полноценные образовательные программы. Небольшие темы вроде УТП, UTM-меток или возражений находятся внутри модулей курса."
    >
      <div className="filters-row">
        <AudienceSwitch audience={audience} onChange={setAudience} />
        <label className="field compact-field">
          <span>Направление</span>
          <select value={directionSlug} onChange={(event) => setDirectionSlug(event.target.value as Direction['slug'] | 'all')}>
            <option value="all">Все направления</option>
            {directions.map((direction) => (
              <option key={direction.slug} value={direction.slug}>
                {direction.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="program-grid">
        {filtered.map((program) => (
          <ProgramCard
            key={program.id}
            direction={findDirection(program.directionId) ?? directions[0]}
            program={program}
            navigate={navigate}
          />
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">Для выбранной связки пока нет курса. Попробуйте другую аудиторию или направление.</div>
      ) : null}
    </InnerPage>
  );
}

function AudiencePage({ audience, navigate }: { audience: Audience; navigate: (path: string) => void }) {
  const audienceDirections = directions.filter((direction) => direction.audience.includes(audience));
  const audienceCourses = allCourses.filter((program) => program.audience.includes(audience));

  return (
    <InnerPage
      title={`Курсы ${audienceLabels[audience].toLowerCase()}`}
      intro="Это подборка тех же курсов по аудитории. Курсы не дублируются: они остаются привязанными к своим направлениям."
    >
      <div className="catalog-grid">
        {audienceDirections.slice(0, 6).map((direction) => (
          <DirectionCard key={direction.slug} direction={direction} navigate={navigate} />
        ))}
      </div>
      <div className="section-heading compact-after">
        <h2>Подходящие курсы</h2>
        <p>Выберите цельную программу и откройте её модули.</p>
      </div>
      <div className="program-grid">
        {audienceCourses.map((program) => (
          <ProgramCard
            key={program.id}
            direction={findDirection(program.directionId) ?? directions[0]}
            program={program}
            navigate={navigate}
          />
        ))}
      </div>
    </InnerPage>
  );
}

function DirectionPage({
  direction,
  navigate,
}: {
  direction: Direction;
  navigate: (path: string) => void;
}) {
  return (
    <>
      <DirectionHero direction={direction} navigate={navigate} />
      <section className="section">
        <Breadcrumbs
          items={[
            { label: 'Главная', path: '/' },
            { label: 'Направления', path: '/directions' },
            { label: direction.title },
          ]}
          navigate={navigate}
        />
        <div className="section-heading">
          <h2>Курсы направления</h2>
          <p>Здесь собраны цельные образовательные программы. Отдельные темы и навыки остаются внутри модулей курса.</p>
        </div>
        <div className="program-grid">
          {direction.courses.map((program) => (
            <ProgramCard key={program.slug} direction={direction} program={program} navigate={navigate} />
          ))}
        </div>
      </section>
      <section className="section outcome-section">
        <div className="section-heading">
          <h2>Что получится после обучения</h2>
          <p>{direction.summary}</p>
        </div>
        <ul className="outcome-list">
          {direction.outcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </section>
      <section className="section detail-grid-section">
        <InfoPanel title="Формат, продолжительность и стоимость">
          <p>
            Структура блока готова. Конкретные форматы, длительность, расписание и цены
            нужно добавить после подтверждения коммерческих данных.
          </p>
        </InfoPanel>
        <InfoPanel title="Преподаватели или инструкторы">
          <p>
            Имена, роли, фото и биографии не добавлены без подтверждённых материалов.
          </p>
        </InfoPanel>
        <InfoPanel title="Филиалы направления">
          <ul>
            {branches
              .filter((branch) => branch.availability.includes(direction.slug))
              .map((branch) => (
                <li key={branch.id}>{branch.title}: {branch.address}</li>
              ))}
          </ul>
        </InfoPanel>
        <InfoPanel title="Отзывы">
          <p>Блок предусмотрен, но реальные отзывы не выдуманы.</p>
        </InfoPanel>
      </section>
      <section className="section">
        <FAQ items={direction.faqs} />
      </section>
      <RelatedDirections active={direction.slug} navigate={navigate} />
      <LeadSection selectedDirection={direction} />
    </>
  );
}

function ProgramPage({
  direction,
  program,
  navigate,
}: {
  direction: Direction;
  program: Program;
  navigate: (path: string) => void;
}) {
  return (
    <>
      <section className="inner-hero program-hero">
        <Breadcrumbs
          items={[
            { label: 'Главная', path: '/' },
            { label: direction.title, path: directionPath(direction) },
            { label: program.title },
          ]}
          navigate={navigate}
        />
        <div className="program-hero-grid">
          <div>
            <h1>{program.title}</h1>
            <p>{program.description}</p>
            <button className="primary-button" type="button" onClick={() => navigate('/contacts')}>
              Записаться на консультацию
            </button>
          </div>
          <div className="program-fact">
            <span>Возраст</span>
            <strong>{program.age}</strong>
            <span>Формат</span>
            <p>{program.formatLabel}</p>
          </div>
        </div>
      </section>
      <section className="section detail-grid-section">
        <InfoPanel title="Описание">
          <p>{program.description}</p>
        </InfoPanel>
        <InfoPanel title="Программа">
          <div className="module-list">
            {program.modules.map((module) => (
              <div className="course-module" key={module.title}>
                <h3>{module.title}</h3>
                <ul>
                  {module.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </InfoPanel>
        <InfoPanel title="Результат">
          <p>{program.result}</p>
        </InfoPanel>
        <InfoPanel title="Цена и филиалы">
          <p>Цена и доступные филиалы требуют подтверждения.</p>
        </InfoPanel>
      </section>
      <LeadSection selectedDirection={direction} selectedProgram={program} />
    </>
  );
}

function BranchesPage({ navigate }: { navigate: (path: string) => void }) {
  const [selectedDirection, setSelectedDirection] = useState<Direction['slug']>('languages');
  const available = branches.filter((branch) => branch.availability.includes(selectedDirection));

  return (
    <InnerPage
      title="Филиалы"
      intro="Выбор филиала уже заложен в сценарий заявки. Реальные адреса и районы нужно заменить после подтверждения."
    >
      <div className="filters-row">
        <label className="field compact-field">
          <span>Направление</span>
          <select value={selectedDirection} onChange={(event) => setSelectedDirection(event.target.value as Direction['slug'])}>
            {directions.map((direction) => (
              <option key={direction.slug} value={direction.slug}>
                {direction.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="branch-grid">
        {available.map((branch) => (
          <BranchCard key={branch.id} branch={branch} />
        ))}
      </div>
      <button className="primary-button" type="button" onClick={() => navigate('/contacts')}>
        Оставить заявку
      </button>
    </InnerPage>
  );
}

function AboutPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <InnerPage
      title="О проекте"
      intro="«Практика» — это единая витрина офлайн-образования, где разные направления объединены одним принципом: учиться через действие."
    >
      <div className="about-grid">
        {[
          ['Не лекция ради лекции', 'Каждый блок должен приводить к действию: сказать, собрать, решить, проехать, нарисовать, повторить.'],
          ['Ошибки видны', 'Ошибка не прячется, а становится материалом для следующей попытки.'],
          ['Маршрут понятен', 'Человек должен понимать, куда нажать, какой курс выбрать и что произойдёт после заявки.'],
        ].map(([title, text]) => (
          <InfoPanel title={title} key={title}>
            <p>{text}</p>
          </InfoPanel>
        ))}
      </div>
      <section className="site-map-panel" aria-labelledby="site-map-title">
        <h2 id="site-map-title">Карта сайта первой версии</h2>
        <div className="site-map-grid">
          {siteMap.map((item) => (
            <button key={item.path} type="button" onClick={() => navigate(item.path)}>
              {item.label}
              <span>{item.path}</span>
            </button>
          ))}
        </div>
      </section>
    </InnerPage>
  );
}

function ContactsPage() {
  return (
    <InnerPage title="Запись и контакты" intro="Форма работает локально и готова к последующей интеграции с amoCRM. Контакты не выдуманы без подтверждения.">
      <div className="contacts-grid">
        <LeadForm />
        <InfoPanel title="Контакты требуют подтверждения">
          <p>Телефон, мессенджеры, юридические данные и ссылки на документы нужно добавить после передачи официальной информации.</p>
          <div className="disabled-actions" aria-label="Контактные каналы требуют подтверждения">
            <span>Телефон будет добавлен</span>
            <span>Мессенджер будет добавлен</span>
          </div>
        </InfoPanel>
      </div>
    </InnerPage>
  );
}

function NotFoundPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <InnerPage title="Страница не найдена" intro="Такой страницы пока нет в карте сайта.">
      <button className="primary-button" type="button" onClick={() => navigate('/directions')}>
        Вернуться к направлениям
      </button>
    </InnerPage>
  );
}

function InnerPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <section className="inner-hero">
      <div className="inner-copy">
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      <div className="inner-content">{children}</div>
    </section>
  );
}

function DirectionHero({ direction, navigate }: { direction: Direction; navigate: (path: string) => void }) {
  const heroImage = direction.heroImage ?? direction.image;

  return (
    <section className="direction-hero section-dark">
      <Breadcrumbs
        items={[
          { label: 'Главная', path: '/' },
          { label: 'Направления', path: '/directions' },
          { label: direction.title },
        ]}
        navigate={navigate}
        dark
      />
      <div className="direction-hero-grid">
        <div>
          <h1>{direction.headline}</h1>
          <p>{direction.summary}</p>
          <div className="tag-row">
            {direction.ages.map((age) => (
              <span key={age}>{age}</span>
            ))}
            {direction.audience.map((item) => (
              <span key={item}>{audienceLabels[item]}</span>
            ))}
          </div>
          <button className="primary-button" type="button" onClick={() => navigate('/contacts')}>
            Записаться на пробное
          </button>
        </div>
        <div className={direction.heroImage ? 'direction-art mascot-art' : 'direction-art'}>
          <img src={heroImage} alt="" />
          <p>{direction.doodle}</p>
        </div>
      </div>
    </section>
  );
}

function AudienceSwitch({ audience, onChange }: { audience: Audience; onChange: (audience: Audience) => void }) {
  return (
    <div className="audience-switch" role="group" aria-label="Выбор аудитории">
      {(['children', 'teens', 'adults'] as Audience[]).map((item) => (
        <button
          type="button"
          key={item}
          className={audience === item ? 'is-selected' : ''}
          onClick={() => onChange(item)}
        >
          {audienceLabels[item]}
        </button>
      ))}
    </div>
  );
}

function DirectionRail({ directions: items, navigate }: { directions: Direction[]; navigate: (path: string) => void }) {
  return (
    <div className="direction-rail" aria-label="Основные направления">
      {items.map((direction) => (
        <DirectionCard key={direction.slug} direction={direction} navigate={navigate} compact />
      ))}
    </div>
  );
}

function DirectionCard({
  direction,
  navigate,
  compact,
}: {
  direction: Direction;
  navigate: (path: string) => void;
  compact?: boolean;
}) {
  const examples = direction.courses.slice(0, 4).map((program) => program.title).join(' · ');

  return (
    <article className={compact ? 'direction-card compact' : 'direction-card'}>
      <img src={direction.image} alt="" />
      <div>
        <h3>{direction.shortTitle}</h3>
        <strong className="direction-count">{direction.courses.length} курсов</strong>
        <p>{direction.summary}</p>
        <p className="direction-examples">{examples}</p>
        <button className="text-button" type="button" onClick={() => navigate(directionPath(direction))}>
          Смотреть курсы
        </button>
      </div>
    </article>
  );
}

function MiniDirection({ direction, navigate }: { direction: Direction; navigate: (path: string) => void }) {
  return (
    <button className="mini-direction" type="button" onClick={() => navigate(directionPath(direction))}>
      <span>{direction.shortTitle}</span>
      <small>{direction.ages.join(' / ')}</small>
    </button>
  );
}

function ProgramCard({
  direction,
  program,
  navigate,
}: {
  direction: Direction;
  program: Program;
  navigate: (path: string) => void;
}) {
  return (
    <article className="program-card">
      {program.image ? (
        <img className="program-card-image" src={program.image} alt="" loading="lazy" />
      ) : null}
      <div className="program-card-top">
        <span>{direction.shortTitle}</span>
        <strong>{program.age}</strong>
      </div>
      <div className="program-meta">
        <span>{program.audience.map((item) => audienceLabels[item]).join(' · ')}</span>
        <span>{program.formatLabel}</span>
      </div>
      <h3>{program.title}</h3>
      <p>{program.description}</p>
      <button className="text-button" type="button" onClick={() => navigate(programPath(direction, program))}>
        Подробнее
      </button>
    </article>
  );
}

function BranchList({ compact }: { compact?: boolean }) {
  return (
    <div className={compact ? 'branch-list compact' : 'branch-list'}>
      {branches.map((branch) => (
        <BranchCard key={branch.id} branch={branch} />
      ))}
    </div>
  );
}

function BranchCard({ branch }: { branch: Branch }) {
  return (
    <article className="branch-card">
      <h3>{branch.title}</h3>
      <p>{branch.district}</p>
      <strong>{branch.address}</strong>
    </article>
  );
}

function FAQ({ items }: { items: Array<{ question: string; answer: string }> }) {
  const [open, setOpen] = useState(items[0]?.question ?? '');
  return (
    <div className="faq">
      <div className="section-heading">
        <h2>FAQ</h2>
        <p>Короткие ответы на вопросы, которые влияют на выбор и запись.</p>
      </div>
      <div className="faq-list">
        {items.map((item) => {
          const expanded = open === item.question;
          return (
            <div className="faq-item" key={item.question}>
              <button type="button" aria-expanded={expanded} onClick={() => setOpen(expanded ? '' : item.question)}>
                {item.question}
                <span>{expanded ? '−' : '+'}</span>
              </button>
              {expanded ? <p>{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeadSection({
  selectedDirection,
  selectedProgram,
}: {
  selectedDirection?: Direction;
  selectedProgram?: Program;
}) {
  return (
    <section className="section lead-section" id="lead">
      <div className="lead-copy">
        <h2>Записаться на пробное занятие или консультацию</h2>
        <p>
          Форма локальная: она показывает успешную отправку на сайте и собирает поля,
          которые позже можно передать в amoCRM.
        </p>
        <div className="lead-brand-row" aria-hidden="true">
          <BrandLogo />
          <img src="assets/mascot-main.png" alt="" />
        </div>
      </div>
      <LeadForm selectedDirection={selectedDirection} selectedProgram={selectedProgram} />
    </section>
  );
}

function LeadForm({
  selectedDirection,
  selectedProgram,
}: {
  selectedDirection?: Direction;
  selectedProgram?: Program;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [directionSlug, setDirectionSlug] = useState(selectedDirection?.slug ?? directions[0].slug);
  const [branchId, setBranchId] = useState(branches[0].id);
  const tracking = useMemo(trackingFields, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="success-state" role="status">
        <strong>Заявка собрана локально</strong>
        <p>После подключения backend или amoCRM этот сценарий можно заменить реальной отправкой.</p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <label className="field">
        <span>Имя</span>
        <input name="name" autoComplete="name" required placeholder="Как к вам обращаться" />
      </label>
      <label className="field">
        <span>Телефон</span>
        <input name="phone" autoComplete="tel" required placeholder="+7..." inputMode="tel" />
      </label>
      <label className="field">
        <span>Направление</span>
        <select name="direction" value={directionSlug} onChange={(event) => setDirectionSlug(event.target.value as Direction['slug'])}>
          {directions.map((direction) => (
            <option key={direction.slug} value={direction.slug}>
              {direction.title}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Возраст ученика</span>
        <input name="studentAge" placeholder="Например, 10 лет или взрослый" />
      </label>
      <label className="field">
        <span>Удобный филиал</span>
        <select name="branch" value={branchId} onChange={(event) => setBranchId(event.target.value)}>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.title}
            </option>
          ))}
        </select>
      </label>
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>Согласен на обработку данных. Ссылка на официальный документ требует подтверждения.</span>
      </label>
      {Object.entries(tracking).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <input type="hidden" name="pageUrl" value={window.location.href} />
      <input type="hidden" name="referer" value={document.referrer} />
      <input type="hidden" name="program" value={selectedProgram?.title ?? ''} />
      <button className="primary-button" type="submit">
        Отправить заявку
      </button>
    </form>
  );
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="info-panel">
      <h3>{title}</h3>
      {children}
    </article>
  );
}

function RelatedDirections({
  active,
  navigate,
}: {
  active: Direction['slug'];
  navigate: (path: string) => void;
}) {
  return (
    <section className="section related-section">
      <div className="section-heading">
        <h2>Другие направления «Практики»</h2>
        <p>Навигация сохраняет единый бренд и помогает не терять общий каталог.</p>
      </div>
      <div className="related-list">
        {directions
          .filter((direction) => direction.slug !== active)
          .slice(0, 4)
          .map((direction) => (
            <button key={direction.slug} type="button" onClick={() => navigate(directionPath(direction))}>
              {direction.shortTitle}
            </button>
          ))}
      </div>
    </section>
  );
}

function Breadcrumbs({
  items,
  navigate,
  dark,
}: {
  items: Array<{ label: string; path?: string }>;
  navigate: (path: string) => void;
  dark?: boolean;
}) {
  return (
    <nav className={dark ? 'breadcrumbs dark' : 'breadcrumbs'} aria-label="Хлебные крошки">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.path ? (
            <button type="button" onClick={() => navigate(item.path!)}>
              {item.label}
            </button>
          ) : (
            item.label
          )}
        </span>
      ))}
    </nav>
  );
}

function Footer({ navigate }: { navigate: (path: string) => void }) {
  return (
    <footer className="site-footer">
      <div>
        <button className="brand-link footer-brand" type="button" onClick={() => navigate('/')}>
          <BrandLogo />
        </button>
        <p>Офлайн-образование через действие для детей и взрослых.</p>
      </div>
      <div className="footer-links">
        {siteMap.slice(0, 5).map((item) => (
          <button key={item.path} type="button" onClick={() => navigate(item.path)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="footer-note">
        Контакты, документы и юридические данные требуют подтверждения.
      </div>
    </footer>
  );
}
