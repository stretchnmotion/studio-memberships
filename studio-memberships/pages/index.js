import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Papa from 'papaparse';

const PACKAGES = [
  { name: 'Intro session', price: 58, sessions: 1, type: 'Stretch therapy', notes: '25-min session, first visit' },
  { name: 'Walk-in', price: 95, sessions: 1, type: 'Stretch therapy', notes: '25-min single session' },
  { name: '4x/month', price: 170, sessions: 4, type: 'Stretch therapy', notes: '25-min sessions' },
  { name: '4x/month — First Responder', price: 153, sessions: 4, type: 'Stretch therapy', notes: '25-min sessions, first responder rate' },
  { name: '8x/month', price: 320, sessions: 8, type: 'Stretch therapy', notes: '25-min sessions' },
  { name: '8x/month — First Responder', price: 288, sessions: 8, type: 'Stretch therapy', notes: '25-min sessions, first responder rate' },
  { name: '16x/month', price: 520, sessions: 16, type: 'Stretch therapy', notes: '25-min sessions' },
];

function ini(m) { return ((m.firstName||'?')[0] + (m.lastName||'?')[0]).toUpperCase(); }
function fullName(m) { return `${m.firstName} ${m.lastName}`; }

function StatusBadge({ status }) {
  const map = {
    active: { bg: '#E1F5EE', color: '#0F6E56', label: 'Active' },
    declined: { bg: '#FCEBEB', color: '#A32D2D', label: 'Declined' },
    expiring: { bg: '#FAEEDA', color: '#854F0B', label: 'Expiring' },
    paused: { bg: '#F1EFE8', color: '#5F5E5A', label: 'Paused' },
  };
  const s = map[status] || map.active;
  return <span style={{ background: s.bg, color: s.color, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500 }}>{s.label}</span>;
}

function FlagPill({ reason }) {
  const map = {
    card: { bg: '#FCEBEB', color: '#A32D2D', label: 'Card declined' },
    expiring: { bg: '#FAEEDA', color: '#854F0B', label: 'Expiring' },
    inactive: { bg: '#E6F1FB', color: '#185FA5', label: 'Inactive' },
    manual: { bg: '#EEEDFE', color: '#534AB7', label: 'Manual' },
  };
  const p = map[reason] || map.manual;
  return <span style={{ background: p.bg, color: p.color, padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 500 }}>{p.label}</span>;
}

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('studio_auth') === 'true') {
      setAuthed(true);
    }
  }, []);

  async function handleLogin() {
    setPwLoading(true);
    setPwError('');
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwInput }) });
    if (res.ok) {
      sessionStorage.setItem('studio_auth', 'true');
      setAuthed(true);
    } else {
      setPwError('Incorrect password. Try again.');
    }
    setPwLoading(false);
  }

  if (!authed) {
    return (
      <>
        <Head>
          <title>Stretch N Motion — Staff Login</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.8.0/dist/tabler-icons.min.css" />
        </Head>
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1B8DB3', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', width: 340, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              <div style={{ background: '#1B8DB3', borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'inline-block' }}>
                <div style={{ fontSize: 18, fontWeight: 900, fontStyle: 'italic', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: 1.1 }}>STRETCH N<br/>MOTION</div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.8)', marginTop: 3, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 }}>MOBILITY STUDIO · MEMBERS</div>
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>Staff access only</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Password</label>
              <input
                type="password"
                style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#1a1a1a', background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: '8px 10px', width: '100%', outline: 'none', boxSizing: 'border-box' }}
                value={pwInput}
                onChange={e => setPwInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Enter staff password"
                autoFocus
              />
            </div>
            {pwError && <div style={{ fontSize: 12, color: '#A32D2D', marginBottom: 10 }}>{pwError}</div>}
            <button
              onClick={handleLogin}
              disabled={pwLoading}
              style={{ width: '100%', padding: '9px', borderRadius: 8, border: 'none', background: '#1B8DB3', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'system-ui, sans-serif' }}
            >
              {pwLoading ? 'Checking…' : 'Log in'}
            </button>
          </div>
        </div>
      </>
    );
  }

  return <Dashboard />;
}

function Dashboard() {
  const [page, setPage] = useState('dashboard');
  const [members, setMembers] = useState([]);
  const [flags, setFlags] = useState([]);
  const [packages, setPackages] = useState(PACKAGES);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const [detailMember, setDetailMember] = useState(null);
  const [detailBack, setDetailBack] = useState('members');
  const [flagTab, setFlagTab] = useState('open');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [flagForm, setFlagForm] = useState({ memberId: '', reason: 'card', note: '' });
  const [pkgForm, setPkgForm] = useState({ name: '', price: '', sessions: '', type: 'Stretch therapy', notes: '' });
  const [newMember, setNewMember] = useState({ firstName: '', lastName: '', email: '', phone: '', pkg: '', start: '', card: '', notes: '' });
  const [nmSuccess, setNmSuccess] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const fileRef = useRef();
  const searchRef = useRef();

  useEffect(() => {
    fetchAll();
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  function handleOutsideClick(e) {
    if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchDrop(false);
  }

  async function fetchAll() {
    setLoading(true);
    try {
      const [mr, fr] = await Promise.all([fetch('/api/members'), fetch('/api/flags')]);
      const [md, fd] = await Promise.all([mr.json(), fr.json()]);
      setMembers(Array.isArray(md) ? md : []);
      setFlags(Array.isArray(fd) ? fd : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function openFlags() { return flags.filter(f => !f.resolved); }

  function memberFlags(id) {
    const sid = String(id);
    return flags.filter(f => !f.resolved && String(f.memberId) === sid);
  }

  function nav(p) {
    setPage(p);
    setSearch('');
    setShowSearchDrop(false);
    setShowFlagModal(false);
    setShowPkgModal(false);
  }

  function viewMember(m, back) {
    setDetailMember(m);
    setDetailBack(back || page);
    setPage('detail');
  }

  function handleSearch(val) {
    setSearch(val);
    if (!val.trim()) { setShowSearchDrop(false); return; }
    const q = val.toLowerCase();
    const res = members.filter(m => (fullName(m) + m.email + m.pkg + m.phone).toLowerCase().includes(q)).slice(0, 6);
    setSearchResults(res);
    setShowSearchDrop(res.length > 0);
  }

  async function addMember() {
    if (!newMember.firstName || !newMember.lastName || !newMember.email) { alert('Name and email are required.'); return; }
    const res = await fetch('/api/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newMember, credits: 0, status: 'active', createdAt: new Date() }) });
    const doc = await res.json();
    setMembers(prev => [...prev, doc]);
    setNewMember({ firstName: '', lastName: '', email: '', phone: '', pkg: '', start: '', card: '', notes: '' });
    setNmSuccess(true);
    setTimeout(() => setNmSuccess(false), 3000);
  }

  async function updateMemberStatus(m, status) {
    await fetch('/api/members', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...m, status }) });
    setMembers(prev => prev.map(x => String(x._id) === String(m._id) ? { ...x, status } : x));
    setDetailMember(prev => prev && String(prev._id) === String(m._id) ? { ...prev, status } : prev);
  }

  async function removeMember(m) {
    if (!confirm(`Remove ${fullName(m)}? This cannot be undone.`)) return;
    await fetch(`/api/members?id=${m._id}`, { method: 'DELETE' });
    setMembers(prev => prev.filter(x => String(x._id) !== String(m._id)));
    setFlags(prev => prev.filter(f => String(f.memberId) !== String(m._id)));
    nav('members');
  }

  async function addFlag() {
    if (!flagForm.memberId) { alert('Select a member.'); return; }
    const res = await fetch('/api/flags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...flagForm, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }) });
    const doc = await res.json();
    setFlags(prev => [doc, ...prev]);
    setShowFlagModal(false);
    setFlagForm({ memberId: '', reason: 'card', note: '' });
  }

  async function resolveFlag(f) {
    await fetch('/api/flags', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, resolved: true }) });
    setFlags(prev => prev.map(x => String(x._id) === String(f._id) ? { ...x, resolved: true } : x));
  }

  function addPackage() {
    if (!pkgForm.name) { alert('Package name required.'); return; }
    setPackages(prev => [...prev, { ...pkgForm, price: parseInt(pkgForm.price) || 0, sessions: parseInt(pkgForm.sessions) || null }]);
    setShowPkgModal(false);
    setPkgForm({ name: '', price: '', sessions: '', type: 'Stretch therapy', notes: '' });
  }

  function handleCSV(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportMsg('');
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await fetch('/api/members/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ members: results.data }) });
          const data = await res.json();
          setImportMsg(`✓ Imported ${data.inserted} members successfully.`);
          fetchAll();
        } catch (err) {
          setImportMsg('Import failed. Check your CSV format.');
        }
        setImporting(false);
      }
    });
  }

  const activeCount = members.filter(m => m.status === 'active').length;
  const openFlagCount = openFlags().length;
  const expiringCount = members.filter(m => m.status === 'expiring').length;
  const revenue = members.filter(m => m.status === 'active' || m.status === 'expiring').reduce((a, m) => {
    const pkg = packages.find(p => p.name === m.pkg);
    return a + (pkg ? pkg.price : 0);
  }, 0);

  const S = styles;

  return (
    <>
      <Head>
        <title>Stretch N Motion Members</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.8.0/dist/tabler-icons.min.css" />
      </Head>
      <div style={S.app}>
        {/* ── Sidebar ── */}
        <div style={S.sidebar}>
          <div style={S.logo}>
            <div style={{ background: '#fff', borderRadius: 5, padding: '8px 12px', border: '2px solid rgba(255,255,255,0.25)' }}>
              <div style={S.logoName}>STRETCH N<br/>MOTION</div>
              <div style={S.logoSub}>MOBILITY STUDIO · MEMBERS</div>
            </div>
          </div>

          <div style={{ padding: '8px 10px', borderBottom: '0.5px solid #e5e5e5', position: 'relative' }} ref={searchRef}>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-search" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#999' }} />
              <input value={search} onChange={e => handleSearch(e.target.value)} onFocus={() => search && setShowSearchDrop(searchResults.length > 0)} placeholder="Search all members…" style={{ ...S.input, paddingLeft: 28, fontSize: 12, background: '#f5f5f5', border: '0.5px solid #e0e0e0' }} />
            </div>
            {showSearchDrop && (
              <div style={S.searchDrop}>
                {searchResults.map(m => (
                  <div key={String(m._id)} style={S.searchItem} onClick={() => { viewMember(m, 'members'); setShowSearchDrop(false); setSearch(''); }}>
                    <div style={{ ...S.avatar, width: 24, height: 24, fontSize: 9, flexShrink: 0 }}>{ini(m)}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{fullName(m)} {memberFlags(m._id).length > 0 && <i className="ti ti-flag" style={{ fontSize: 10, color: '#E24B4A' }} />}</div>
                      <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{m.pkg}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', paddingTop: 6 }}>
            {[
              { id: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
              { id: 'members', icon: 'ti-users', label: 'Members' },
              { id: 'flags', icon: 'ti-flag', label: 'Flags', badge: openFlagCount },
              { id: 'packages', icon: 'ti-package', label: 'Packages' },
            ].map(item => (
              <div key={item.id} style={{ ...S.navItem, ...(page === item.id || (page === 'detail' && detailBack === item.id) ? S.navItemActive : {}) }} onClick={() => nav(item.id)}>
                <i className={`ti ${item.icon}`} style={{ fontSize: 15 }} />
                <span>{item.label}</span>
                {item.badge > 0 && <span style={S.navBadge}>{item.badge}</span>}
              </div>
            ))}
            <div style={S.navSection}>Actions</div>
            <div style={{ ...S.navItem, ...(page === 'addmember' ? S.navItemActive : {}) }} onClick={() => nav('addmember')}>
              <i className="ti ti-user-plus" style={{ fontSize: 15 }} /><span>Add member</span>
            </div>
            <div style={{ ...S.navItem }} onClick={() => fileRef.current.click()}>
              <i className="ti ti-upload" style={{ fontSize: 15 }} /><span>Import CSV</span>
              <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCSV} />
            </div>
            {importMsg && <div style={{ fontSize: 11, color: '#1B8DB3', padding: '4px 18px 8px', lineHeight: 1.4 }}>{importMsg}</div>}
          </div>

          <div style={S.sidebarFooter}>
            <div style={{ fontSize: 10, color: '#aaa' }}>Logged in as</div>
            <div style={{ fontSize: 12, fontWeight: 500, marginTop: 2 }}>Staff admin</div>
          </div>
        </div>

        {/* ── Main ── */}
        <div style={S.main}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', fontSize: 14 }}>
              <i className="ti ti-loader" style={{ fontSize: 20, marginRight: 8 }} /> Loading…
            </div>
          ) : (
            <>
              {/* Dashboard */}
              {page === 'dashboard' && (
                <div>
                  <div style={S.pageHeader}>
                    <div style={S.pageTitle}>Dashboard</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  <div style={S.metrics}>
                    {[
                      { label: 'Active members', value: activeCount, sub: 'Current', color: null },
                      { label: 'Open flags', value: openFlagCount, sub: 'Need follow-up', color: openFlagCount > 0 ? '#E24B4A' : null },
                      { label: 'Expiring soon', value: expiringCount, sub: 'Within 14 days', color: expiringCount > 0 ? '#EF9F27' : null },
                      { label: 'Revenue / mo', value: `$${revenue.toLocaleString()}`, sub: 'Active members', color: null },
                    ].map((m, i) => (
                      <div key={i} style={S.metric}>
                        <div style={S.metricLabel}>{m.label}</div>
                        <div style={{ ...S.metricValue, ...(m.color ? { color: m.color } : {}) }}>{m.value}</div>
                        <div style={S.metricSub}>{m.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={S.card}>
                    <div style={S.cardTitle}><i className="ti ti-flag" style={{ fontSize: 13, color: '#E24B4A', marginRight: 6 }} />Open flags</div>
                    {openFlags().length === 0 ? (
                      <div style={S.empty}>No open flags — all clear 🎉</div>
                    ) : openFlags().slice(0, 5).map(f => {
                      const m = members.find(x => String(x._id) === String(f.memberId));
                      if (!m) return null;
                      return (
                        <div key={String(f._id)} style={S.flagRow}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={S.avatar}>{ini(m)}</div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 13, fontWeight: 500 }}>{fullName(m)}</span>
                                <FlagPill reason={f.reason} />
                              </div>
                              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{f.note || 'No note'} · {f.date}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button style={S.btnSm} onClick={() => viewMember(m, 'dashboard')}>View</button>
                            <button style={{ ...S.btnSm, color: '#1D9E75', borderColor: '#9FE1CB' }} onClick={() => resolveFlag(f)}>Resolve</button>
                          </div>
                        </div>
                      );
                    })}
                    {openFlags().length > 5 && <div style={{ paddingTop: 8 }}><span style={S.alink} onClick={() => nav('flags')}>See all flags →</span></div>}
                  </div>
                </div>
              )}

              {/* Members */}
              {page === 'members' && (
                <div>
                  <div style={S.pageHeader}>
                    <div style={S.pageTitle}>Members <span style={{ fontSize: 13, color: '#aaa', fontWeight: 400 }}>({members.length})</span></div>
                    <button style={S.btnPrimary} onClick={() => nav('addmember')}><i className="ti ti-user-plus" />Add member</button>
                  </div>
                  <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                    <table style={S.table}>
                      <thead>
                        <tr style={{ background: '#fafafa' }}>
                          <th style={{ ...S.th, width: '25%' }}>Member</th>
                          <th style={{ ...S.th, width: '28%' }}>Package</th>
                          <th style={{ ...S.th, width: '10%' }}>Credits</th>
                          <th style={{ ...S.th, width: '12%' }}>Billing</th>
                          <th style={{ ...S.th, width: '13%' }}>Status</th>
                          <th style={{ ...S.th, width: '12%' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.length === 0 ? (
                          <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', fontSize: 13, color: '#aaa' }}>No members yet. Add one or import a CSV.</td></tr>
                        ) : members.map(m => {
                          const mf = memberFlags(m._id);
                          return (
                            <tr key={String(m._id)} style={{ borderBottom: '0.5px solid #f0f0f0' }}>
                              <td style={S.td}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                  <div style={S.avatar}>{ini(m)}</div>
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {fullName(m)} {mf.length > 0 && <i className="ti ti-flag" style={{ fontSize: 11, color: '#E24B4A' }} />}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ ...S.td, fontSize: 12, color: '#666' }}>{m.pkg}</td>
                              <td style={{ ...S.td, fontSize: 12 }}>{m.credits !== null && m.credits !== undefined ? m.credits : '∞'}</td>
                              <td style={{ ...S.td, fontSize: 12, color: '#888' }}>{m.billing || '—'}</td>
                              <td style={S.td}><StatusBadge status={m.status} /></td>
                              <td style={S.td}><span style={S.alink} onClick={() => viewMember(m, 'members')}>View →</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Flags */}
              {page === 'flags' && (
                <div>
                  <div style={S.pageHeader}>
                    <div style={S.pageTitle}>Flags</div>
                    <button style={S.btn} onClick={() => { setFlagForm({ memberId: members[0]?._id || '', reason: 'card', note: '' }); setShowFlagModal(true); }}>
                      <i className="ti ti-plus" />Add flag
                    </button>
                  </div>
                  <div style={S.tabs}>
                    {['open', 'resolved'].map(t => (
                      <div key={t} style={{ ...S.tab, ...(flagTab === t ? S.tabActive : {}) }} onClick={() => setFlagTab(t)}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </div>
                    ))}
                  </div>
                  <div style={S.card}>
                    {flags.filter(f => f.resolved === (flagTab === 'resolved')).length === 0 ? (
                      <div style={S.empty}>{flagTab === 'open' ? 'No open flags.' : 'No resolved flags yet.'}</div>
                    ) : flags.filter(f => f.resolved === (flagTab === 'resolved')).map(f => {
                      const m = members.find(x => String(x._id) === String(f.memberId));
                      if (!m) return null;
                      return (
                        <div key={String(f._id)} style={{ ...S.flagRow, opacity: f.resolved ? 0.6 : 1 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <div style={S.avatar}>{ini(m)}</div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 13, fontWeight: 500 }}>{fullName(m)}</span>
                                <FlagPill reason={f.reason} />
                                {f.resolved && <span style={{ background: '#E1F5EE', color: '#0F6E56', padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 500 }}>Resolved</span>}
                              </div>
                              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Flagged {f.date}</div>
                              {f.note && <div style={{ background: '#f5f5f5', borderRadius: 6, padding: '5px 9px', fontSize: 12, color: '#666', marginTop: 5 }}>{f.note}</div>}
                            </div>
                          </div>
                          {!f.resolved && (
                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                              <button style={S.btnSm} onClick={() => viewMember(m, 'flags')}>View</button>
                              <button style={{ ...S.btnSm, color: '#1D9E75', borderColor: '#9FE1CB' }} onClick={() => resolveFlag(f)}>
                                <i className="ti ti-check" />Resolve
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Packages */}
              {page === 'packages' && (
                <div>
                  <div style={S.pageHeader}>
                    <div style={S.pageTitle}>Packages</div>
                    <button style={S.btnPrimary} onClick={() => setShowPkgModal(true)}><i className="ti ti-plus" />New package</button>
                  </div>
                  {packages.map((p, i) => (
                    <div key={i} style={S.card}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>
                            {p.type} · {p.sessions ? `${p.sessions} × 25-min sessions/mo` : 'Single session'} · {p.notes}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{ fontSize: 17, fontWeight: 500 }}>${p.price}<span style={{ fontSize: 11, fontWeight: 400, color: '#888' }}>{p.sessions > 1 ? '/mo' : ''}</span></div>
                          <button style={{ ...S.btnSm, color: '#A32D2D', borderColor: '#F7C1C1' }} onClick={() => setPackages(prev => prev.filter((_, j) => j !== i))}>
                            <i className="ti ti-trash" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Member */}
              {page === 'addmember' && (
                <div>
                  <div style={S.pageHeader}><div style={S.pageTitle}>Add new member</div></div>
                  <div style={{ ...S.card, maxWidth: 520 }}>
                    <div style={S.formRow}>
                      <div style={S.formGroup}>
                        <label style={S.label}>First name</label>
                        <input style={S.input} value={newMember.firstName} onChange={e => setNewMember(p => ({ ...p, firstName: e.target.value }))} placeholder="Sarah" />
                      </div>
                      <div style={S.formGroup}>
                        <label style={S.label}>Last name</label>
                        <input style={S.input} value={newMember.lastName} onChange={e => setNewMember(p => ({ ...p, lastName: e.target.value }))} placeholder="Miller" />
                      </div>
                    </div>
                    <div style={S.formGroup}>
                      <label style={S.label}>Email</label>
                      <input style={S.input} type="email" value={newMember.email} onChange={e => setNewMember(p => ({ ...p, email: e.target.value }))} placeholder="sarah@email.com" />
                    </div>
                    <div style={S.formGroup}>
                      <label style={S.label}>Phone</label>
                      <input style={S.input} value={newMember.phone} onChange={e => setNewMember(p => ({ ...p, phone: e.target.value }))} placeholder="(617) 555-0100" />
                    </div>
                    <div style={S.formRow}>
                      <div style={S.formGroup}>
                        <label style={S.label}>Package</label>
                        <select style={S.input} value={newMember.pkg} onChange={e => setNewMember(p => ({ ...p, pkg: e.target.value }))}>
                          <option value="">Select…</option>
                          {packages.map((p, i) => <option key={i} value={p.name}>{p.name} — ${p.price}</option>)}
                        </select>
                      </div>
                      <div style={S.formGroup}>
                        <label style={S.label}>Start date</label>
                        <input style={S.input} type="date" value={newMember.start} onChange={e => setNewMember(p => ({ ...p, start: e.target.value }))} />
                      </div>
                    </div>
                    <div style={S.formGroup}>
                      <label style={S.label}>Card on file (last 4)</label>
                      <input style={S.input} maxLength={4} value={newMember.card} onChange={e => setNewMember(p => ({ ...p, card: e.target.value }))} placeholder="4242" />
                    </div>
                    <div style={S.formGroup}>
                      <label style={S.label}>Notes</label>
                      <textarea style={{ ...S.input, resize: 'vertical' }} rows={2} value={newMember.notes} onChange={e => setNewMember(p => ({ ...p, notes: e.target.value }))} placeholder="Health notes, goals, preferences…" />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <button style={S.btnPrimary} onClick={addMember}><i className="ti ti-check" />Save member</button>
                      <button style={S.btn} onClick={() => nav('members')}>Cancel</button>
                    </div>
                    {nmSuccess && <div style={{ ...S.banner, ...S.bannerInfo, marginTop: 12 }}><i className="ti ti-check" />Member added successfully!</div>}
                  </div>
                </div>
              )}

              {/* Member Detail */}
              {page === 'detail' && detailMember && (() => {
                const m = members.find(x => String(x._id) === String(detailMember._id)) || detailMember;
                const mf = memberFlags(m._id);
                const pkg = packages.find(p => p.name === m.pkg);
                const maxC = pkg ? pkg.sessions : null;
                const pct = maxC && m.credits != null ? Math.round((m.credits / maxC) * 100) : null;
                return (
                  <div>
                    <div style={S.pageHeader}>
                      <button style={S.btnSm} onClick={() => nav(detailBack)}><i className="ti ti-arrow-left" />Back</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                      <div style={{ ...S.avatar, width: 48, height: 48, fontSize: 16 }}>{ini(m)}</div>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 500 }}>{fullName(m)}</div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>{m.email} · {m.phone}</div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
                          <StatusBadge status={m.status} />
                          {mf.length > 0 && <span style={{ background: '#FCEBEB', color: '#A32D2D', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500 }}><i className="ti ti-flag" style={{ fontSize: 9 }} /> {mf.length} open flag{mf.length > 1 ? 's' : ''}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div style={S.card}>
                        <div style={S.cardTitle}>Membership</div>
                        <div style={S.detailRow}><span style={{ color: '#888' }}>Package</span><span>{m.pkg || '—'}</span></div>
                        {pkg && <div style={S.detailRow}><span style={{ color: '#888' }}>Sessions</span><span>{pkg.sessions} × 25 min/mo</span></div>}
                        {pkg && <div style={S.detailRow}><span style={{ color: '#888' }}>Rate</span><span>${pkg.price}{pkg.sessions > 1 ? '/mo' : ''}</span></div>}
                        <div style={S.detailRow}><span style={{ color: '#888' }}>Next billing</span><span>{m.billing || '—'}</span></div>
                        <div style={S.detailRow}><span style={{ color: '#888' }}>Card on file</span><span>···· {m.card || '????'}</span></div>
                        {m.status === 'declined' && <div style={{ ...S.banner, ...S.bannerDanger, marginTop: 10, fontSize: 11 }}><i className="ti ti-credit-card-off" />Card declined — follow-up needed</div>}
                        {m.credits != null && (
                          <>
                            <div style={S.detailRow}><span style={{ color: '#888' }}>Credits left</span><span>{m.credits}</span></div>
                            {pct !== null && <div style={{ height: 5, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginTop: 6 }}><div style={{ height: '100%', width: `${pct}%`, background: '#1B8DB3', borderRadius: 3 }} /></div>}
                          </>
                        )}
                      </div>
                      <div style={S.card}>
                        <div style={S.cardTitle}>Notes & flags</div>
                        <div style={{ fontSize: 12, color: '#888', lineHeight: 1.6, marginBottom: 12 }}>{m.notes || 'No notes on file.'}</div>
                        {mf.length > 0 ? mf.map(f => (
                          <div key={String(f._id)} style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <FlagPill reason={f.reason} />
                              <span style={{ ...S.alink, color: '#1D9E75', fontSize: 11 }} onClick={() => resolveFlag(f)}>Resolve</span>
                            </div>
                            {f.note && <div style={{ background: '#f5f5f5', borderRadius: 6, padding: '5px 9px', fontSize: 11, color: '#666', marginTop: 4 }}>{f.note}</div>}
                          </div>
                        )) : <div style={{ fontSize: 11, color: '#aaa' }}>No open flags.</div>}
                        <button style={{ ...S.btnSm, marginTop: 12 }} onClick={() => { setFlagForm({ memberId: String(m._id), reason: 'card', note: '' }); setShowFlagModal(true); }}>
                          <i className="ti ti-flag" />Add flag
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                      <button style={S.btnSm} onClick={() => updateMemberStatus(m, 'active')}><i className="ti ti-check" />Mark active</button>
                      <button style={S.btnSm} onClick={() => updateMemberStatus(m, 'paused')}><i className="ti ti-pause" />Pause</button>
                      <button style={{ ...S.btnSm, color: '#A32D2D', borderColor: '#F7C1C1' }} onClick={() => removeMember(m)}><i className="ti ti-trash" />Remove</button>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div style={S.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowFlagModal(false); }}>
          <div style={S.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Add flag</div>
              <button style={{ ...S.btnSm, border: 'none', fontSize: 16 }} onClick={() => setShowFlagModal(false)}><i className="ti ti-x" /></button>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Member</label>
              <select style={S.input} value={flagForm.memberId} onChange={e => setFlagForm(p => ({ ...p, memberId: e.target.value }))}>
                <option value="">Select…</option>
                {members.map(m => <option key={String(m._id)} value={String(m._id)}>{fullName(m)}</option>)}
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Reason</label>
              <select style={S.input} value={flagForm.reason} onChange={e => setFlagForm(p => ({ ...p, reason: e.target.value }))}>
                <option value="card">Card declined</option>
                <option value="expiring">Membership expiring</option>
                <option value="inactive">Inactive — no bookings</option>
                <option value="manual">Manual note</option>
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Note (optional)</label>
              <input style={S.input} value={flagForm.note} onChange={e => setFlagForm(p => ({ ...p, note: e.target.value }))} placeholder="Add context…" />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button style={S.btnPrimary} onClick={addFlag}><i className="ti ti-flag" />Save flag</button>
              <button style={S.btn} onClick={() => setShowFlagModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Package Modal */}
      {showPkgModal && (
        <div style={S.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowPkgModal(false); }}>
          <div style={S.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>New package</div>
              <button style={{ ...S.btnSm, border: 'none', fontSize: 16 }} onClick={() => setShowPkgModal(false)}><i className="ti ti-x" /></button>
            </div>
            <div style={S.formRow}>
              <div style={S.formGroup}>
                <label style={S.label}>Name</label>
                <input style={S.input} value={pkgForm.name} onChange={e => setPkgForm(p => ({ ...p, name: e.target.value }))} placeholder="4x/month" />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Price ($)</label>
                <input style={S.input} type="number" value={pkgForm.price} onChange={e => setPkgForm(p => ({ ...p, price: e.target.value }))} placeholder="170" />
              </div>
            </div>
            <div style={S.formRow}>
              <div style={S.formGroup}>
                <label style={S.label}>Sessions/mo</label>
                <input style={S.input} type="number" value={pkgForm.sessions} onChange={e => setPkgForm(p => ({ ...p, sessions: e.target.value }))} placeholder="4" />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Type</label>
                <select style={S.input} value={pkgForm.type} onChange={e => setPkgForm(p => ({ ...p, type: e.target.value }))}>
                  <option>Stretch therapy</option>
                  <option>Massage therapy</option>
                  <option>Combo</option>
                </select>
              </div>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Notes</label>
              <input style={S.input} value={pkgForm.notes} onChange={e => setPkgForm(p => ({ ...p, notes: e.target.value }))} placeholder="e.g. First responder rate" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={S.btnPrimary} onClick={addPackage}><i className="ti ti-check" />Save</button>
              <button style={S.btn} onClick={() => setShowPkgModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  app: { display: 'flex', height: '100vh', background: '#f7f7f5', fontFamily: 'system-ui, sans-serif', color: '#1a1a1a' },
  sidebar: { width: 210, minWidth: 210, background: '#fff', borderRight: '0.5px solid #e8e8e8', display: 'flex', flexDirection: 'column', height: '100vh' },
  logo: { padding: '12px 14px', borderBottom: '0.5px solid #1570A0', background: '#1B8DB3' },
  logoName: { fontSize: 15, fontWeight: 900, fontStyle: 'italic', color: '#1B8DB3', textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: 1.1 },
  logoSub: { fontSize: 7, color: '#1B8DB3', marginTop: 3, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 },
  navItem: { display: 'flex', alignItems: 'center', gap: 9, padding: '8px 18px', fontSize: 13, cursor: 'pointer', color: '#666', borderLeft: '2px solid transparent', transition: 'all .12s' },
  navItemActive: { background: '#EBF6FB', color: '#1B8DB3', borderLeftColor: '#1B8DB3', fontWeight: 500 },
  navBadge: { marginLeft: 'auto', background: '#FCEBEB', color: '#A32D2D', borderRadius: 10, fontSize: 10, padding: '1px 6px', fontWeight: 500 },
  navSection: { fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em', color: '#bbb', padding: '.75rem 18px .3rem', marginTop: '.25rem' },
  sidebarFooter: { padding: '14px 18px', borderTop: '0.5px solid #e8e8e8' },
  main: { flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' },
  pageHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' },
  pageTitle: { fontSize: 17, fontWeight: 600 },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: '1.125rem' },
  metric: { background: '#fff', border: '0.5px solid #efefef', borderRadius: 10, padding: '12px 14px' },
  metricLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  metricValue: { fontSize: 22, fontWeight: 600 },
  metricSub: { fontSize: 10, color: '#bbb', marginTop: 3 },
  card: { background: '#fff', border: '0.5px solid #efefef', borderRadius: 10, padding: '14px 16px', marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: 500, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 },
  flagRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #f3f3f3' },
  table: { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' },
  th: { textAlign: 'left', fontWeight: 500, fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.05em', padding: '10px 10px', borderBottom: '0.5px solid #f0f0f0' },
  td: { padding: '9px 10px', verticalAlign: 'middle' },
  avatar: { width: 28, height: 28, borderRadius: '50%', background: '#D6EEF7', color: '#1B8DB3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500, flexShrink: 0 },
  avatarFlag: { background: '#FCEBEB', color: '#A32D2D' },
  input: { fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#1a1a1a', background: '#fff', border: '0.5px solid #ddd', borderRadius: 8, padding: '7px 10px', width: '100%', outline: 'none', boxSizing: 'border-box' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 },
  label: { fontSize: 11, color: '#888' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 8, border: '0.5px solid #ddd', background: 'transparent', color: '#1a1a1a', fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui, sans-serif' },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: '0.5px solid #1B8DB3', background: '#1B8DB3', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui, sans-serif' },
  btnSm: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 7, border: '0.5px solid #ddd', background: 'transparent', color: '#1a1a1a', fontSize: 11, cursor: 'pointer', fontFamily: 'system-ui, sans-serif' },
  alink: { color: '#1B8DB3', cursor: 'pointer', fontSize: 12 },
  tabs: { display: 'flex', gap: 2, marginBottom: 14, background: '#f3f3f3', padding: 3, borderRadius: 8, width: 'fit-content' },
  tab: { padding: '5px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: '#888' },
  tabActive: { background: '#fff', color: '#1a1a1a', fontWeight: 500 },
  banner: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, fontSize: 12 },
  bannerDanger: { background: '#FCEBEB', border: '0.5px solid #F7C1C1', color: '#A32D2D' },
  bannerInfo: { background: '#E6F1FB', border: '0.5px solid #B5D4F4', color: '#185FA5' },
  empty: { fontSize: 12, color: '#aaa', padding: '12px 0' },
  detailRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 0', borderBottom: '0.5px solid #f5f5f5' },
  searchDrop: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '0.5px solid #ddd', borderRadius: 8, zIndex: 200, maxHeight: 220, overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,.08)' },
  searchItem: { padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '0.5px solid #f5f5f5' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 12, border: '0.5px solid #e0e0e0', padding: '1.25rem', width: 440, maxHeight: '85vh', overflowY: 'auto' },
};
