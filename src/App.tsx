import { useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
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

export default function App() {
  const [unlocked, setUnlocked] = useState(isUnlocked());
  if (!unlocked) return <Login onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="shell">
      <aside className="sidebar no-print">
        <div className="brand">✦ AI Creators<small>Teacher Portal</small></div>
        <nav>
          <NavLink to="/" end>🏠 Dashboard</NavLink>
          <NavLink to="/overview">🗺️ Course overview</NavLink>
          <div className="nav-group">Modules</div>
          {course.modules.map((m) => (
            <NavLink key={m.id} to={`/m/${m.id}`}>
              {m.number}. {m.title}{m.status !== "ready" && <span className="soon"> · soon</span>}
            </NavLink>
          ))}
          <div className="nav-group">Toolkit</div>
          <NavLink to="/gamification">🏆 Gamification</NavLink>
          <NavLink to="/tracker">⭐ XP tracker</NavLink>
          <NavLink to="/glossary">📖 Glossary</NavLink>
          <NavLink to="/tools">🧰 AI tools & ages</NavLink>
          <NavLink to="/rubrics">✅ Rubrics</NavLink>
        </nav>
        <button
          className="ghost"
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
