import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Audience,
  audienceLabels,
  branches,
  directions,
  findDirection,
  findProgram,
  programPath,
  siteMap,
} from './data';
import type { Branch, Direction, Program } from './data';

const navItems = [
  { path: '/directions', label: 'Направления' },
  { path: '/directions?audience=child', label: 'Детям' },
  { path: '/directions?audience=self', label: 'Взрослым' },
  { path: '/branches', label: 'Филиалы' },
];

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
    return params.get('audience') === 'child' ? 'child' : 'self';
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
    if (nextAudience === 'child' || nextAudience === 'self') {
      setAudience(nextAudience);
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
  const direction = parts[0] ? findDirection(parts[0]) : undefined;
  if (direction && parts.length === 1) {
    return {
      title: `${direction.title} — Практика`,
      description: `${direction.summary} Запишитесь на пробное занятие или консультацию.`,
    };
  }
  if (direction && parts[1]) {
    const { program } = findProgram(parts[0], parts[1]);
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
  if (path === '/branches') {
    return <BranchesPage navigate={navigate} />;
  }
  if (path === '/about') {
    return <AboutPage navigate={navigate} />;
  }
  if (path === '/contacts') {
    return <ContactsPage />;
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
        <button className="header-cta" type="button" onClick={() => navigate('/directions')}>
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
  const popularPrograms = directions.flatMap((direction) =>
    direction.programs.slice(0, 1).map((program) => ({ direction, program })),
  );

  return (
    <>
      <section className="hero section-dark">
        <div className="hero-copy">
          <h1>Учиться получается, когда начинаешь делать</h1>
          <p>
            «Практика» объединяет офлайн-направления для детей и взрослых: языки,
            автошколу, робототехнику, школьные предметы, творчество и цифровые навыки.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => navigate('/directions')}>
              Подобрать занятие
            </button>
            <AudienceSwitch audience={audience} onChange={setAudience} />
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <img src="assets/hero-praktika.png" alt="" />
        </div>
      </section>

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
        <DirectionRail directions={directions.slice(0, 4)} navigate={navigate} />
      </section>

      <section className="section how-section">
        <div className="section-heading">
          <h2>Как работает «Практика»</h2>
          <p>Каждое направление собирается вокруг одного цикла: проба, ошибка, разбор, повтор.</p>
        </div>
        <div className="practice-loop" aria-label="Цикл обучения">
          {['Пробуем', 'Ошибаемся', 'Разбираем', 'Повторяем'].map((item) => (
            <div className="loop-step" key={item}>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section audience-section">
        <div className="audience-panel">
          <div>
            <h2>Для себя или для ребёнка</h2>
            <p>
              Один бренд, но разные сценарии выбора: взрослым важны цель, график и результат;
              родителям — возраст, безопасность маршрута и понятная обратная связь.
            </p>
          </div>
          <AudienceSwitch audience={audience} onChange={setAudience} />
        </div>
        <div className="audience-grid">
          {directions
            .filter((direction) => direction.audience.includes(audience))
            .slice(0, 3)
            .map((direction) => (
              <MiniDirection key={direction.slug} direction={direction} navigate={navigate} />
            ))}
        </div>
      </section>

      <section className="section section-blue">
        <div className="section-heading">
          <h2>Популярные программы</h2>
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
        <BranchList compact />
      </section>

      <section className="section people-section">
        <div className="section-heading">
          <h2>Преподаватели и инструкторы</h2>
          <p>
            Блок предусмотрен в структуре. Имена, роли, фото и опыт не добавлены, потому
            что в ТЗ нет подтверждённых данных.
          </p>
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
    </>
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
          <h2>Программы направления</h2>
          <p>Каждая программа может стать отдельной страницей с расписанием, ценой и филиалами.</p>
        </div>
        <div className="program-grid">
          {direction.programs.map((program) => (
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
            { label: direction.title, path: `/${direction.slug}` },
            { label: program.title },
          ]}
          navigate={navigate}
        />
        <div className="program-hero-grid">
          <div>
            <h1>{program.title}</h1>
            <p>{program.summary}</p>
            <button className="primary-button" type="button" onClick={() => navigate('/contacts')}>
              Записаться на консультацию
            </button>
          </div>
          <div className="program-fact">
            <span>Возраст</span>
            <strong>{program.age}</strong>
            <span>Формат</span>
            <p>{program.format}</p>
          </div>
        </div>
      </section>
      <section className="section detail-grid-section">
        <InfoPanel title="Описание">
          <p>{program.summary}</p>
        </InfoPanel>
        <InfoPanel title="Программа">
          <p>
            Подробные модули, расписание и материалы нужно добавить после утверждения
            учебной программы.
          </p>
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
        <div className="direction-art">
          <img src={direction.image} alt="" />
          <p>{direction.doodle}</p>
        </div>
      </div>
    </section>
  );
}

function AudienceSwitch({ audience, onChange }: { audience: Audience; onChange: (audience: Audience) => void }) {
  return (
    <div className="audience-switch" role="group" aria-label="Выбор аудитории">
      {(['self', 'child'] as Audience[]).map((item) => (
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
  return (
    <article className={compact ? 'direction-card compact' : 'direction-card'}>
      <img src={direction.image} alt="" />
      <div>
        <h3>{direction.shortTitle}</h3>
        <p>{direction.summary}</p>
        <button className="text-button" type="button" onClick={() => navigate(`/${direction.slug}`)}>
          Открыть направление
        </button>
      </div>
    </article>
  );
}

function MiniDirection({ direction, navigate }: { direction: Direction; navigate: (path: string) => void }) {
  return (
    <button className="mini-direction" type="button" onClick={() => navigate(`/${direction.slug}`)}>
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
      <div className="program-card-top">
        <span>{direction.shortTitle}</span>
        <strong>{program.age}</strong>
      </div>
      <h3>{program.title}</h3>
      <p>{program.summary}</p>
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
            <button key={direction.slug} type="button" onClick={() => navigate(`/${direction.slug}`)}>
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
