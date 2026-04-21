import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CampusMap from './CampusMap.jsx';
import {
  BUILDING_INFO,
  COURSES,
  CLASS_STYLES,
  FEE_ITEMS,
  ISSUED_BOOKS,
  MAP_BUILDING_CENTERS,
  NOTIFICATIONS_TEMPLATE,
  PAGE_LABELS,
  PAY_HISTORY,
  RESULTS,
  SEARCH_DATA,
  TIMETABLE_DATA,
  mapRoutePathD,
} from './data.js';

function cloneNotifications() {
  return NOTIFICATIONS_TEMPLATE.map((n) => ({ ...n }));
}

export default function App() {
  const mainRef = useRef(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [breadcrumbTrail, setBreadcrumbTrail] = useState(['dashboard']);
  const [notifications, setNotifications] = useState(cloneNotifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchDropOpen, setSearchDropOpen] = useState(false);
  const [searchFiltered, setSearchFiltered] = useState([]);
  const [mapScale, setMapScale] = useState(1);
  const [selectedMapBuildingId, setSelectedMapBuildingId] = useState(null);
  const [mapPanelId, setMapPanelId] = useState(null);
  const [mapSearch, setMapSearch] = useState('');
  const [jumpSelect, setJumpSelect] = useState('');
  const [payAmt, setPayAmt] = useState(12000);
  const [payMethod, setPayMethod] = useState('UPI (GPay / PhonePe)');
  const mapScaleRef = useRef(1);
  const [modal, setModal] = useState({ open: false, type: '', title: '', body: '' });
  const [toasts, setToasts] = useState([]);

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  const routeD = useMemo(() => {
    if (!selectedMapBuildingId) return '';
    const pt = MAP_BUILDING_CENTERS[selectedMapBuildingId];
    return pt ? mapRoutePathD(pt.cx, pt.cy) : '';
  }, [selectedMapBuildingId]);

  const toast = useCallback((msg) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2700);
  }, []);

  const updateBreadcrumb = useCallback(
    (page) => {
      if (page === 'dashboard') {
        setBreadcrumbTrail(['dashboard']);
        return;
      }
      setBreadcrumbTrail((t) => [...t, page]);
    },
    []
  );

  const navigate = useCallback(
    (page) => {
      setCurrentPage(page);
      updateBreadcrumb(page);
      if (mainRef.current) mainRef.current.scrollTo(0, 0);
      setSearchDropOpen(false);
      setGlobalSearch('');
      if (notifOpen) setNotifOpen(false);
    },
    [notifOpen, updateBreadcrumb]
  );

  useEffect(() => {
    mapScaleRef.current = mapScale;
  }, [mapScale]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!e.target.closest('#userMenuBtn') && !e.target.closest('#userMenu')) setUserMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const handleSearch = useCallback(
    (val) => {
      setGlobalSearch(val);
      if (!val.trim()) {
        setSearchDropOpen(false);
        return;
      }
      const results = SEARCH_DATA.filter((s) => s.label.toLowerCase().includes(val.toLowerCase()));
      if (!results.length) {
        setSearchDropOpen(false);
        return;
      }
      setSearchFiltered(results);
      setSearchDropOpen(true);
    },
    []
  );

  const searchNavigate = useCallback(
    (idx, val) => {
      const item = SEARCH_DATA[idx];
      navigate(item ? item.page : 'dashboard');
      setGlobalSearch(val);
      toast(`🔍 Navigated to: ${item ? item.label : 'Dashboard'}`);
      setSearchDropOpen(false);
    },
    [navigate, toast]
  );

  const toggleNotif = useCallback(() => {
    setNotifOpen((o) => !o);
  }, []);

  const markRead = useCallback(
    (i) => {
      setNotifications((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], unread: false };
        return next;
      });
    },
    []
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast('✅ All notifications marked as read');
  }, [toast]);

  const switchTab = useCallback((panelId, e) => {
    const btn = e.currentTarget;
    const pageEl = btn.closest('.page');
    if (!pageEl) return;
    pageEl.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    pageEl.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
  }, []);

  const saveProfile = useCallback(() => {
    toast('✅ Profile updated!');
  }, [toast]);

  const highlightBuilding = useCallback(
    (id) => {
      if (!id) {
        setSelectedMapBuildingId(null);
        setMapPanelId(null);
        setJumpSelect('');
        return;
      }
      setSelectedMapBuildingId(id);
      setMapPanelId(id);
      toast(`📍 Directions from Main Gate → ${BUILDING_INFO[id]?.name || id}`);
    },
    [toast]
  );

  const findBuilding = useCallback(() => {
    const val = mapSearch.trim().toLowerCase();
    if (!val) return;
    const match = Object.entries(BUILDING_INFO).find(
      ([k, v]) =>
        v.name.toLowerCase().includes(val) || k.includes(val) || v.desc.toLowerCase().includes(val)
    );
    if (match) highlightBuilding(match[0]);
    else toast('❌ Building not found. Try: Main, CS, Library, Auditorium, Parking...');
  }, [mapSearch, highlightBuilding, toast]);

  const mapZoom = useCallback(
    (factor) => {
      const n = Math.max(0.6, Math.min(2.5, mapScaleRef.current * factor));
      mapScaleRef.current = n;
      setMapScale(n);
      toast(`🔍 Zoom: ${Math.round(n * 100)}%`);
    },
    [toast]
  );

  const gw = Math.round(payAmt * 0.02);
  const payTotal = payAmt + gw;

  const showModal = (type, title, body) => {
    setModal({ open: true, type, title, body });
  };
  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  const payFees = useCallback(() => {
    const totalStr = `₹${payTotal.toLocaleString('en-IN')}`;
    setModal({
      open: true,
      type: 'payment',
      title: '💳 Confirm Payment',
      body: `You are about to pay ${totalStr} via ${payMethod}. Proceed?`,
    });
  }, [payTotal, payMethod]);

  const onModalOk = () => {
    if (modal.type === 'logout') {
      closeModal();
      toast('👋 Logged out. Redirecting...');
      return;
    }
    if (modal.type === 'payment') {
      closeModal();
      const totalStr = `₹${payTotal.toLocaleString('en-IN')}`;
      toast(`✅ Payment of ${totalStr} successful! Receipt sent to email.`);
      return;
    }
    closeModal();
  };

  const today = ['CS401', 'MA401', 'PH401', 'CS402', 'CS403'];
  const times = ['9:00 AM', '10:00 AM', '11:15 AM', '1:00 PM', '2:00 PM'];

  const buildingPanel = mapPanelId && BUILDING_INFO[mapPanelId] ? (
    <div className="card" style={{ borderLeft: '4px solid var(--gold)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{BUILDING_INFO[mapPanelId].icon}</div>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.2rem', marginBottom: 6 }}>
            {BUILDING_INFO[mapPanelId].name}
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--mist)', marginBottom: 14, lineHeight: 1.6 }}>
            {BUILDING_INFO[mapPanelId].desc}
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--mist)' }}>Floors:</span> <strong>{BUILDING_INFO[mapPanelId].floors}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--mist)' }}>Rooms:</span> <strong>{BUILDING_INFO[mapPanelId].rooms}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--mist)' }}>Hours:</span> <strong>{BUILDING_INFO[mapPanelId].hours}</strong>
            </div>
          </div>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setMapPanelId(null)}>
          ✕ Close
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="logo" onClick={() => navigate('dashboard')} style={{ cursor: 'pointer' }}>
            CampusHub <span className="logo-badge">SVIT</span>
          </div>
          <div className="topbar-search">
            <span className="si">🔍</span>
            <input
              type="text"
              placeholder="Search courses, faculty, buildings..."
              value={globalSearch}
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={() => setTimeout(() => setSearchDropOpen(false), 200)}
              autoComplete="off"
            />
            <div className={`search-results-drop ${searchDropOpen ? 'open' : ''}`}>
              {searchDropOpen &&
                searchFiltered.map((s, i) => (
                  <div
                    key={s.label + i}
                    className="srd-item"
                    onMouseDown={() => searchNavigate(i, globalSearch)}
                    role="button"
                  >
                    <span className="sri">{s.icon}</span>
                    <div>
                      <div>{s.label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>{s.cat}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="tb-right">
            <div className="tb-icon" onClick={() => navigate('timetable')} title="Timetable">
              📅
            </div>
            <div className="tb-icon" onClick={toggleNotif} title="Notifications">
              🔔 <span className="tb-badge">{unreadCount}</span>
            </div>
            <div className="dropdown">
              <div className="tb-user" onClick={() => setUserMenuOpen((o) => !o)} id="userMenuBtn">
                <div className="tb-avatar">RK</div>
                <span className="tb-uname">Ravi Kumar</span>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginLeft: 2 }}>▼</span>
              </div>
              <div className={`dropdown-menu ${userMenuOpen ? 'open' : ''}`} id="userMenu">
                <div className="dd-item" onClick={() => { navigate('profile'); setUserMenuOpen(false); }}>
                  👤 My Profile
                </div>
                <div className="dd-item" onClick={() => { navigate('results'); setUserMenuOpen(false); }}>
                  📊 My Results
                </div>
                <div className="dd-item" onClick={() => { setUserMenuOpen(false); toast('⚙️ Settings coming soon'); }}>
                  ⚙️ Settings
                </div>
                <div className="dd-divider" />
                <div className="dd-item danger" onClick={() => { setUserMenuOpen(false); showModal('logout', 'Log out', 'Are you sure?'); }}>
                  🚪 Log Out
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="subnav" id="subnav">
        {['dashboard', 'campus', 'courses', 'timetable', 'results', 'library'].map((p) => (
          <button
            key={p}
            type="button"
            className={`subnav-link ${currentPage === p ? 'active' : ''}`}
            id={`sn-${p}`}
            onClick={() => navigate(p)}
          >
            {p === 'dashboard' && '🏠 Dashboard'}
            {p === 'campus' && '🗺️ Campus Map'}
            {p === 'courses' && '📚 Courses'}
            {p === 'timetable' && '📅 Timetable'}
            {p === 'results' && '📊 Results'}
            {p === 'library' && '📖 Library'}
          </button>
        ))}
        <div className="subnav-divider" />
        {['fees', 'profile'].map((p) => (
          <button
            key={p}
            type="button"
            className={`subnav-link ${currentPage === p ? 'active' : ''}`}
            id={`sn-${p}`}
            onClick={() => navigate(p)}
          >
            {p === 'fees' && '💳 Fees'}
            {p === 'profile' && '👤 Profile'}
          </button>
        ))}
      </div>

      <div className="app-body">
        <div className="sidebar" id="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Main</div>
            {[
              ['dashboard', '🏠', 'Dashboard'],
              ['campus', '🗺️', 'Campus Map'],
              ['courses', '📚', 'My Courses'],
              ['timetable', '📅', 'Timetable'],
              ['results', '📊', 'Results', true],
              ['library', '📖', 'Library'],
            ].map(([id, icon, label, badge]) => (
              <button
                key={id}
                type="button"
                className={`sidebar-btn ${currentPage === id ? 'active' : ''}`}
                id={`sb-${id}`}
                onClick={() => navigate(id)}
              >
                <span className="sb-icon">{icon}</span> {label}
                {badge && <span className="sb-badge">New</span>}
              </button>
            ))}
          </div>
          <div className="sidebar-divider" />
          <div className="sidebar-section">
            <div className="sidebar-section-title">Campus</div>
            <button type="button" className={`sidebar-btn ${currentPage === 'fees' ? 'active' : ''}`} id="sb-fees" onClick={() => navigate('fees')}>
              <span className="sb-icon">💳</span> Fees & Payments
            </button>
            <button type="button" className={`sidebar-btn ${currentPage === 'profile' ? 'active' : ''}`} id="sb-profile" onClick={() => navigate('profile')}>
              <span className="sb-icon">👤</span> My Profile
            </button>
          </div>
        </div>

        <div className="main-content" id="mainContent" ref={mainRef}>
          <div className={`breadcrumb-bar ${currentPage === 'dashboard' ? 'is-dashboard' : ''}`} id="breadcrumbBar">
            <button type="button" className="bc-back" onClick={() => navigate('profile')} title="Go to My Profile">
              ← Back
            </button>
            <div className="breadcrumb-inner" id="breadcrumbInner">
              {breadcrumbTrail.length === 1 && currentPage === 'dashboard' ? (
                <span className="bc current">🏠 Home</span>
              ) : (
                <>
                  <span className="bc" onClick={() => navigate('dashboard')}>
                    🏠 Home
                  </span>
                  {breadcrumbTrail.map((p, i) => {
                    if (p === 'dashboard') return null;
                    const isLast = i === breadcrumbTrail.length - 1;
                    return (
                      <React.Fragment key={`${p}-${i}`}>
                        <span className="bc-arrow">›</span>
                        {isLast ? (
                          <span className="bc current">{PAGE_LABELS[p] || p}</span>
                        ) : (
                          <span className="bc" onClick={() => navigate(p)}>
                            {PAGE_LABELS[p] || p}
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          <div className="page-wrap">
            <div className={`page ${currentPage === 'dashboard' ? 'active' : ''}`} id="page-dashboard">
              <div className="page-hd page-hd-row">
                <div>
                  <h1>Good Morning, Ravi 👋</h1>
                  <p>Monday, 7 April 2025 &nbsp;·&nbsp; Semester 4 &nbsp;·&nbsp; B.Tech CSE</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <button type="button" className="btn-dash-map" onClick={() => navigate('campus')} title="Open campus map">
                    🗺️ Campus map
                  </button>
                  <button type="button" className="btn btn-gold" onClick={() => navigate('timetable')}>
                    📅 View Today's Classes
                  </button>
                </div>
              </div>
              <div className="grid-4">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-val">6</div>
                  <div className="stat-label">Active Courses</div>
                  <div className="stat-change up">↑ Sem 4</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-val">8.4</div>
                  <div className="stat-label">Current CGPA</div>
                  <div className="stat-change up">↑ 0.2 pts</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-val">82%</div>
                  <div className="stat-label">Attendance</div>
                  <div className="stat-change down">↓ Need 85%</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💳</div>
                  <div className="stat-val">₹12K</div>
                  <div className="stat-label">Fees Due</div>
                  <div className="stat-change down">↓ Apr 30</div>
                </div>
              </div>
              <div className="alert alert-warn">
                ⚠️{' '}
                <div>
                  <strong>Attendance Warning:</strong> Your attendance in Data Structures (CS401) is at 74%. Minimum required is 75%. Please attend upcoming classes.
                </div>
              </div>
              <div className="alert alert-info">
                📋{' '}
                <div>
                  <strong>Exam Schedule Released:</strong> End-semester exams begin May 12.{' '}
                  <span style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('results')}>
                    View schedule →
                  </span>
                </div>
              </div>
              <div className="grid-2">
                <div className="card">
                  <div className="section-title">Today's Schedule</div>
                  {today.map((c, i) => {
                    const course = COURSES.find((x) => x.code === c);
                    return (
                      <div
                        key={c}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '8px 0',
                          borderBottom: '1px solid var(--border)',
                          fontSize: '0.83rem',
                        }}
                      >
                        <div style={{ width: 52, color: 'var(--mist)', fontWeight: 600, flexShrink: 0 }}>{times[i]}</div>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: course.border, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{course.name}</div>
                          <div style={{ color: 'var(--mist)', fontSize: '0.76rem' }}>{course.faculty}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="card">
                  <div className="section-title">Recent Activity</div>
                  {notifications.slice(0, 4).map((n, idx) => (
                    <div
                      key={idx}
                      style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                      onClick={toggleNotif}
                    >
                      <div style={{ fontSize: '0.83rem', fontWeight: n.unread ? 600 : 500, marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="section-title">Quick Access</div>
              <div className="grid-4">
                <div className="card-sm" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate('courses')}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>📚</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Courses</div>
                </div>
                <div className="card-sm" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate('results')}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>📊</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Results</div>
                </div>
                <div className="card-sm" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate('campus')}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>🗺️</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Campus Map</div>
                </div>
                <div className="card-sm" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate('fees')}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>💳</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Pay Fees</div>
                </div>
              </div>
            </div>

            <div className={`page ${currentPage === 'courses' ? 'active' : ''}`} id="page-courses">
              <div className="page-hd page-hd-row">
                <div>
                  <h1>My Courses</h1>
                  <p>Semester 4 — 6 enrolled subjects</p>
                </div>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate('timetable')}>
                  📅 View Timetable
                </button>
              </div>
              <div className="tabs" id="courseTabs">
                <button type="button" className="tab active" onClick={(e) => switchTab('course-all', e)}>All Courses</button>
                <button type="button" className="tab" onClick={(e) => switchTab('course-theory', e)}>Theory</button>
                <button type="button" className="tab" onClick={(e) => switchTab('course-lab', e)}>Lab</button>
                <button type="button" className="tab" onClick={(e) => switchTab('course-elective', e)}>Electives</button>
              </div>
              <CoursePanels toast={toast} />
            </div>

            <div className={`page ${currentPage === 'timetable' ? 'active' : ''}`} id="page-timetable">
              <div className="page-hd page-hd-row">
                <div>
                  <h1>Weekly Timetable</h1>
                  <p>Semester 4 — Academic Year 2024–25</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => toast('🖨️ Print feature coming soon')}>
                    🖨️ Print
                  </button>
                  <button type="button" className="btn btn-gold btn-sm" onClick={() => toast('📥 Downloaded!')}>
                    📥 Download
                  </button>
                </div>
              </div>
              <div className="card" style={{ overflowX: 'auto' }}>
                <TimetableGrid toast={toast} />
              </div>
              <div className="divider" />
              <div className="grid-3">
                <div className="card-sm">
                  <div className="section-title">Legend</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: '#EEF4FF', borderLeft: '3px solid #2D5BE3' }} /> CS401 — Data Structures
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: '#E8F5EC', borderLeft: '3px solid #1E8449' }} /> MA401 — Mathematics IV
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: '#FEF6E7', borderLeft: '3px solid #C9952A' }} /> PH401 — Applied Physics
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: '#FDF0F0', borderLeft: '3px solid #C0392B' }} /> EN401 — Technical Writing
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: '#F0F4FF', borderLeft: '3px solid #5B3FD4' }} /> CS402 — Lab Sessions
                    </div>
                  </div>
                </div>
                <div className="card-sm">
                  <div className="section-title">Class Timings</div>
                  <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--slate)' }}>
                    <div>Period 1: <strong>9:00 – 10:00 AM</strong></div>
                    <div>Period 2: <strong>10:00 – 11:00 AM</strong></div>
                    <div>Period 3: <strong>11:15 – 12:15 PM</strong></div>
                    <div>Lunch: <strong>12:15 – 1:00 PM</strong></div>
                    <div>Period 4: <strong>1:00 – 2:00 PM</strong></div>
                    <div>Period 5: <strong>2:00 – 3:00 PM</strong></div>
                  </div>
                </div>
                <div className="card-sm">
                  <div className="section-title">Next Class</div>
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 6 }}>📐</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>MA401 — Math IV</div>
                    <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginTop: 4 }}>Period 3 · Room 204 · Dr. Sharma</div>
                    <div style={{ marginTop: 12 }}>
                      <span className="chip chip-gold">Starts in 48 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`page ${currentPage === 'results' ? 'active' : ''}`} id="page-results">
              <div className="page-hd page-hd-row">
                <div>
                  <h1>Results & Grades</h1>
                  <p>Academic performance overview</p>
                </div>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => toast('📥 Downloading marksheet...')}>
                  📥 Download Marksheet
                </button>
              </div>
              <div className="tabs" id="resultTabs">
                <button type="button" className="tab active" onClick={(e) => switchTab('res-sem4', e)}>Semester 4</button>
                <button type="button" className="tab" onClick={(e) => switchTab('res-sem3', e)}>Semester 3</button>
                <button type="button" className="tab" onClick={(e) => switchTab('res-sem2', e)}>Semester 2</button>
                <button type="button" className="tab" onClick={(e) => switchTab('res-cgpa', e)}>CGPA Trend</button>
              </div>
              <ResultsPanels toast={toast} />
            </div>

            <div className={`page ${currentPage === 'library' ? 'active' : ''}`} id="page-library">
              <div className="page-hd page-hd-row">
                <div>
                  <h1>Library</h1>
                  <p>Browse, borrow and renew books</p>
                </div>
                <button type="button" className="btn btn-gold btn-sm" onClick={() => navigate('library')}>
                  🔍 Search Catalogue
                </button>
              </div>
              <div className="tabs" id="libTabs">
                <button type="button" className="tab active" onClick={(e) => switchTab('lib-issued', e)}>Issued Books</button>
                <button type="button" className="tab" onClick={(e) => switchTab('lib-history', e)}>History</button>
                <button type="button" className="tab" onClick={(e) => switchTab('lib-reserved', e)}>Reserved</button>
              </div>
              <LibraryPanels toast={toast} />
            </div>

            <div className={`page ${currentPage === 'campus' ? 'active' : ''}`} id="page-campus">
              <div className="page-hd page-hd-row">
                <div>
                  <h1>Campus Map</h1>
                  <p>Explore SVIT campus buildings and facilities</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    style={{
                      background: 'var(--white)',
                      border: '1.5px solid var(--border2)',
                      borderRadius: 8,
                      padding: '7px 12px',
                      fontFamily: 'Manrope,sans-serif',
                      fontSize: '0.82rem',
                      color: 'var(--ink)',
                      outline: 'none',
                    }}
                    value={jumpSelect}
                    onChange={(e) => {
                      const v = e.target.value;
                      setJumpSelect(v);
                      highlightBuilding(v);
                    }}
                  >
                    <option value="">Jump to building...</option>
                    <option value="main">Main Block</option>
                    <option value="cs">CS Department</option>
                    <option value="lib">Library</option>
                    <option value="aud">Auditorium</option>
                    <option value="workshop">Workshop / ME Lab</option>
                    <option value="health">Health Center</option>
                    <option value="hostel">Hostel</option>
                    <option value="canteen">Canteen</option>
                    <option value="ground">Sports Ground</option>
                    <option value="parking">Visitor Parking</option>
                    <option value="bus">Bus Bay</option>
                    <option value="atm">ATM & Services</option>
                  </select>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--mist)', margin: '0 0 12px', lineHeight: 1.45 }}>
                The <strong style={{ color: 'var(--slate)' }}>white / pale green dashed lines</strong> are the paved walking network (straight L-turns from the gate). The{' '}
                <strong style={{ color: 'var(--gold)' }}>gold</strong> line is what this app draws—compare the two.
              </p>
              <div className="map-wrap">
                <div className="map-search-bar">
                  <input
                    className="map-search-input"
                    type="text"
                    placeholder="Find a building..."
                    value={mapSearch}
                    onChange={(e) => setMapSearch(e.target.value)}
                  />
                  <button type="button" className="map-search-btn" onClick={findBuilding}>
                    Find
                  </button>
                </div>
                <div className="map-svg-container">
                  <CampusMap
                    mapScale={mapScale}
                    routeD={routeD}
                    selectedBuildingId={selectedMapBuildingId}
                    onBuildingClick={(id) => {
                      highlightBuilding(id);
                    }}
                  />
                </div>
                <div className="map-controls-bar">
                  <div className="mc" onClick={() => mapZoom(1.15)} title="Zoom in">
                    ＋
                  </div>
                  <div className="mc" onClick={() => mapZoom(0.87)} title="Zoom out">
                    －
                  </div>
                  <div className="mc" onClick={() => toast('📍 Centered on your location')} title="My location">
                    📍
                  </div>
                </div>
                <div className="map-legend">
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: '#3A5A8C' }} /> Admin / Main
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: '#1A5C4A' }} /> Academic
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: '#6B3A8C' }} /> Library
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: '#8C5A1A' }} /> Canteen
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: '#8C2A2A' }} /> Hostel
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: '#4A6B9C' }} /> Auditorium
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: '#3A3A4A' }} /> Parking
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: '#4A4A5E' }} /> Transit
                  </div>
                  <div className="legend-item" style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--border)' }}>
                    <span style={{ display: 'inline-block', width: 22, height: 3, background: 'rgba(255,255,255,0.45)', borderRadius: 2, verticalAlign: 'middle' }} /> Shortest paved links
                  </div>
                  <div className="legend-item">
                    <span style={{ display: 'inline-block', width: 22, height: 3, background: 'linear-gradient(90deg,#FFD54A,#F2B93B)', borderRadius: 2, verticalAlign: 'middle' }} /> In-app route (may detour)
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 20 }}>{buildingPanel}</div>
            </div>

            <div className={`page ${currentPage === 'fees' ? 'active' : ''}`} id="page-fees">
              <div className="page-hd">
                <h1>Fees & Payments</h1>
                <p>Manage your fee payments and dues</p>
              </div>
              <div className="alert alert-danger">
                ⚠️ Semester 4 fees of <strong>₹12,000</strong> are due by April 30, 2025. Late fine: ₹500/day after due date.
              </div>
              <div className="grid-2">
                <div className="card">
                  <div className="section-title">Fee Breakdown</div>
                  {FEE_ITEMS.map((f) => (
                    <div
                      key={f.label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.86rem',
                        padding: '8px 0',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <span style={{ color: 'var(--mist)' }}>{f.label}</span>
                      <span style={{ fontWeight: 600 }}>₹{f.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="divider" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem' }}>
                    <span>Total Due</span>
                    <span id="feeTotalDue">₹12,000</span>
                  </div>
                </div>
                <div className="card">
                  <div className="section-title">Pay Now</div>
                  <div className="form-row">
                    <div className="form-group full">
                      <label>Payment Amount</label>
                      <input
                        type="number"
                        id="payAmt"
                        value={payAmt}
                        onChange={(e) => setPayAmt(Number(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group full">
                      <label>Payment Method</label>
                      <select id="payMethod" value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                        <option>UPI (GPay / PhonePe)</option>
                        <option>Net Banking</option>
                        <option>Credit / Debit Card</option>
                        <option>DD / Challan</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ background: 'var(--snow)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 6 }}>
                      <span style={{ color: 'var(--mist)' }}>Amount</span>
                      <span id="payAmtDisplay">₹{payAmt.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 6 }}>
                      <span style={{ color: 'var(--mist)' }}>Gateway fee (2%)</span>
                      <span id="gatewayFee">₹{gw.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>Total</span>
                      <span id="payTotal">₹{payTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <button type="button" className="btn btn-gold" style={{ width: '100%' }} onClick={payFees}>
                    💳 Pay Now
                  </button>
                </div>
              </div>
              <div className="section-title" style={{ marginTop: 8 }}>
                Payment History
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody id="payHistoryTable">
                    {PAY_HISTORY.map((p) => (
                      <tr key={p.date + p.desc}>
                        <td>{p.date}</td>
                        <td>{p.desc}</td>
                        <td>
                          <strong>{p.amount}</strong>
                        </td>
                        <td>{p.method}</td>
                        <td>
                          <span className="chip chip-green">✅ {p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`page ${currentPage === 'profile' ? 'active' : ''}`} id="page-profile">
              <div className="page-hd">
                <h1>My Profile</h1>
                <p>Manage your personal and academic information</p>
              </div>
              <div className="tabs" id="profileTabs">
                <button type="button" className="tab active" onClick={(e) => switchTab('pro-personal', e)}>
                  Personal Info
                </button>
                <button type="button" className="tab" onClick={(e) => switchTab('pro-academic', e)}>
                  Academic
                </button>
                <button type="button" className="tab" onClick={(e) => switchTab('pro-docs', e)}>
                  Documents
                </button>
              </div>
              <div className="tab-panel active" id="pro-personal">
                <div className="grid-2">
                  <div className="card">
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 16,
                          background: 'linear-gradient(135deg,var(--gold),var(--teal))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          fontWeight: 800,
                          color: 'var(--white)',
                          margin: '0 auto 12px',
                        }}
                      >
                        RK
                      </div>
                      <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.3rem' }} id="profDisplayName">
                        Ravi Kumar
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginTop: 4 }}>2CS21CS065 · B.Tech CSE · Sem 4</div>
                    </div>
                    <button type="button" className="btn btn-outline" style={{ width: '100%' }} onClick={() => toast('📷 Photo upload coming soon')}>
                      📷 Change Photo
                    </button>
                  </div>
                  <div className="card">
                    <div className="form-row">
                      <div className="form-group">
                        <label>First Name</label>
                        <input type="text" id="profFirst" defaultValue="Ravi" />
                      </div>
                      <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" id="profLast" defaultValue="Kumar" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email</label>
                        <input type="email" id="profEmail" defaultValue="ravi.kumar@svit.edu.in" />
                      </div>
                      <div className="form-group">
                        <label>Mobile</label>
                        <input type="tel" id="profMobile" defaultValue="+91 98765 43210" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group full">
                        <label>Address</label>
                        <textarea id="profAddr" defaultValue="123, 4th Main, Bengaluru – 560001" />
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={saveProfile}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
              <div className="tab-panel" id="pro-academic">
                <div className="card">
                  <div className="grid-3" style={{ marginBottom: 0 }}>
                    <div>
                      <div className="section-title">Program</div>
                      <div style={{ fontWeight: 700 }}>B.Tech Computer Science</div>
                    </div>
                    <div>
                      <div className="section-title">USN</div>
                      <div style={{ fontWeight: 700 }}>2CS21CS065</div>
                    </div>
                    <div>
                      <div className="section-title">Batch</div>
                      <div style={{ fontWeight: 700 }}>2021 – 2025</div>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <div className="section-title">Current CGPA</div>
                      <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.6rem' }}>8.4</div>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <div className="section-title">Semester</div>
                      <div style={{ fontWeight: 700 }}>4 (2024–25)</div>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <div className="section-title">Advisor</div>
                      <div style={{ fontWeight: 700 }}>Dr. Meena Rao</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-panel" id="pro-docs">
                <div className="grid-3">
                  <div className="card-sm" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => toast('📥 Downloading ID card...')}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>🪪</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>College ID Card</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: 4 }}>PDF • 120 KB</div>
                  </div>
                  <div className="card-sm" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => toast('📥 Downloading bonafide...')}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>📜</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Bonafide Certificate</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: 4 }}>PDF • 85 KB</div>
                  </div>
                  <div className="card-sm" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('results')}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>📊</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Marksheets</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: 4 }}>Sem 1–4</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`notif-panel ${notifOpen ? 'open' : ''}`} id="notifPanel">
        <div className="notif-hd">
          <h3>Notifications</h3>
          <button type="button" className="btn btn-outline btn-sm" onClick={markAllRead}>
            Mark all read
          </button>
        </div>
        <div className="notif-list" id="notifList">
          {notifications.map((n, i) => (
            <div key={i} className={`notif-item ${n.unread ? 'unread' : ''}`} onClick={() => markRead(i)}>
              <div className="ni-title">{n.title}</div>
              <div className="ni-body">{n.body}</div>
              <div className="ni-time">{n.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`modal-bg ${modal.open ? 'open' : ''}`} id="modalBg">
        <div className="modal">
          <h3 id="modalTitle">{modal.title}</h3>
          <p id="modalBody">{modal.body}</p>
          <div className="modal-btns">
            <button type="button" className="btn btn-outline" onClick={closeModal}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" id="modalOk" onClick={onModalOk}>
              {modal.type === 'logout' ? 'Log Out' : 'OK'}
            </button>
          </div>
        </div>
      </div>

      <div className="toast-stack" id="toastStack">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}

function CoursePanels({ toast }) {
  const renderGrid = (items) => (
    <div className="grid-3" style={{ marginBottom: 0 }}>
      {items.map((c) => (
        <div
          key={c.code}
          className="card-sm"
          style={{ borderLeft: `4px solid ${c.border}`, cursor: 'pointer' }}
          onClick={() => toast(`📚 Opening ${c.code}...`)}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 6 }}>
            {c.code} · {c.credits} Credits
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, lineHeight: 1.35 }}>{c.name}</div>
          <div style={{ fontSize: '0.76rem', color: 'var(--mist)', marginBottom: 12 }}>{c.faculty}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 600, color: c.attendance < 75 ? 'var(--red)' : 'var(--green)' }}>{c.attendance}% attendance</span>
            <span className={`chip ${c.type === 'lab' ? 'chip-blue' : c.type === 'elective' ? 'chip-mist' : 'chip-green'}`}>{c.type}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${c.attendance}%`,
                background: c.attendance < 75 ? 'var(--red)' : c.attendance > 90 ? 'var(--green)' : 'var(--gold)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="tab-panel active" id="course-all">
        {renderGrid(COURSES)}
      </div>
      <div className="tab-panel" id="course-theory">
        {renderGrid(COURSES.filter((c) => c.type === 'theory'))}
      </div>
      <div className="tab-panel" id="course-lab">
        {renderGrid(COURSES.filter((c) => c.type === 'lab'))}
      </div>
      <div className="tab-panel" id="course-elective">
        {renderGrid(COURSES.filter((c) => c.type === 'elective'))}
      </div>
    </>
  );
}

function TimetableGrid({ toast }) {
  const days = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  let html = [];
  html = days.map((d) => (
    <div key={d} className="tt-header">
      {d}
    </div>
  ));
  const cells = [];
  TIMETABLE_DATA.forEach((row) => {
    cells.push(
      <div key={row[0]} className="tt-time">
        {row[0]}
      </div>
    );
    for (let i = 1; i <= 5; i++) {
      const code = row[i];
      const cls = CLASS_STYLES[code] || '';
      const sub = COURSES.find((c) => c.code === code)?.name.split(' ').slice(0, 2).join(' ') || '';
      cells.push(
        <div
          key={`${row[0]}-${i}`}
          className={`tt-class ${cls}`}
          onClick={() => toast(`📚 ${code} — Click for details`)}
          role="button"
        >
          <div>{code}</div>
          <div className="tt-sub">{sub}</div>
        </div>
      );
    }
  });
  return <div className="timetable">{html}{cells}</div>;
}

function ResultsPanels({ toast }) {
  return (
    <>
      <div className="tab-panel active" id="res-sem4">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Code</th>
                <th>Internals (30)</th>
                <th>Mid-Sem (50)</th>
                <th>End-Sem (100)</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {RESULTS.map((r) => (
                <tr key={r.code} onClick={() => toast(`📊 ${r.sub} details`)}>
                  <td>
                    <strong>{r.sub}</strong>
                  </td>
                  <td>
                    <span className="chip chip-mist">{r.code}</span>
                  </td>
                  <td>{r.int}/30</td>
                  <td>{r.mid}/50</td>
                  <td>{r.end !== null ? `${r.end}/100` : <span style={{ color: 'var(--mist)' }}>Pending</span>}</td>
                  <td>{r.total !== null ? r.total : '--'}</td>
                  <td>
                    <strong>{r.grade}</strong>
                  </td>
                  <td>
                    <span className={`chip ${r.status === 'ongoing' ? 'chip-gold' : 'chip-green'}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="tab-panel" id="res-sem3">
        <div className="alert alert-info">
          📊 Semester 3 results: SGPA 8.2 — All subjects cleared.{' '}
          <button type="button" className="btn btn-outline btn-sm" style={{ marginLeft: 10 }} onClick={() => toast('Downloading Sem 3 marksheet...')}>
            Download
          </button>
        </div>
      </div>
      <div className="tab-panel" id="res-sem2">
        <div className="alert alert-info">📊 Semester 2 results: SGPA 7.9 — All subjects cleared.</div>
      </div>
      <div className="tab-panel" id="res-cgpa">
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div className="section-title">CGPA Progression</div>
          <svg viewBox="0 0 500 200" style={{ width: '100%', maxWidth: 500, margin: '0 auto', display: 'block' }}>
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9952A" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#C9952A" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline points="50,150 150,130 250,110 350,90 450,80" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="50,150 150,130 250,110 350,90 450,80 450,180 50,180" fill="url(#cg)" />
            <circle cx="50" cy="150" r="5" fill="var(--gold)" />
            <text x="50" y="168" textAnchor="middle" fontSize="10" fill="var(--mist)" fontFamily="Manrope">Sem1</text>
            <text x="50" y="142" textAnchor="middle" fontSize="9" fill="var(--ink)" fontFamily="Manrope" fontWeight="700">7.4</text>
            <circle cx="150" cy="130" r="5" fill="var(--gold)" />
            <text x="150" y="168" textAnchor="middle" fontSize="10" fill="var(--mist)" fontFamily="Manrope">Sem2</text>
            <text x="150" y="122" textAnchor="middle" fontSize="9" fill="var(--ink)" fontFamily="Manrope" fontWeight="700">7.9</text>
            <circle cx="250" cy="110" r="5" fill="var(--gold)" />
            <text x="250" y="168" textAnchor="middle" fontSize="10" fill="var(--mist)" fontFamily="Manrope">Sem3</text>
            <text x="250" y="102" textAnchor="middle" fontSize="9" fill="var(--ink)" fontFamily="Manrope" fontWeight="700">8.2</text>
            <circle cx="350" cy="90" r="5" fill="var(--gold)" />
            <text x="350" y="168" textAnchor="middle" fontSize="10" fill="var(--mist)" fontFamily="Manrope">Sem4</text>
            <text x="350" y="82" textAnchor="middle" fontSize="9" fill="var(--ink)" fontFamily="Manrope" fontWeight="700">8.4</text>
            <circle cx="450" cy="80" r="5" fill="var(--teal)" />
            <text x="450" y="168" textAnchor="middle" fontSize="10" fill="var(--mist)" fontFamily="Manrope">Cum.</text>
            <text x="450" y="72" textAnchor="middle" fontSize="9" fill="var(--teal)" fontFamily="Manrope" fontWeight="700">8.4</text>
          </svg>
        </div>
      </div>
    </>
  );
}

function LibraryPanels({ toast }) {
  return (
    <>
      <div className="tab-panel active" id="lib-issued">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ISSUED_BOOKS.map((b) => (
                <tr key={b.title}>
                  <td>
                    <strong>{b.title}</strong>
                  </td>
                  <td>{b.author}</td>
                  <td>{b.issued}</td>
                  <td>{b.due}</td>
                  <td>
                    <span className={`chip ${b.status === 'ok' ? 'chip-green' : b.status === 'due' ? 'chip-gold' : 'chip-red'}`}>
                      {b.status === 'ok' ? 'On time' : b.status === 'due' ? 'Due soon' : 'Overdue'}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => toast(`📚 Renewed: ${b.title}`)}>
                      Renew
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="tab-panel" id="lib-history">
        <div className="alert alert-success">✅ You have returned 14 books successfully this year.</div>
      </div>
      <div className="tab-panel" id="lib-reserved">
        <div className="empty-state">
          <div className="big">📚</div>
          <p>No books reserved currently.</p>
          <button type="button" className="btn btn-gold" style={{ marginTop: 12 }} onClick={() => toast('Opening book catalogue...')}>
            Browse Catalogue
          </button>
        </div>
      </div>
    </>
  );
}

