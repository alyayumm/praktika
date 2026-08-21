import { FormEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Audience,
  allCourses,
  audienceLabels,
  directionPath,
  directions,
  findDirection,
  findProgram,
  popularCourses,
  programPath,
  siteMap,
} from './data';
import { branches, findBranch } from './branches.mock';
import type { Branch } from './branches.mock';
import type { Direction, Program } from './data';

const navItems = [
  { path: '/directions', label: 'Направления' },
  { path: '/children', label: 'Детям' },
  { path: '/adults', label: 'Взрослым' },
  { path: '/filialy', label: 'Филиалы' },
];

const methodSteps = [
  {
    number: '01',
    title: 'Практика с первого занятия',
    text: 'Ученик не слушает вводную лекцию, а сразу пробует действие.',
  },
  {
    number: '02',
    title: 'Небольшие группы',
    text: 'Видно темп, вопросы и ошибки каждого ученика.',
  },
  {
    number: '03',
    title: 'Рядом с домом',
    text: 'Занятия в удобном районе, без лишних поездок.',
  },
  {
    number: '04',
    title: 'Результат, который видно',
    text: 'Понятные шаги и заметный прогресс после занятий.',
  },
] as const;

type LeadContext = {
  selectedDirection?: Direction;
  selectedProgram?: Program;
  selectedBranch?: Branch;
  audience?: Audience;
  source: string;
};

const homeDirectionLabels: Partial<Record<Direction['slug'], string>> = {
  languages: 'Языки',
  driving: 'Автошкола',
  robotics: 'Робототехника',
  school: 'Школьные предметы',
  creative: 'Творчество',
  it: 'Цифровые навыки',
};

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
  '/filialy': {
    title: 'Филиалы — Практика',
    description: 'Выберите удобный филиал Практики и направление обучения.',
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
  const path = route.split('?')[0] || '/';
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

function deploymentBase() {
  return window.location.pathname.startsWith('/praktika') ? '/praktika' : '';
}

function hrefFor(path: string) {
  return `${deploymentBase()}${path}`;
}

function branchPath(branch: Branch) {
  return `/filialy/${branch.slug}`;
}

function isBranchRoute(parts: string[]) {
  return (parts[0] === 'filialy' || parts[0] === 'branches') && Boolean(parts[1]);
}

const activeBranches = branches.filter((branch) => branch.active);

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
  const [leadContext, setLeadContext] = useState<LeadContext | null>(null);

  const navigate = (path: string) => {
    const nextUrl = `${deploymentBase()}${path}`;
    window.history.pushState({}, '', nextUrl);
    setRoute(getRoute());
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateAudience = (nextAudience: Audience) => {
    setAudience(nextAudience);
    const currentPath = cleanPath(getRoute());
    const params = new URLSearchParams(window.location.search);
    params.set('audience', nextAudience);
    const query = params.toString();
    window.history.replaceState({}, '', `${deploymentBase()}${currentPath}${query ? `?${query}` : ''}`);
    setRoute(getRoute());
  };

  const openLead = (context: LeadContext) => {
    setLeadContext(context);
  };

  const closeLead = () => setLeadContext(null);

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
        openLead={openLead}
      />
      <main>
        {renderRoute({ path, navigate, audience, setAudience: updateAudience, openLead })}
      </main>
      <Footer navigate={navigate} />
      {leadContext ? <LeadModal context={leadContext} onClose={closeLead} /> : null}
    </div>
  );
}

function getMeta(path: string) {
  if (pageMeta[path]) return pageMeta[path];
  const parts = path.split('/').filter(Boolean);
  if (isBranchRoute(parts)) {
    const branch = findBranch(parts[1]);
    if (branch) {
      return {
        title: branch.seoTitle,
        description: branch.seoDescription,
      };
    }
  }
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
  openLead: (context: LeadContext) => void;
}) {
  const { path, navigate, audience, setAudience, openLead } = args;
  const parts = path.split('/').filter(Boolean);

  if (path === '/') {
    return <HomePage navigate={navigate} audience={audience} setAudience={setAudience} openLead={openLead} />;
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
  if (path === '/filialy' || path === '/branches') {
    return <BranchesPage navigate={navigate} openLead={openLead} />;
  }
  if (isBranchRoute(parts)) {
    const branch = findBranch(parts[1]);
    if (branch) {
      return <BranchPage branch={branch} navigate={navigate} openLead={openLead} />;
    }
  }
  if (path === '/about') {
    return <AboutPage navigate={navigate} />;
  }
  if (path === '/contacts') {
    return <ContactsPage />;
  }
  if (parts[0] === 'directions' && parts[1]) {
    const direction = findDirection(parts[1]);
    if (direction) return <DirectionPage direction={direction} navigate={navigate} openLead={openLead} />;
  }
  if (parts[0] === 'courses' && parts[1]) {
    const { direction, program } = findProgram('courses', parts[1]);
    if (direction && program) {
      return <ProgramPage direction={direction} program={program} navigate={navigate} openLead={openLead} />;
    }
  }
  if (parts.length === 1) {
    const direction = findDirection(parts[0]);
    if (direction) return <DirectionPage direction={direction} navigate={navigate} openLead={openLead} />;
  }
  if (parts.length === 2) {
    const { direction, program } = findProgram(parts[0], parts[1]);
    if (direction && program) {
      return <ProgramPage direction={direction} program={program} navigate={navigate} openLead={openLead} />;
    }
  }
  return <NotFoundPage navigate={navigate} />;
}

function Header({
  navigate,
  currentPath,
  menuOpen,
  setMenuOpen,
  openLead,
}: {
  navigate: (path: string) => void;
  currentPath: string;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  openLead: (context: LeadContext) => void;
}) {
  const handleNav = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    navigate(path);
  };
  const isActive = (path: string) => currentPath === path || (path === '/filialy' && currentPath.startsWith('/filialy/'));

  return (
    <header className="site-header">
      <a className="brand-link" href={hrefFor('/')} onClick={(event) => handleNav(event, '/')} aria-label="На главную">
        <BrandLogo />
      </a>
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
          <a
            key={item.label}
            href={hrefFor(item.path)}
            className={isActive(item.path) ? 'nav-link is-active' : 'nav-link'}
            onClick={(event) => handleNav(event, item.path)}
          >
            {item.label}
          </a>
        ))}
        <button className="header-cta" type="button" onClick={() => openLead({ source: 'header' })}>
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
  openLead,
}: {
  navigate: (path: string) => void;
  audience: Audience;
  setAudience: (audience: Audience) => void;
  openLead: (context: LeadContext) => void;
}) {
  const popularPrograms = popularCourses.slice(0, 3).map((program) => ({
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
  const openHomeLead = (source: string) => openLead({ source, audience });

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
            <button className="primary-button" type="button" onClick={() => openHomeLead('home-hero')}>
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
              Выберите направление и приходите на первое занятие. Каждая плитка ведёт
              на отдельную страницу с программами.
            </p>
          </div>
          <button className="text-button" type="button" onClick={() => navigate('/directions')}>
            Все направления
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
          <p>Обучение собрано вокруг действий: попробовать, увидеть ошибку, исправить и сделать следующий шаг.</p>
        </div>
        <MethodSteps />
      </section>

      <section className="section section-blue popular-section">
        <div className="section-heading split-heading">
          <div>
            <h2>Популярные курсы</h2>
            <p>Три быстрых маршрута для выбора: язык, робототехника и вождение.</p>
          </div>
          <button className="text-button" type="button" onClick={() => navigate('/courses')}>
            Все курсы
          </button>
        </div>
        <div className="program-grid program-grid--featured">
          {popularPrograms.map(({ direction, program }) => (
            <ProgramCard
              key={`${direction.slug}-${program.slug}`}
              direction={direction}
              program={program}
              navigate={navigate}
            />
          ))}
        </div>
      </section>

      <HomeBranchesBlock navigate={navigate} />

      <LeadSection
        selectedDirection={directions[0]}
        audience={audience}
        source="home-final-cta"
        onOpenLead={openLead}
      />
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

function MethodSteps() {
  return (
    <div className="method-steps" aria-label="Как устроено обучение">
      {methodSteps.map((step) => (
        <article className="method-step" key={step.number}>
          <span>{step.number}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </article>
      ))}
    </div>
  );
}

function HomeBranchesBlock({ navigate }: { navigate: (path: string) => void }) {
  const visibleReviews = activeBranches.flatMap((branch) => branch.reviews).slice(0, 2);
  const cityOptions = useMemo(() => uniqueValues(activeBranches.map((branch) => branch.city)), []);
  const [selectedCity, setSelectedCity] = useState(cityOptions[0] ?? '');
  const districtOptions = useMemo(() => {
    const source = selectedCity ? activeBranches.filter((branch) => branch.city === selectedCity) : activeBranches;
    return uniqueValues(source.map((branch) => branch.district));
  }, [selectedCity]);
  const [selectedDistrict, setSelectedDistrict] = useState('');

  useEffect(() => {
    if (selectedDistrict && !districtOptions.includes(selectedDistrict)) {
      setSelectedDistrict('');
    }
  }, [districtOptions, selectedDistrict]);

  const filteredBranches = activeBranches.filter((branch) => {
    const cityMatch = selectedCity ? branch.city === selectedCity : true;
    const districtMatch = selectedDistrict ? branch.district === selectedDistrict : true;
    return cityMatch && districtMatch;
  });
  const [activeBranchId, setActiveBranchId] = useState(filteredBranches[0]?.id ?? activeBranches[0]?.id ?? '');

  useEffect(() => {
    if (!filteredBranches.some((branch) => branch.id === activeBranchId)) {
      setActiveBranchId(filteredBranches[0]?.id ?? '');
    }
  }, [activeBranchId, filteredBranches]);

  return (
    <section className={visibleReviews.length ? 'section home-branches' : 'section home-branches home-branches--map-only'}>
      {visibleReviews.length ? (
        <div className="home-reviews">
          <h2>Вам нравится</h2>
          <div className="review-grid">
            {visibleReviews.map((review) => (
              <article className="review-card" key={review.id}>
                <strong>{review.author}</strong>
                <p>{review.text}</p>
                <span>{review.context}</span>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      <div className="home-branch-picker">
        <div className="section-heading split-heading">
          <div>
            <h2>Выберите филиал</h2>
            <p>Схема помогает быстро сравнить районы и перейти на страницу нужной точки.</p>
          </div>
          <button className="text-button" type="button" onClick={() => navigate('/filialy')}>
            Все филиалы
          </button>
        </div>
        <div className="branch-picker-controls">
          <label className="field compact-field">
            <span>Город</span>
            <select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
              <option value="">Любой</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <label className="field compact-field">
            <span>Район</span>
            <select value={selectedDistrict} onChange={(event) => setSelectedDistrict(event.target.value)}>
              <option value="">Любой</option>
              {districtOptions.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>
        </div>
        {filteredBranches.length ? (
          <BranchMap
            branches={filteredBranches}
            activeBranchId={activeBranchId}
            onActivate={setActiveBranchId}
            navigate={navigate}
            compact
          />
        ) : (
          <div className="empty-state">По выбранным фильтрам филиалов нет.</div>
        )}
      </div>
    </section>
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
  openLead,
}: {
  direction: Direction;
  navigate: (path: string) => void;
  openLead: (context: LeadContext) => void;
}) {
  const availableBranches = activeBranches.filter((branch) => branch.directionIds.includes(direction.slug));

  return (
    <>
      <DirectionHero direction={direction} navigate={navigate} openLead={openLead} />
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
            Формат и длительность зависят от программы, возраста ученика и удобного филиала.
            Подберём подходящий вариант в заявке.
          </p>
        </InfoPanel>
        <InfoPanel title="Филиалы направления">
          <div className="branch-mini-list">
            {availableBranches.map((branch) => (
              <button key={branch.id} type="button" onClick={() => navigate(branchPath(branch))}>
                <strong>{branch.shortName}</strong>
                <span>{branch.city} · {branch.district}</span>
              </button>
            ))}
          </div>
        </InfoPanel>
      </section>
      <section className="section">
        <FAQ items={direction.faqs} />
      </section>
      <RelatedDirections active={direction.slug} navigate={navigate} />
      <LeadSection selectedDirection={direction} source="direction-final-cta" onOpenLead={openLead} />
    </>
  );
}

function ProgramPage({
  direction,
  program,
  navigate,
  openLead,
}: {
  direction: Direction;
  program: Program;
  navigate: (path: string) => void;
  openLead: (context: LeadContext) => void;
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
            <button
              className="primary-button"
              type="button"
              onClick={() => openLead({ source: 'program-hero', selectedDirection: direction, selectedProgram: program })}
            >
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
          <p>{program.priceFrom ? `Стоимость курса: от ${program.priceFrom} ₽.` : 'Стоимость зависит от группы и филиала.'}</p>
        </InfoPanel>
      </section>
      <LeadSection
        selectedDirection={direction}
        selectedProgram={program}
        source="program-final-cta"
        onOpenLead={openLead}
      />
    </>
  );
}

function branchDirections(branch: Branch) {
  return directions.filter((direction) => branch.directionIds.includes(direction.slug));
}

function branchCourses(branch: Branch) {
  return branch.courseIds
    .map((slug) => allCourses.find((course) => course.slug === slug))
    .filter((course): course is Program => Boolean(course));
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'ru'));
}

function BranchesPage({
  navigate,
  openLead,
}: {
  navigate: (path: string) => void;
  openLead: (context: LeadContext) => void;
}) {
  const initialParams = new URLSearchParams(window.location.search);
  const [selectedCity, setSelectedCity] = useState(initialParams.get('city') ?? '');
  const [selectedDistrict, setSelectedDistrict] = useState(initialParams.get('district') ?? '');
  const [selectedDirection, setSelectedDirection] = useState<Direction['slug'] | ''>(
    (initialParams.get('direction') as Direction['slug'] | null) ?? '',
  );

  const cityOptions = useMemo(() => uniqueValues(activeBranches.map((branch) => branch.city)), []);
  const districtOptions = useMemo(() => {
    const source = selectedCity ? activeBranches.filter((branch) => branch.city === selectedCity) : activeBranches;
    return uniqueValues(source.map((branch) => branch.district));
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDistrict && !districtOptions.includes(selectedDistrict)) {
      setSelectedDistrict('');
    }
  }, [districtOptions, selectedDistrict]);

  const filteredBranches = useMemo(
    () =>
      activeBranches.filter((branch) => {
        const cityMatch = selectedCity ? branch.city === selectedCity : true;
        const districtMatch = selectedDistrict ? branch.district === selectedDistrict : true;
        const directionMatch = selectedDirection ? branch.directionIds.includes(selectedDirection) : true;
        return cityMatch && districtMatch && directionMatch;
      }),
    [selectedCity, selectedDistrict, selectedDirection],
  );

  const [activeBranchId, setActiveBranchId] = useState(filteredBranches[0]?.id ?? '');

  useEffect(() => {
    if (!filteredBranches.some((branch) => branch.id === activeBranchId)) {
      setActiveBranchId(filteredBranches[0]?.id ?? '');
    }
  }, [activeBranchId, filteredBranches]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (selectedDistrict) params.set('district', selectedDistrict);
    if (selectedDirection) params.set('direction', selectedDirection);
    const query = params.toString();
    const nextUrl = `${deploymentBase()}/filialy${query ? `?${query}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
  }, [selectedCity, selectedDistrict, selectedDirection]);

  const resetFilters = () => {
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedDirection('');
  };

  return (
    <>
      <section className="branches-index section-dark">
        <div className="section-inner branches-index-inner">
          <Breadcrumbs
            dark
            items={[
              { label: 'Главная', path: '/' },
              { label: 'Филиалы' },
            ]}
            navigate={navigate}
          />
          <div className="branches-index-copy">
            <span className="eyebrow">Все филиалы</span>
            <h1>Филиалы рядом</h1>
            <p>
              Выберите город, район и направление, чтобы увидеть подходящие занятия рядом с вами.
            </p>
          </div>
          <div className="branch-filters" aria-label="Фильтры филиалов">
            <label className="field compact-field">
              <span>Город</span>
              <select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
                <option value="">Любой</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
            <label className="field compact-field">
              <span>Район</span>
              <select value={selectedDistrict} onChange={(event) => setSelectedDistrict(event.target.value)}>
                <option value="">Любой</option>
                {districtOptions.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </label>
            <label className="field compact-field">
              <span>Направление</span>
              <select value={selectedDirection} onChange={(event) => setSelectedDirection(event.target.value as Direction['slug'] | '')}>
                <option value="">Любое</option>
                {directions.map((direction) => (
                  <option key={direction.slug} value={direction.slug}>
                    {direction.title}
                  </option>
                ))}
              </select>
            </label>
            <button className="secondary-button branch-reset" type="button" onClick={resetFilters}>
              Сбросить
            </button>
          </div>
          <BranchMap
            branches={filteredBranches}
            activeBranchId={activeBranchId}
            onActivate={setActiveBranchId}
            navigate={navigate}
          />
        </div>
      </section>
      <section className="section branch-results-section">
        <div className="section-heading split-heading">
          <div>
            <h2>Филиалы</h2>
            <p>Карточки синхронизированы с маркерами на карте-схеме.</p>
          </div>
          <span className="result-count">{filteredBranches.length} из {activeBranches.length}</span>
        </div>
        {filteredBranches.length ? (
          <BranchList branches={filteredBranches} navigate={navigate} activeBranchId={activeBranchId} onActivate={setActiveBranchId} />
        ) : (
          <div className="empty-state">
            По выбранным фильтрам филиалов нет. Сбросьте фильтры или выберите другое направление.
          </div>
        )}
      </section>
      <LeadSection source="branches-final-cta" onOpenLead={openLead} />
    </>
  );
}

function BranchPage({
  branch,
  navigate,
  openLead,
}: {
  branch: Branch;
  navigate: (path: string) => void;
  openLead: (context: LeadContext) => void;
}) {
  const directionsInBranch = branchDirections(branch);
  const coursesInBranch = branchCourses(branch);
  const branchFacts = [branch.address, branch.nearestMetro, branch.workingHours, branch.ageGroups.join(' · ')].filter(Boolean);

  return (
    <>
      <section className="branch-hero section-dark">
        <div className="section-inner">
          <Breadcrumbs
            dark
            items={[
              { label: 'Главная', path: '/' },
              { label: 'Филиалы', path: '/filialy' },
              { label: branch.shortName },
            ]}
            navigate={navigate}
          />
          <div className="branch-hero-grid">
            <div className="branch-hero-copy">
              <span className="eyebrow">Страница филиала</span>
              <h1>{branch.name}</h1>
              <p>{branch.fullDescription}</p>
              {branchFacts.length ? (
                <div className="branch-facts">
                  {branchFacts.map((fact) => (
                    <span key={fact}>{fact}</span>
                  ))}
                </div>
              ) : null}
              <div className="hero-actions">
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => openLead({ source: 'branch-hero', selectedBranch: branch })}
                >
                  Записаться
                </button>
                {branch.routeUrl ? (
                  <a className="secondary-button route-link" href={branch.routeUrl} target="_blank" rel="noreferrer">
                    Построить маршрут
                  </a>
                ) : null}
              </div>
            </div>
            <div className="branch-hero-media" aria-label="Фото филиала">
              {branch.heroImages.map((image, index) => (
                <figure className={`branch-organic branch-organic--${index + 1}`} key={image.src}>
                  <img src={image.src} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section branch-detail-section">
        <div className="section-heading split-heading">
          <div>
            <h2>Направления</h2>
            <p>Направления берутся из общей структуры сайта и фильтруются по этому филиалу.</p>
          </div>
          <button className="text-button" type="button" onClick={() => navigate('/directions')}>
            Смотреть все
          </button>
        </div>
        <div className="branch-direction-grid">
          {directionsInBranch.map((direction) => (
            <MiniDirection key={direction.slug} direction={direction} navigate={navigate} />
          ))}
        </div>
      </section>

      <section className="section branch-detail-section branch-course-section">
        <div className="section-heading">
          <h2>Курсы в филиале</h2>
          <p>Набор программ связан с направлениями этого филиала.</p>
        </div>
        <div className="program-grid">
          {coursesInBranch.map((program) => (
            <ProgramCard
              key={program.id}
              direction={findDirection(program.directionId) ?? directions[0]}
              program={program}
              navigate={navigate}
            />
          ))}
        </div>
      </section>

      {branch.teachers.length ? (
        <section className="section branch-detail-section">
          <div className="section-heading">
            <h2>Преподаватели</h2>
          </div>
          <div className="teacher-grid">
            {branch.teachers.map((teacher) => (
              <article className="teacher-card" key={teacher.id}>
                {teacher.photo ? <img src={teacher.photo} alt={teacher.name} loading="lazy" /> : null}
                <h3>{teacher.name}</h3>
                <p>{teacher.specialization}</p>
                <span>{teacher.experience}</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {branch.schedule.length || branch.address || branch.travelTime ? (
        <section className="section branch-detail-section">
          <div className="detail-grid-section">
            {branch.schedule.length ? (
              <InfoPanel title="Расписание">
                <div className="schedule-list">
                  {branch.schedule.map((item) => {
                    const direction = findDirection(item.directionId);
                    return (
                      <div className="schedule-row" key={item.id}>
                        <strong>{item.time}</strong>
                        <span>{direction?.shortTitle ?? item.directionId}</span>
                        <span>{item.ageGroup}</span>
                        <span>{item.seatsStatus}</span>
                      </div>
                    );
                  })}
                </div>
              </InfoPanel>
            ) : null}
            {branch.address || branch.travelTime ? (
              <InfoPanel title="Как добраться">
                {branch.address ? <p>{branch.address}</p> : null}
                {branch.travelTime ? <p>{branch.travelTime}</p> : null}
                <BranchMap branches={[branch]} activeBranchId={branch.id} onActivate={() => undefined} navigate={navigate} compact />
              </InfoPanel>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="section branch-gallery-section">
        <div className="section-heading">
          <h2>Пространство филиала</h2>
          <p>Фото используются из материалов, переданных для проекта.</p>
        </div>
        <div className="branch-gallery">
          {branch.galleryImages.map((image, index) => (
            <figure className={`branch-gallery-item branch-gallery-item--${index + 1}`} key={`${image.src}-${index}`}>
              <img src={image.src} alt={image.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>

      {branch.reviews.length ? (
        <section className="section branch-detail-section">
          <div className="section-heading">
            <h2>Отзывы</h2>
          </div>
          <div className="review-grid">
            {branch.reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <strong>{review.author}</strong>
                <p>{review.text}</p>
                <span>{review.context}</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <LeadSection selectedBranch={branch} source="branch-final-cta" onOpenLead={openLead} />
    </>
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
    <InnerPage title="Запись на занятие" intro="Оставьте контакты, и мы подберём направление, возрастную группу и удобный формат.">
      <div className="contacts-grid contacts-grid--single">
        <LeadForm source="contacts-page" />
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

function DirectionHero({
  direction,
  navigate,
  openLead,
}: {
  direction: Direction;
  navigate: (path: string) => void;
  openLead: (context: LeadContext) => void;
}) {
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
          <button
            className="primary-button"
            type="button"
            onClick={() => openLead({ source: 'direction-hero', selectedDirection: direction })}
          >
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

  if (compact) {
    return (
      <button className="direction-card compact" type="button" onClick={() => navigate(directionPath(direction))}>
        <img src={direction.image} alt="" loading="lazy" />
        <span>{homeDirectionLabels[direction.slug] ?? direction.shortTitle}</span>
        <strong aria-hidden="true">↗</strong>
      </button>
    );
  }

  return (
    <article className="direction-card">
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
      {program.priceFrom ? <strong className="program-price">от {program.priceFrom} ₽</strong> : null}
      <button className="text-button" type="button" onClick={() => navigate(programPath(direction, program))}>
        Подробнее
      </button>
    </article>
  );
}

function BranchList({
  branches: items = activeBranches,
  compact,
  navigate,
  activeBranchId,
  onActivate,
}: {
  branches?: Branch[];
  compact?: boolean;
  navigate: (path: string) => void;
  activeBranchId?: string;
  onActivate?: (id: string) => void;
}) {
  return (
    <div className={compact ? 'branch-list compact' : 'branch-list'}>
      {items.map((branch) => (
        <BranchCard
          key={branch.id}
          branch={branch}
          navigate={navigate}
          active={activeBranchId === branch.id}
          onActivate={onActivate}
        />
      ))}
    </div>
  );
}

function BranchCard({
  branch,
  navigate,
  active,
  onActivate,
}: {
  branch: Branch;
  navigate: (path: string) => void;
  active?: boolean;
  onActivate?: (id: string) => void;
}) {
  const directionsText = branchDirections(branch)
    .slice(0, 4)
    .map((direction) => direction.shortTitle)
    .join(' · ');

  return (
    <article className={active ? 'branch-card is-active' : 'branch-card'} id={`branch-${branch.id}`}>
      <div className="branch-card-head">
        <span className="branch-pin" aria-hidden="true" />
        <div>
          <h3>{branch.shortName}</h3>
          <p>{branch.city} · {branch.district}</p>
        </div>
      </div>
      {branch.address ? <strong>{branch.address}</strong> : null}
      <p>{directionsText}</p>
      <div className="branch-card-actions">
        {onActivate ? (
          <button className="secondary-button" type="button" onClick={() => onActivate(branch.id)}>
            На карте
          </button>
        ) : null}
        <button className="text-button" type="button" onClick={() => navigate(branchPath(branch))}>
          Выбрать филиал
        </button>
      </div>
    </article>
  );
}

function BranchMap({
  branches: items,
  activeBranchId,
  onActivate,
  navigate,
  compact,
}: {
  branches: Branch[];
  activeBranchId: string;
  onActivate: (id: string) => void;
  navigate: (path: string) => void;
  compact?: boolean;
}) {
  const activeBranch = items.find((branch) => branch.id === activeBranchId) ?? items[0];

  const activate = (branch: Branch) => {
    onActivate(branch.id);
    window.setTimeout(() => {
      document.getElementById(`branch-${branch.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 0);
  };

  return (
    <div className={compact ? 'branch-map compact' : 'branch-map'} aria-label="Карта филиалов Практики">
      <div className="branch-map-grid" aria-hidden="true" />
      <div className="branch-map-route branch-map-route--one" aria-hidden="true" />
      <div className="branch-map-route branch-map-route--two" aria-hidden="true" />
      <div className="branch-map-route branch-map-route--three" aria-hidden="true" />
      {items.map((branch) => (
        <button
          className={activeBranch?.id === branch.id ? 'branch-marker is-active' : 'branch-marker'}
          key={branch.id}
          type="button"
          style={{ left: `${branch.mapPosition.x}%`, top: `${branch.mapPosition.y}%` }}
          aria-label={`Показать филиал ${branch.shortName}`}
          onClick={() => activate(branch)}
        >
          <span />
        </button>
      ))}
      {activeBranch ? (
        <div
          className="branch-map-card"
          style={{
            left: `min(${activeBranch.mapPosition.x + 4}%, 72%)`,
            top: `min(${activeBranch.mapPosition.y + 4}%, 72%)`,
          }}
        >
          <strong>{activeBranch.shortName}</strong>
          <span>{activeBranch.district}</span>
          <button type="button" onClick={() => navigate(branchPath(activeBranch))}>
            Открыть страницу
          </button>
        </div>
      ) : null}
      <img className="branch-map-mascot" src="assets/mascot-main.png" alt="" />
    </div>
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
  selectedBranch,
  audience,
  source = 'section-cta',
  onOpenLead,
}: {
  selectedDirection?: Direction;
  selectedProgram?: Program;
  selectedBranch?: Branch;
  audience?: Audience;
  source?: string;
  onOpenLead: (context: LeadContext) => void;
}) {
  return (
    <section className="section lead-section" id="lead">
      <img
        className="lead-peeking-mascot"
        src="assets/mascot-footer-peeking.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        width="1536"
        height="1024"
      />
      <div className="lead-copy">
        <h2>Пора попробовать</h2>
        <p>
          Подберём направление, аудиторию и удобный филиал для первого занятия.
        </p>
        <button
          className="primary-button"
          type="button"
          onClick={() => onOpenLead({ selectedDirection, selectedProgram, selectedBranch, audience, source })}
        >
          Найти курс
        </button>
        <div className="lead-brand-row" aria-hidden="true">
          <BrandLogo />
        </div>
      </div>
    </section>
  );
}

function LeadModal({ context, onClose }: { context: LeadContext; onClose: () => void }) {
  const modalRef = useRef<HTMLElement | null>(null);
  const title = context.selectedProgram?.title
    ? `Запись: ${context.selectedProgram.title}`
    : 'Подобрать занятие';

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute('disabled'));

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    window.setTimeout(() => modalRef.current?.querySelector<HTMLElement>('input, select, button')?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title" ref={modalRef}>
        <button className="modal-close" type="button" aria-label="Закрыть форму" onClick={onClose}>
          ×
        </button>
        <div className="section-heading">
          <h2 id="lead-modal-title">{title}</h2>
          <p>Заполните короткую форму, чтобы мы подобрали удобный вариант занятия.</p>
        </div>
        <LeadForm
          selectedDirection={context.selectedDirection}
          selectedProgram={context.selectedProgram}
          selectedBranch={context.selectedBranch}
          audience={context.audience}
          source={context.source}
        />
      </section>
    </div>
  );
}

function LeadForm({
  selectedDirection,
  selectedProgram,
  selectedBranch,
  audience,
  source = 'lead-form',
}: {
  selectedDirection?: Direction;
  selectedProgram?: Program;
  selectedBranch?: Branch;
  audience?: Audience;
  source?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [directionSlug, setDirectionSlug] = useState(selectedDirection?.slug ?? directions[0].slug);
  const tracking = useMemo(trackingFields, []);

  useEffect(() => {
    if (selectedDirection) {
      setDirectionSlug(selectedDirection.slug);
    }
  }, [selectedDirection]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="success-state" role="status">
        <strong>Спасибо, заявка заполнена.</strong>
        <p>Мы свяжемся с вами по указанному телефону.</p>
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
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>Согласен на обработку персональных данных.</span>
      </label>
      {Object.entries(tracking).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <input type="hidden" name="pageUrl" value={window.location.href} />
      <input type="hidden" name="referer" value={document.referrer} />
      <input type="hidden" name="audience" value={audience ?? ''} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="directionId" value={directionSlug} />
      <input type="hidden" name="programId" value={selectedProgram?.id ?? ''} />
      <input type="hidden" name="program" value={selectedProgram?.title ?? ''} />
      <input type="hidden" name="branchId" value={selectedBranch?.id ?? ''} />
      <input type="hidden" name="branchName" value={selectedBranch?.name ?? ''} />
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
  const handleLink = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <nav className={dark ? 'breadcrumbs dark' : 'breadcrumbs'} aria-label="Хлебные крошки">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.path ? (
            <a href={hrefFor(item.path)} onClick={(event) => handleLink(event, item.path!)}>
              {item.label}
            </a>
          ) : (
            item.label
          )}
        </span>
      ))}
    </nav>
  );
}

function Footer({ navigate }: { navigate: (path: string) => void }) {
  const handleLink = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <footer className="site-footer">
      <div>
        <a className="brand-link footer-brand" href={hrefFor('/')} onClick={(event) => handleLink(event, '/')}>
          <BrandLogo />
        </a>
        <p>Офлайн-образование через действие для детей и взрослых.</p>
      </div>
      <div className="footer-links">
        {navItems.map((item) => (
          <a key={item.path} href={hrefFor(item.path)} onClick={(event) => handleLink(event, item.path)}>
            {item.label}
          </a>
        ))}
      </div>
      <div className="footer-note">Практика через действие, пробу и понятный следующий шаг.</div>
    </footer>
  );
}
