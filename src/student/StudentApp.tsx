import { useState } from 'react';
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { course } from './content';
import { themeFor } from '../lib/theme';
import Home from './pages/Home';
import MissionPage from './pages/MissionPage';
import Words from './pages/Words';
import Toolkit from './pages/Toolkit';
import MyCard from './pages/MyCard';
import Showcase from './pages/Showcase';
import { ToolGuideList, ToolGuidePage } from './pages/ToolGuides';
import { useGuildCard } from './store';

const NAV = [
  { to: '/', label: 'Quest map', icon: '🗺️', tile: '#e3f5fe', end: true },
  { to: '/tools', label: 'Tool guides', icon: '🧭', tile: '#e6f9f1' },
  { to: '/words', label: 'Word cards', icon: '🃏', tile: '#ffe8f2' },
  { to: '/toolkit', label: 'Cheat sheets', icon: '🧰', tile: '#efeaff' },
  { to: '/showcase', label: 'My Showcase', icon: '🖼️', tile: '#ffefe0' },
  { to: '/me', label: 'My Guild card', icon: '🪪', tile: '#fff6d9' }
];

export default function StudentApp() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [card] = useGuildCard();
  const navigate = useNavigate();
  return (
    <div className="shell student">
      <header className="topbar">
        <button className="iconbtn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
          ☰
        </button>
        <span className="logo">ai creators guild</span>
      </header>
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
        <div className="logo">
          ai creators<small>guild · student hub</small>
        </div>
        {card.nickname && (
          <NavLink to="/me" className="me-chip">
            <span>{card.avatar}</span>
            <b>{card.nickname}</b>
          </NavLink>
        )}
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              <span className="tile" style={{ background: n.tile }}>
                {n.icon}
              </span>
              {n.label}
            </NavLink>
          ))}
          <div className="nav-group">Quests</div>
          {course.modules.map((m) => {
            const t = themeFor(m.number);
            return (
              <a
                key={m.id}
                href={`#/`}
                className={pathname.startsWith(`/m/${m.id}`) ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  setTimeout(() => document.getElementById(m.id)?.scrollIntoView({ behavior: 'smooth' }), 80);
                }}
              >
                <span className="tile" style={{ background: t.soft }}>
                  {t.icon}
                </span>
                <span className="navtext">
                  {m.title}
                  {m.status !== 'ready' && <span className="soon">locked</span>}
                </span>
              </a>
            );
          })}
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/m/:moduleId/l/:n" element={<MissionPage />} />
          <Route path="/words" element={<Words />} />
          <Route path="/toolkit" element={<Toolkit />} />
          <Route path="/me" element={<MyCard />} />
          <Route path="/tools" element={<ToolGuideList />} />
          <Route path="/tools/:id" element={<ToolGuidePage />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}
