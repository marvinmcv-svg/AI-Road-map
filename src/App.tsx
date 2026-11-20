import { useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { isUnlocked, lock } from './lib/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import ModulePage from './pages/ModulePage';
import LessonPage from './pages/LessonPage';
import Glossary from './pages/Glossary';
import ToolsPage from './pages/ToolsPage';
import GamificationPage from './pages/GamificationPage';
import Tracker from './pages/Tracker';
import Rubrics from './pages/Rubrics';
import { course } from './lib/content';
import { themeFor } from './lib/theme';

const NAV = [
  { to: '/', label: 'Learn path', icon: '🗺️', tile: '#e3f5fe', end: true },
  { to: '/overview', label: 'Course plan', icon: '📋', tile: '#efeaff' },
  { to: '/tracker', label: 'XP & houses', icon: '⭐', tile: '#fff6d9' },
  { to: '/gamification', label: 'Game rules', icon: '🏆', tile: '#ffe8f2' },
  { to: '/glossary', label: 'Glossary', icon: '📖', tile: '#e1f9f1' },
  { to: '/tools', label: 'AI tools', icon: '🧰', tile: '#fff0e2' },
  { to: '/rubrics', label: 'Rubrics', icon: '✅', tile: '#e7eaf4' }
];

export default function App() {
  const [unlocked, setUnlocked] = useState(isUnlocked());
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  if (!unlocked) return <Login onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="shell">
      <header className="topbar no-print">
        <button className="iconbtn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
          ☰
        </button>
        <span className="logo">ai creators</span>
      </header>
      <aside className={`sidebar no-print ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
        <div className="logo">
          ai creators<small>teacher portal</small>
        </div>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              <span className="tile" style={{ background: n.tile }}>
                {n.icon}
              </span>
              {n.label}
            </NavLink>
          ))}
          <div className="nav-group">Modules</div>
          {course.modules.map((m) => {
            const t = themeFor(m.number);
            return (
              <NavLink key={m.id} to={`/m/${m.id}`} className={pathname.startsWith(`/m/${m.id}`) ? 'active' : ''}>
                <span className="tile" style={{ background: t.soft }}>
                  {t.icon}
                </span>
                <span className="navtext">
                  {m.title}
                  {m.status !== 'ready' && <span className="soon">soon</span>}
                </span>
              </NavLink>
            );
          })}
        </nav>
        <button
          className="btn ghost small"
          onClick={() => {
            lock();
            setUnlocked(false);
          }}
        >
          🔒 Lock portal
        </button>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/m/:moduleId" element={<ModulePage />} />
          <Route path="/m/:moduleId/l/:n" element={<LessonPage />} />
          <Route path="/gamification" element={<GamificationPage />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/rubrics" element={<Rubrics />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </div>
  );
}
