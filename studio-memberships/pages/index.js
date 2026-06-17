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
    active:    { bg: '#E1F5EE', color: '#0F6E56', label: 'Active' },
    declined:  { bg: '#FCEBEB', color: '#A32D2D', label: 'Declined' },
    expiring:  { bg: '#FAEEDA', color: '#854F0B', label: 'Expiring' },
    paused:    { bg: '#F1EFE8', color: '#5F5E5A', label: 'Paused' },
    inactive:  { bg: '#F0F0F0', color: '#888', label: 'Inactive' },
    walkin:    { bg: '#EEF2FF', color: '#4338CA', label: 'Walk-in' },
    frequent:  { bg: '#FDF4FF', color: '#7C3AED', label: 'Frequent Visitor' },
    og:        { bg: '#FFFBEB', color: '#92400E', label: '⭐ OG' },
  };
  const s = map[status] || map.active;
  return <span style={{ background: s.bg, color: s.color, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{s.label}</span>;
}

function FlagPill({ reason }) {
  const map = {
    card: { bg: '#FCEBEB', color: '#A32D2D', label: 'Card declined' },
    expiring: { bg: '#FAEEDA', color: '#854F0B', label: 'Expiring' },
    inactive: { bg: '#E6F1FB', color: '#185FA5', label: 'Inactive' },
    manual: { bg: '#EEEDFE', color: '#534AB7', label: 'Manual' },
    commitment: { bg: '#FFF0E6', color: '#C05B00', label: '2-mo commitment' },
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
    if (typeof window !== 'undefined' && sessionStorage.getItem('studio_auth') === 'true') setAuthed(true);
  }, []);

  async function handleLogin() {
    setPwLoading(true); setPwError('');
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwInput }) });
    if (res.ok) { sessionStorage.setItem('studio_auth', 'true'); setAuthed(true); }
    else setPwError('Incorrect password. Try again.');
    setPwLoading(false);
  }

  if (!authed) return (
    <>
      <Head>
        <title>Stretch N Motion — Staff Login</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.8.0/dist/tabler-icons.min.css" />
      </Head>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1B8DB3 0%, #0d6a8a 100%)', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem', width: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg, #1B8DB3, #0d6a8a)', borderRadius: 10, padding: '14px 20px', marginBottom: 18, display: 'inline-block', boxShadow: '0 4px 12px rgba(27,141,179,0.3)' }}>
              <div style={{ fontSize: 20, fontWeight: 900, fontStyle: 'italic', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: 1.1 }}>STRETCH N<br/>MOTION</div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.8)', marginTop: 4, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>MOBILITY STUDIO · MEMBERS</div>
            </div>
            <div style={{ fontSize: 13, color: '#999', fontWeight: 500 }}>Staff access only</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <input type="password" style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: '#1a1a1a', background: '#F8FAFB', border: '1.5px solid #E8ECF0', borderRadius: 10, padding: '10px 12px', width: '100%', outline: 'none', boxSizing: 'border-box' }}
              value={pwInput} onChange={e => setPwInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Enter staff password" autoFocus />
          </div>
          {pwError && <div style={{ fontSize: 12, color: '#A32D2D', marginBottom: 12, background: '#FFF0F0', padding: '8px 12px', borderRadius: 8 }}>{pwError}</div>}
          <button onClick={handleLogin} disabled={pwLoading} style={{ width: '100%', padding: '11px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #1B8DB3, #0d6a8a)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(27,141,179,0.3)' }}>
            {pwLoading ? 'Checking…' : 'Log in →'}
          </button>
        </div>
      </div>
    </>
  );

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
  const [memberFilter, setMemberFilter] = useState('active');
  const [pkgFilter, setPkgFilter] = useState('all');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [flagForm, setFlagForm] = useState({ memberId: '', reason: 'card', note: '' });
  const [pkgForm, setPkgForm] = useState({ name: '', price: '', sessions: '', type: 'Stretch therapy', notes: '' });
  const [newMember, setNewMember] = useState({ firstName: '', lastName: '', email: '', phone: '', pkg: '', start: '', card: '', notes: '', commitmentStart: new Date().toISOString().split('T')[0] });
  const [nmSuccess, setNmSuccess] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const [newMembersData, setNewMembersData] = useState([]);
  const [walkInRevenueMonth, setWalkInRevenueMonth] = useState(0);
  const [commitmentChecking, setCommitmentChecking] = useState(false);
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

  function calcMonthWalkInRevenue(visits) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return visits
      .filter(v => new Date(v.visitDate) >= monthStart)
      .reduce((a, v) => a + (v.rateCharged || 0), 0);
  }

  async function fetchAll() {
    setLoading(true);
    try {
      const [mr, fr, nm, vr] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/flags'),
        fetch('/api/members/commitment-check'),
        fetch('/api/visits'),
      ]);
      const [md, fd, nmd, vd] = await Promise.all([mr.json(), fr.json(), nm.json(), vr.json()]);
      setMembers(Array.isArray(md) ? md : []);
      setFlags(Array.isArray(fd) ? fd : []);
      setNewMembersData(Array.isArray(nmd) ? nmd : []);
      setWalkInRevenueMonth(calcMonthWalkInRevenue(Array.isArray(vd) ? vd : []));
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  // Silent refresh — updates data in background without loading flash
  async function refreshSilent() {
    try {
      const [mr, fr, nm, vr] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/flags'),
        fetch('/api/members/commitment-check'),
        fetch('/api/visits'),
      ]);
      const [md, fd, nmd, vd] = await Promise.all([mr.json(), fr.json(), nm.json(), vr.json()]);
      setMembers(Array.isArray(md) ? md : []);
      setFlags(Array.isArray(fd) ? fd : []);
      setNewMembersData(Array.isArray(nmd) ? nmd : []);
      setWalkInRevenueMonth(calcMonthWalkInRevenue(Array.isArray(vd) ? vd : []));
    } catch (e) { console.error(e); }
  }

  async function runCommitmentCheck() {
    setCommitmentChecking(true);
    try {
      await fetch('/api/members/commitment-check', { method: 'POST' });
      await refreshSilent();
    } catch (e) { console.error(e); }
    setCommitmentChecking(false);
  }

  function openFlags() { return flags.filter(f => !f.resolved); }
  function memberFlags(id) { return flags.filter(f => !f.resolved && String(f.memberId) === String(id)); }
  function cardFlags() { return openFlags().filter(f => f.reason === 'card'); }
  function otherFlags() { return openFlags().filter(f => f.reason !== 'card' && f.reason !== 'commitment'); }
  function commitmentFlags() { return openFlags().filter(f => f.reason === 'commitment'); }

  function nav(p) { setPage(p); setSearch(''); setShowSearchDrop(false); setShowFlagModal(false); setShowPkgModal(false); }
  function viewMember(m, back) { setDetailMember(m); setDetailBack(back || page); setPage('detail'); }

  function handleSearch(val) {
    setSearch(val);
    if (!val.trim()) { setShowSearchDrop(false); return; }
    const q = val.toLowerCase();
    const res = members.filter(m => (fullName(m) + (m.email||'') + (m.pkg||'') + (m.phone||'')).toLowerCase().includes(q)).slice(0, 6);
    setSearchResults(res); setShowSearchDrop(res.length > 0);
  }

  async function addMember() {
    if (!newMember.firstName || !newMember.lastName || !newMember.email) { alert('Name and email are required.'); return; }
    const res = await fetch('/api/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newMember, credits: 0, status: 'active', createdAt: new Date(), commitmentStart: newMember.commitmentStart || new Date().toISOString().split('T')[0] }) });
    const doc = await res.json();
    // Update local state instantly — no refresh needed
    setMembers(prev => [...prev, doc]);
    if (newMember.commitmentStart) {
      const start = new Date(newMember.commitmentStart);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 2);
      const daysLeft = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
      const daysIn = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
      setNewMembersData(prev => [...prev, { ...doc, commitmentEnd: end.toISOString(), daysLeft, daysIn, isEnding: daysLeft <= 7, isOverdue: daysLeft < 0 }]);
    }
    setNewMember({ firstName: '', lastName: '', email: '', phone: '', pkg: '', start: '', card: '', notes: '', commitmentStart: new Date().toISOString().split('T')[0] });
    setNmSuccess(true); setTimeout(() => setNmSuccess(false), 3000);
  }

  async function updateMember(m, updates) {
    const updated = { ...m, ...updates };
    await fetch('/api/members', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    setMembers(prev => prev.map(x => String(x._id) === String(m._id) ? updated : x));
    setDetailMember(prev => prev && String(prev._id) === String(m._id) ? updated : prev);
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
    // Instant local update
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
    setShowPkgModal(false); setPkgForm({ name: '', price: '', sessions: '', type: 'Stretch therapy', notes: '' });
  }

  function handleCSV(e) {
    const file = e.target.files[0]; if (!file) return;
    setImportMsg('');
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await fetch('/api/members/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ members: results.data }) });
          const data = await res.json();
          setImportMsg(`✓ ${data.inserted} new, ${data.updated} updated`);
          refreshSilent();
        } catch { setImportMsg('Import failed.'); }
      }
    });
  }

  const activeMembers = members.filter(m => m.status === 'active');
  const activeCount = activeMembers.length;
  const openFlagCount = openFlags().length;
  const expiringCount = members.filter(m => m.status === 'expiring').length;
  const unassignedCount = members.filter(m => !m.pkg || m.pkg === '').length;
  const ogCount = members.filter(m => m.status === 'og').length;
  const membershipRevenue = activeMembers.reduce((a, m) => {
    const pkg = packages.find(p => p.name === m.pkg); return a + (pkg ? pkg.price : 0);
  }, 0);
  const revenue = membershipRevenue + walkInRevenueMonth;

  // Package tier breakdown
  const tierBreakdown = packages.map(p => ({
    ...p,
    count: activeMembers.filter(m => m.name === p.name || m.pkg === p.name).length,
  }));

  // Filtered members for the members page
  const filteredMembers = members.filter(m => {
    const statusMatch = memberFilter === 'all' ? true :
      memberFilter === 'visitors' ? ['walkin', 'frequent', 'og'].includes(m.status) :
      m.status === memberFilter;
    const pkgMatch = pkgFilter === 'all' ? true : pkgFilter === 'none' ? (!m.pkg || m.pkg === '') : m.pkg === pkgFilter;
    return statusMatch && pkgMatch;
  });

  const S = styles;

  function FlagSection({ title, flagList, color, icon }) {
    if (flagList.length === 0) return null;
    return (
      <div style={{ ...S.card, borderLeft: `3px solid ${color}` }}>
        <div style={{ ...S.cardTitle, color }}>
          <i className={`ti ${icon}`} style={{ fontSize: 13, marginRight: 6 }} />{title}
          <span style={{ marginLeft: 8, background: color + '22', color, borderRadius: 10, fontSize: 10, padding: '1px 7px', fontWeight: 600 }}>{flagList.length}</span>
        </div>
        {flagList.map(f => {
          const m = members.find(x => String(x._id) === String(f.memberId)); if (!m) return null;
          return (
            <div key={String(f._id)} style={S.flagRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={S.avatar}>{ini(m)}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{fullName(m)}</span><FlagPill reason={f.reason} />
                  </div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{f.note || 'No note'} · {f.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={S.btnSm} onClick={() => viewMember(m, page)}>View</button>
                <button style={{ ...S.btnSm, color: '#1D9E75', borderColor: '#9FE1CB' }} onClick={() => resolveFlag(f)}>Resolve</button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function DrewMode() {
    const [tab, setTab] = useState('assign');

    // ── Tab 1: Package Assignment ─────────────────────────────────────────
    function AssignTab() {
      // Only show unassigned members who visited within 60 days — everyone else is auto-inactive
      const allUnassigned = members.filter(m => !m.pkg || m.pkg === '');
      const unassigned = allUnassigned.filter(m => m.daysSinceLastAppt == null || m.daysSinceLastAppt <= 60);
      const autoInactive = allUnassigned.filter(m => m.daysSinceLastAppt != null && m.daysSinceLastAppt > 60 && m.status !== 'inactive');
      const [idx, setIdx] = useState(0);
      const [selectedPkg, setSelectedPkg] = useState('');
      const [done, setDone] = useState(0);
      const [skipped, setSkipped] = useState(0);
      const [autoCleaning, setAutoCleaning] = useState(false);
      const [autoCleaned, setAutoCleaned] = useState(false);

      async function runAutoClean() {
        setAutoCleaning(true);
        const ids = autoInactive.map(m => String(m._id));
        await fetch('/api/members', {
        console.log("auto-clean ids:", ids.length, ids.slice(0, 3));
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids, updates: { status: 'inactive' } }),
        });
        // Update local state instantly
        setMembers(prev => prev.map(m =>
          autoInactive.find(x => String(x._id) === String(m._id)) ? { ...m, status: 'inactive' } : m
        ));
        setAutoCleaned(true);
        setAutoCleaning(false);
      }

      const current = unassigned[idx];
      const total = unassigned.length;
      const pct = total > 0 ? Math.round((idx / total) * 100) : 100;

      async function assignPkg() {
        if (!selectedPkg) return;
        await updateMember(current, { pkg: selectedPkg, status: 'active' });
        setDone(d => d + 1); setSelectedPkg(''); setIdx(i => i + 1);
      }
      async function deleteRecord() {
        if (!confirm(`Delete ${fullName(current)} from studio-memberships? This cannot be undone.`)) return;
        await fetch(`/api/members?id=${current._id}`, { method: 'DELETE' });
        setMembers(prev => prev.filter(x => String(x._id) !== String(current._id)));
        setDone(d => d + 1); setIdx(i => i + 1);
      }
      function skip() { setSkipped(s => s + 1); setIdx(i => i + 1); }

      if (total === 0 || idx >= total) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: 16 }}>
          <div style={{ fontSize: 64 }}>🎉</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1B8DB3' }}>All done, Admin Master!</div>
          <div style={{ fontSize: 14, color: '#888' }}>{done} processed · {skipped} skipped</div>
          <button style={{ ...S.btnPrimary, padding: '10px 24px', fontSize: 14, marginTop: 8 }} onClick={() => { refreshSilent(); nav('members'); }}>Back to Members</button>
        </div>
      );

      return (
        <div>
          {/* Auto-clean banner */}
          {!autoCleaned && autoInactive.length > 0 && (
            <div style={{ background: 'linear-gradient(135deg, #FFF7ED, #FEE2C0)', border: '1px solid #FCD34D', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#92400E' }}>⚡ {autoInactive.length} records can be auto-cleared</div>
                <div style={{ fontSize: 12, color: '#A16207', marginTop: 2 }}>No package + last visit over 60 days ago — almost certainly not current members</div>
              </div>
              <button onClick={runAutoClean} disabled={autoCleaning} style={{ ...S.btnPrimary, fontSize: 13, background: 'linear-gradient(135deg, #92400E, #78350F)' }}>
                {autoCleaning ? '⏳ Cleaning…' : `⚡ Auto-clear ${autoInactive.length}`}
              </button>
            </div>
          )}
          {autoCleaned && (
            <div style={{ background: '#E1F5EE', border: '1px solid #9FE1CB', color: '#0F6E56', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>
              ✓ {autoInactive.length} inactive records cleared automatically
            </div>
          )}
          <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>{idx} of {total} reviewed · {done} assigned · {skipped} skipped · showing members active within 60 days</div>
          <div style={{ height: 6, background: '#E8F4F8', borderRadius: 3, marginBottom: 24, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #1B8DB3, #0d6a8a)', borderRadius: 3, transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8ECF0', padding: '2rem', boxShadow: '0 8px 32px rgba(27,141,179,0.08)', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1B8DB3, #0d6a8a)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>{ini(current)}</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{fullName(current)}</div>
                  <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{current.email || 'No email'}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{current.phone || 'No phone'}</div>
                </div>
              </div>
              <div style={{ background: '#F8FAFB', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
                {current.daysSinceLastAppt != null ? (
                  <div style={{ fontSize: 13, color: current.daysSinceLastAppt > 180 ? '#A32D2D' : current.daysSinceLastAppt > 90 ? '#854F0B' : '#0F6E56', fontWeight: 600, marginBottom: 4 }}>
                    {current.daysSinceLastAppt === 0 ? '🟢 Visited today' : `📅 Last visit: ${current.daysSinceLastAppt} days ago`}
                  </div>
                ) : null}
                {current.notes ? <div style={{ fontSize: 12, color: '#666', fontStyle: 'italic' }}>"{current.notes}"</div> : <div style={{ fontSize: 12, color: '#aaa' }}>No visit history or notes on file.</div>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assign Package</label>
                <select value={selectedPkg} onChange={e => setSelectedPkg(e.target.value)} style={{ ...S.input, fontSize: 14, padding: '10px 12px' }}>
                  <option value="">Select a package…</option>
                  {packages.map((p, i) => <option key={i} value={p.name}>{p.name} — ${p.price}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={assignPkg} disabled={!selectedPkg} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: selectedPkg ? 'linear-gradient(135deg, #1B8DB3, #0d6a8a)' : '#E8ECF0', color: selectedPkg ? '#fff' : '#aaa', fontSize: 14, fontWeight: 700, cursor: selectedPkg ? 'pointer' : 'default', transition: 'all 0.2s' }}>
                  ✓ Assign as Member
                </button>
                <button onClick={deleteRecord} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #F7C1C1', background: '#FFF8F8', color: '#A32D2D', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  🗑 Delete Record
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={skip} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>Skip for now →</button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#ccc' }}>{total - idx - 1} remaining after this</div>
          </div>
        </div>
      );
    }

    // ── Tab 2: Clean Records ──────────────────────────────────────────────
    function CleanRecordsTab() {
      const [loading, setLoading] = useState(false);
      const [data, setData] = useState(null);
      const [selected, setSelected] = useState(new Set());
      const [deleting, setDeleting] = useState(false);
      const [done, setDone] = useState(false);
      const [filterOrphans, setFilterOrphans] = useState(true);

      async function runCheck() {
        setLoading(true);
        setSelected(new Set());
        try {
          const res = await fetch('/api/cleanup/orphans');
          const json = await res.json();
          setData(json);
        } catch (err) {
          alert('Failed to fetch data: ' + err.message);
        }
        setLoading(false);
      }

      function toggleSelect(id) {
        setSelected(prev => {
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
          return next;
        });
      }

      function selectAll() {
        const visible = displayList.map(r => r._id);
        setSelected(new Set(visible));
      }

      function clearAll() { setSelected(new Set()); }

      async function deleteSelected() {
        if (selected.size === 0) return;
        if (!confirm(`Permanently delete ${selected.size} records from studio-memberships? This cannot be undone. Acuity is NOT affected.`)) return;
        setDeleting(true);
        try {
          const res = await fetch('/api/cleanup/orphans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: Array.from(selected) }),
          });
          const result = await res.json();
          setDone(true);
          refreshSilent();
          alert(`✓ Deleted ${result.deleted} records from studio-memberships. Acuity unchanged.`);
          setData(null);
          setSelected(new Set());
          setDone(false);
        } catch (err) {
          alert('Delete failed: ' + err.message);
        }
        setDeleting(false);
      }

      const displayList = data ? (filterOrphans ? data.results.filter(r => r.isOrphan) : data.results) : [];

      function scoreColor(score) {
        if (score >= 100) return '#0F6E56';
        if (score >= 60) return '#854F0B';
        return '#A32D2D';
      }

      function scoreLabel(score) {
        if (score >= 100) return 'Strong match';
        if (score >= 60) return 'Weak match';
        return 'No match in Acuity';
      }

      return (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Clean Records</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                Find studio-memberships records with no match in Acuity. Delete safely — Acuity is never touched.
              </div>
            </div>
            <button onClick={runCheck} disabled={loading} style={{ ...S.btnPrimary, fontSize: 13 }}>
              {loading ? '⏳ Comparing…' : data ? '🔄 Re-run Check' : '🔍 Run Check'}
            </button>
          </div>

          {/* Stats */}
          {data && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Studio-Memberships', value: data.total, color: '#1B8DB3', bg: '#EBF6FB' },
                { label: 'Acuity Clients', value: data.acuityTotal, color: '#0F6E56', bg: '#E1F5EE' },
                { label: 'No Acuity Match', value: data.orphanCount, color: '#A32D2D', bg: '#FCEBEB' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: s.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Filter + bulk actions */}
          {data && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setFilterOrphans(true)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: filterOrphans ? '#A32D2D' : '#F0F4F7', color: filterOrphans ? '#fff' : '#666', border: 'none' }}>
                  No Match ({data.orphanCount})
                </button>
                <button onClick={() => setFilterOrphans(false)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: !filterOrphans ? '#1B8DB3' : '#F0F4F7', color: !filterOrphans ? '#fff' : '#666', border: 'none' }}>
                  All ({data.total})
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {selected.size > 0 && (
                  <>
                    <span style={{ fontSize: 12, color: '#888' }}>{selected.size} selected</span>
                    <button onClick={clearAll} style={{ ...S.btnSm, fontSize: 11 }}>Clear</button>
                    <button onClick={deleteSelected} disabled={deleting} style={{ ...S.btnSm, background: '#A32D2D', color: '#fff', border: 'none', fontWeight: 700, fontSize: 12 }}>
                      {deleting ? 'Deleting…' : `🗑 Delete ${selected.size}`}
                    </button>
                  </>
                )}
                {selected.size === 0 && displayList.length > 0 && (
                  <button onClick={selectAll} style={{ ...S.btnSm, fontSize: 11 }}>Select all {displayList.length}</button>
                )}
              </div>
            </div>
          )}

          {/* Results list */}
          {!data && !loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Ready to compare</div>
              <div style={{ fontSize: 13 }}>Hit "Run Check" to pull Acuity clients and compare against studio-memberships</div>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <div style={{ fontSize: 13 }}>⏳ Fetching Acuity clients and comparing {members.length} records…</div>
            </div>
          )}

          {data && displayList.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>All records match Acuity clients</div>
            </div>
          )}

          {data && displayList.length > 0 && (
            <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
              <table style={S.table}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #F8FAFB, #F0F4F7)' }}>
                    <th style={{ ...S.th, width: '3%' }}></th>
                    <th style={{ ...S.th, width: '20%' }}>Studio Record</th>
                    <th style={{ ...S.th, width: '18%' }}>Email</th>
                    <th style={{ ...S.th, width: '10%' }}>Status</th>
                    <th style={{ ...S.th, width: '10%' }}>Last Visit</th>
                    <th style={{ ...S.th, width: '15%' }}>Acuity Match</th>
                    <th style={{ ...S.th, width: '14%' }}>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {displayList.map(r => (
                    <tr key={r._id} style={{ borderBottom: '0.5px solid #f0f0f0', background: selected.has(r._id) ? '#FFF0F0' : r.isOrphan ? '#FFFBFB' : 'transparent', cursor: 'pointer' }}
                      onClick={() => toggleSelect(r._id)}>
                      <td style={S.td}>
                        <input type="checkbox" checked={selected.has(r._id)} onChange={() => toggleSelect(r._id)}
                          onClick={e => e.stopPropagation()} style={{ cursor: 'pointer' }} />
                      </td>
                      <td style={S.td}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{r.firstName} {r.lastName}</div>
                        <div style={{ fontSize: 10, color: '#aaa' }}>{r.phone || '—'}</div>
                      </td>
                      <td style={{ ...S.td, fontSize: 11, color: '#555' }}>{r.email || '—'}</td>
                      <td style={S.td}><StatusBadge status={r.status} /></td>
                      <td style={{ ...S.td, fontSize: 11, color: r.daysSinceLastAppt > 180 ? '#A32D2D' : '#666' }}>
                        {r.daysSinceLastAppt != null ? `${r.daysSinceLastAppt}d ago` : '—'}
                      </td>
                      <td style={{ ...S.td, fontSize: 11 }}>
                        {r.bestAcuityMatch ? (
                          <div>
                            <div style={{ fontWeight: 600 }}>{r.bestAcuityMatch.firstName} {r.bestAcuityMatch.lastName}</div>
                            <div style={{ color: '#aaa', fontSize: 10 }}>{r.bestAcuityMatch.email || '—'}</div>
                          </div>
                        ) : <span style={{ color: '#ccc' }}>None found</span>}
                      </td>
                      <td style={S.td}>
                        <span style={{ background: scoreColor(r.matchScore) + '22', color: scoreColor(r.matchScore), padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>
                          {scoreLabel(r.matchScore)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        <div style={S.pageHeader}>
          <div>
            <div style={S.pageTitle}>
              Admin Master Tools <span style={{ fontSize: 13, color: '#1B8DB3', fontWeight: 600 }}>🏆</span>
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Drew's domain. Handle with care.</div>
          </div>
          <button style={S.btn} onClick={() => nav('dashboard')}>Exit</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 24, background: '#F0F4F7', padding: 3, borderRadius: 10, width: 'fit-content' }}>
          {[
            { key: 'assign', label: `📋 Assign Packages (${members.filter(m => !m.pkg || m.pkg === '').length})` },
            { key: 'clean', label: '🧹 Clean Records' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '8px 20px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif', fontWeight: 600, border: 'none',
              background: tab === t.key ? '#fff' : 'transparent',
              color: tab === t.key ? '#1B8DB3' : '#888',
              boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'assign' && <AssignTab />}
        {tab === 'clean' && <CleanRecordsTab />}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Stretch N Motion Members</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.8.0/dist/tabler-icons.min.css" />
      </Head>
      <div style={S.app}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <div style={S.logo}>
            <div style={{ background: '#fff', borderRadius: 6, padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={S.logoName}>STRETCH N<br/>MOTION</div>
              <div style={S.logoSub}>MOBILITY STUDIO · MEMBERS</div>
            </div>
          </div>
          <div style={{ padding: '8px 10px', borderBottom: '0.5px solid #e5e5e5', position: 'relative' }} ref={searchRef}>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-search" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#999' }} />
              <input value={search} onChange={e => handleSearch(e.target.value)} onFocus={() => search && setShowSearchDrop(searchResults.length > 0)} placeholder="Search members…" style={{ ...S.input, paddingLeft: 28, fontSize: 12, background: '#f5f5f5', border: '0.5px solid #e0e0e0' }} />
            </div>
            {showSearchDrop && (
              <div style={S.searchDrop}>
                {searchResults.map(m => (
                  <div key={String(m._id)} style={S.searchItem} onClick={() => { viewMember(m, 'members'); setShowSearchDrop(false); setSearch(''); }}>
                    <div style={{ ...S.avatar, width: 24, height: 24, fontSize: 9, flexShrink: 0 }}>{ini(m)}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{fullName(m)}</div>
                      <div style={{ fontSize: 10, color: '#888' }}>{m.pkg || 'No package'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', paddingTop: 6 }}>
            {[
              { id: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
              { id: 'newmembers', icon: 'ti-user-star', label: 'New Members', badge: newMembersData.filter(m => m.daysLeft <= 7).length },
              { id: 'members', icon: 'ti-users', label: 'Members' },
              { id: 'walkins', icon: 'ti-walk', label: 'Walk-ins & Visitors' },
              { id: 'flags', icon: 'ti-flag', label: 'Flags', badge: openFlagCount },
              { id: 'packages', icon: 'ti-package', label: 'Packages' },
            ].map(item => (
              <div key={item.id} style={{ ...S.navItem, ...(page === item.id || (page === 'detail' && detailBack === item.id) ? S.navItemActive : {}) }} onClick={() => nav(item.id)}>
                <i className={`ti ${item.icon}`} style={{ fontSize: 15 }} /><span>{item.label}</span>
                {item.badge > 0 && <span style={S.navBadge}>{item.badge}</span>}
              </div>
            ))}
            <div style={S.navSection}>Tools</div>
            <div style={{ ...S.navItem, ...(page === 'cleanup' ? S.navItemActive : {}), ...(unassignedCount > 0 ? { color: '#1B8DB3' } : {}) }} onClick={() => nav('cleanup')}>
              <i className="ti ti-shield-check" style={{ fontSize: 15 }} /><span>Admin Master 🏆</span>
              {unassignedCount > 0 && <span style={{ ...S.navBadge, background: '#EBF6FB', color: '#1B8DB3' }}>{unassignedCount}</span>}
            </div>
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
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2, color: '#555' }}>Staff admin</div>
          </div>
        </div>

        {/* Main */}
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
                    <div>
                      <div style={S.pageTitle}>Dashboard</div>
                      <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                  </div>

                  {/* Top metrics */}
                  <div style={S.metrics}>
                    {[
                      { label: 'Active Members', value: activeCount, sub: 'Currently active', color: '#1B8DB3', icon: 'ti-users', bg: 'linear-gradient(135deg, #EBF6FB, #D6EEF7)' },
                      { label: 'Open Flags', value: openFlagCount, sub: 'Need follow-up', color: openFlagCount > 0 ? '#A32D2D' : '#0F6E56', icon: 'ti-flag', bg: openFlagCount > 0 ? 'linear-gradient(135deg, #FFF0F0, #FCEBEB)' : 'linear-gradient(135deg, #F0FDF4, #E1F5EE)' },
                      { label: '⭐ OGs', value: ogCount, sub: 'Long-time loyalists', color: '#92400E', icon: 'ti-award', bg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' },
                      { label: 'Monthly Revenue', value: `$${revenue.toLocaleString()}`, sub: `Memberships + $${walkInRevenueMonth.toLocaleString()} walk-ins`, color: '#0F6E56', icon: 'ti-currency-dollar', bg: 'linear-gradient(135deg, #F0FDF4, #E1F5EE)' },
                    ].map((m, i) => (
                      <div key={i} style={{ background: m.bg, borderRadius: 12, padding: '16px 18px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div style={{ fontSize: 11, color: m.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
                          <i className={`ti ${m.icon}`} style={{ fontSize: 16, color: m.color, opacity: 0.6 }} />
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
                        <div style={{ fontSize: 11, color: m.color, opacity: 0.7, marginTop: 4 }}>{m.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Membership tier breakdown */}
                  <div style={{ ...S.card, marginBottom: 16 }}>
                    <div style={S.cardTitle}>
                      <i className="ti ti-chart-bar" style={{ fontSize: 13, marginRight: 6, color: '#1B8DB3' }} />
                      Membership Tiers
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {packages.filter(p => p.sessions > 1).map((p, i) => {
                        const count = activeMembers.filter(m => m.pkg === p.name).length;
                        const maxCount = Math.max(...packages.filter(pk => pk.sessions > 1).map(pk => activeMembers.filter(m => m.pkg === pk.name).length), 1);
                        const barPct = Math.round((count / maxCount) * 100);
                        const tierRevenue = count * p.price;
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 160, fontSize: 12, fontWeight: 600, color: '#444', flexShrink: 0 }}>{p.name}</div>
                            <div style={{ flex: 1, height: 8, background: '#F0F4F7', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${barPct}%`, background: 'linear-gradient(90deg, #1B8DB3, #0d6a8a)', borderRadius: 4, transition: 'width 0.6s ease' }} />
                            </div>
                            <div style={{ width: 32, fontSize: 13, fontWeight: 800, color: '#1B8DB3', textAlign: 'right', flexShrink: 0 }}>{count}</div>
                            <div style={{ width: 72, fontSize: 11, color: '#888', textAlign: 'right', flexShrink: 0 }}>${tierRevenue.toLocaleString()}/mo</div>
                            <button onClick={() => { setMemberFilter('active'); setPkgFilter(p.name); nav('members'); }} style={{ fontSize: 10, color: '#1B8DB3', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', flexShrink: 0 }}>view</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Drew nudge */}
                  {unassignedCount > 0 && (
                    <div style={{ background: 'linear-gradient(135deg, #EBF6FB, #D6EEF7)', border: '1px solid #B5D4E4', borderRadius: 12, padding: '14px 18px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#1B8DB3' }}>🧹 {unassignedCount} members need review</div>
                        <div style={{ fontSize: 12, color: '#5A9AB5', marginTop: 2 }}>Admin Master, time to earn that title.</div>
                      </div>
                      <button onClick={() => nav('cleanup')} style={{ ...S.btnPrimary, fontSize: 13, padding: '8px 16px' }}>Start Cleanup →</button>
                    </div>
                  )}

                  <FlagSection title="Commitment Ending" flagList={commitmentFlags()} color="#C05B00" icon="ti-calendar-due" />
                  <FlagSection title="Delinquent Cards" flagList={cardFlags()} color="#A32D2D" icon="ti-credit-card-off" />
                  <FlagSection title="Other Flags" flagList={otherFlags()} color="#854F0B" icon="ti-alert-triangle" />
                  {openFlagCount === 0 && <div style={S.card}><div style={S.empty}>No open flags — all clear 🎉</div></div>}
                </div>
              )}

              {/* New Members */}
              {page === 'newmembers' && (
                <div>
                  <div style={S.pageHeader}>
                    <div>
                      <div style={S.pageTitle}>New Members 🌟</div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Everyone in their 2-month commitment window</div>
                    </div>
                    <button onClick={runCommitmentCheck} disabled={commitmentChecking} style={S.btnPrimary}>
                      {commitmentChecking ? '⏳ Checking…' : '🔔 Check Commitments'}
                    </button>
                  </div>

                  {newMembersData.length === 0 ? (
                    <div style={{ ...S.card, textAlign: 'center', padding: '40px' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#888' }}>No members with active commitments</div>
                      <div style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>Add a new member with a commitment start date to see them here</div>
                    </div>
                  ) : (
                    <>
                      {/* Summary stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                        {[
                          { label: 'In Commitment', value: newMembersData.length, color: '#1B8DB3', bg: 'linear-gradient(135deg, #EBF6FB, #D6EEF7)' },
                          { label: 'Ending This Week', value: newMembersData.filter(m => m.daysLeft <= 7 && m.daysLeft >= 0).length, color: '#C05B00', bg: 'linear-gradient(135deg, #FFF7ED, #FEE2C0)' },
                          { label: 'Past End Date', value: newMembersData.filter(m => m.daysLeft < 0).length, color: '#A32D2D', bg: 'linear-gradient(135deg, #FFF0F0, #FCEBEB)' },
                        ].map((s, i) => (
                          <div key={i} style={{ background: s.bg, borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: 11, color: s.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Member cards */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {newMembersData.map(m => {
                          const isUrgent = m.daysLeft <= 7 && m.daysLeft >= 0;
                          const isOverdue = m.daysLeft < 0;
                          const borderColor = isOverdue ? '#A32D2D' : isUrgent ? '#C05B00' : '#1B8DB3';
                          const bgColor = isOverdue ? '#FFFBFB' : isUrgent ? '#FFFCF7' : '#FAFCFE';

                          // Progress bar
                          const progress = Math.min(100, Math.max(0, Math.round((m.daysIn / 60) * 100)));

                          return (
                            <div key={String(m._id)} style={{ background: bgColor, border: `1px solid ${borderColor}33`, borderLeft: `3px solid ${borderColor}`, borderRadius: 12, padding: '14px 18px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${borderColor}33, ${borderColor}22)`, color: borderColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                                    {ini(m)}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 14, fontWeight: 700 }}>{fullName(m)}</div>
                                    <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{m.pkg || 'No package'} · Started {new Date(m.commitmentStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                  <div style={{ fontSize: 18, fontWeight: 800, color: borderColor }}>
                                    {isOverdue ? `${Math.abs(m.daysLeft)}d over` : `${m.daysLeft}d left`}
                                  </div>
                                  <div style={{ fontSize: 10, color: '#888' }}>
                                    Ends {new Date(m.commitmentEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </div>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div style={{ marginTop: 12 }}>
                                <div style={{ height: 5, background: '#E8ECF0', borderRadius: 3, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${borderColor}88, ${borderColor})`, borderRadius: 3, transition: 'width 0.4s ease' }} />
                                </div>
                                <div style={{ fontSize: 10, color: '#aaa', marginTop: 3 }}>{progress}% through commitment · Day {m.daysIn} of 60</div>
                              </div>

                              {/* Actions */}
                              {(isUrgent || isOverdue) && (
                                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                                  <button onClick={() => viewMember(m, 'newmembers')} style={S.btnSm}>View Profile</button>
                                  <button onClick={async () => {
                                    const flagData = { memberId: String(m._id), reason: 'commitment', note: `Commitment ${isOverdue ? 'ended' : 'ending in ' + m.daysLeft + ' days'} — confirm continuation`, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), resolved: false };
                                    const res = await fetch('/api/flags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(flagData) });
                                    const doc = await res.json();
                                    setFlags(prev => [doc, ...prev]);
                                  }} style={{ ...S.btnSm, color: '#C05B00', borderColor: '#FED7A0' }}>
                                    🔔 Flag for Follow-up
                                  </button>
                                </div>
                              )}
                              {!isUrgent && !isOverdue && (
                                <div style={{ marginTop: 10 }}>
                                  <button onClick={() => viewMember(m, 'newmembers')} style={S.btnSm}>View Profile</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Walk-ins & Visitors */}
              {page === 'walkins' && <WalkInsPage members={members} setMembers={setMembers} packages={packages} viewMember={viewMember} styles={S} refreshDashboard={refreshSilent} />}

              {/* Members */}
              {/* Members */}
              {page === 'members' && (
                <div>
                  <div style={S.pageHeader}>
                    <div style={S.pageTitle}>Members <span style={{ fontSize: 13, color: '#aaa', fontWeight: 400 }}>({filteredMembers.length})</span></div>
                    <button style={S.btnPrimary} onClick={() => nav('addmember')}><i className="ti ti-user-plus" />Add member</button>
                  </div>

                  {/* Status filter */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                    {[
                      { key: 'active', label: `Active (${members.filter(m => m.status === 'active').length})` },
                      { key: 'paused', label: `Paused (${members.filter(m => m.status === 'paused').length})` },
                      { key: 'expiring', label: `Expiring (${members.filter(m => m.status === 'expiring').length})` },
                      { key: 'visitors', label: `Visitors (${members.filter(m => ['walkin','frequent','og'].includes(m.status)).length})` },
                      { key: 'all', label: `All (${members.length})` },
                    ].map(f => (
                      <button key={f.key} onClick={() => setMemberFilter(f.key)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontWeight: 600, transition: 'all 0.15s', background: memberFilter === f.key ? '#1B8DB3' : '#fff', color: memberFilter === f.key ? '#fff' : '#666', border: memberFilter === f.key ? '1px solid #1B8DB3' : '1px solid #ddd', boxShadow: memberFilter === f.key ? '0 2px 8px rgba(27,141,179,0.2)' : 'none' }}>{f.label}</button>
                    ))}
                  </div>

                  {/* Package tier filter */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                    <button onClick={() => setPkgFilter('all')} style={{ padding: '4px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontWeight: 600, background: pkgFilter === 'all' ? '#2C4A5A' : '#F0F4F7', color: pkgFilter === 'all' ? '#fff' : '#666', border: 'none' }}>All tiers</button>
                    {packages.filter(p => p.sessions > 1).map((p, i) => (
                      <button key={i} onClick={() => setPkgFilter(p.name)} style={{ padding: '4px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontWeight: 600, background: pkgFilter === p.name ? '#2C4A5A' : '#F0F4F7', color: pkgFilter === p.name ? '#fff' : '#666', border: 'none' }}>{p.name}</button>
                    ))}
                    <button onClick={() => setPkgFilter('none')} style={{ padding: '4px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontWeight: 600, background: pkgFilter === 'none' ? '#2C4A5A' : '#F0F4F7', color: pkgFilter === 'none' ? '#fff' : '#666', border: 'none' }}>No package</button>
                  </div>

                  <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                    <table style={S.table}>
                      <thead>
                        <tr style={{ background: 'linear-gradient(135deg, #F8FAFB, #F0F4F7)' }}>
                          <th style={{ ...S.th, width: '22%' }}>Member</th>
                          <th style={{ ...S.th, width: '26%' }}>Package</th>
                          <th style={{ ...S.th, width: '12%' }}>Status</th>
                          <th style={{ ...S.th, width: '12%' }}>Flags</th>
                          <th style={{ ...S.th, width: '16%' }}>Last Visit</th>
                          <th style={{ ...S.th, width: '12%' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.length === 0 ? (
                          <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', fontSize: 13, color: '#aaa' }}>No members in this category.</td></tr>
                        ) : filteredMembers.map(m => {
                          const mf = memberFlags(m._id);
                          const hasCardFlag = mf.some(f => f.reason === 'card');
                          return (
                            <tr key={String(m._id)} style={{ borderBottom: '0.5px solid #f0f0f0', background: hasCardFlag ? '#FFF8F8' : 'transparent' }}>
                              <td style={S.td}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                  <div style={{ ...S.avatar, ...(hasCardFlag ? { background: '#FCEBEB', color: '#A32D2D' } : {}) }}>{ini(m)}</div>
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fullName(m)}</div>
                                    <div style={{ fontSize: 10, color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ ...S.td, fontSize: 12 }}>
                                {m.pkg ? (
                                  <span style={{ background: '#EBF6FB', color: '#1B8DB3', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{m.pkg}</span>
                                ) : <span style={{ color: '#ccc', fontSize: 11 }}>No package</span>}
                              </td>
                              <td style={S.td}><StatusBadge status={m.status} /></td>
                              <td style={S.td}>{mf.length > 0 ? <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{mf.map((f, i) => <FlagPill key={i} reason={f.reason} />)}</div> : <span style={{ color: '#ccc', fontSize: 11 }}>—</span>}</td>
                              <td style={{ ...S.td, fontSize: 11, color: m.daysSinceLastAppt > 90 ? '#A32D2D' : '#666' }}>
                                {m.daysSinceLastAppt != null ? `${m.daysSinceLastAppt}d ago` : '—'}
                              </td>
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
                    <button style={S.btn} onClick={() => { setFlagForm({ memberId: members[0]?._id || '', reason: 'card', note: '' }); setShowFlagModal(true); }}><i className="ti ti-plus" />Add flag</button>
                  </div>
                  <div style={S.tabs}>
                    {['open', 'resolved'].map(t => (
                      <div key={t} style={{ ...S.tab, ...(flagTab === t ? S.tabActive : {}) }} onClick={() => setFlagTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</div>
                    ))}
                  </div>
                  {flagTab === 'open' && (
                    <>
                      <FlagSection title="Commitment Ending" flagList={commitmentFlags()} color="#C05B00" icon="ti-calendar-due" />
                      <FlagSection title="Delinquent Cards" flagList={cardFlags()} color="#A32D2D" icon="ti-credit-card-off" />
                      <FlagSection title="Other Flags" flagList={otherFlags()} color="#854F0B" icon="ti-alert-triangle" />
                      {openFlagCount === 0 && <div style={S.card}><div style={S.empty}>No open flags — all clear 🎉</div></div>}
                    </>
                  )}
                  {flagTab === 'resolved' && (
                    <div style={S.card}>
                      {flags.filter(f => f.resolved).length === 0 ? <div style={S.empty}>No resolved flags yet.</div> : flags.filter(f => f.resolved).map(f => {
                        const m = members.find(x => String(x._id) === String(f.memberId)); if (!m) return null;
                        return (
                          <div key={String(f._id)} style={{ ...S.flagRow, opacity: 0.6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={S.avatar}>{ini(m)}</div>
                              <div>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ fontSize: 13, fontWeight: 500 }}>{fullName(m)}</span><FlagPill reason={f.reason} /><span style={{ background: '#E1F5EE', color: '#0F6E56', padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 500 }}>Resolved</span></div>
                                <div style={{ fontSize: 11, color: '#888' }}>Flagged {f.date}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Packages */}
              {page === 'packages' && (
                <div>
                  <div style={S.pageHeader}>
                    <div style={S.pageTitle}>Packages</div>
                    <button style={S.btnPrimary} onClick={() => setShowPkgModal(true)}><i className="ti ti-plus" />New package</button>
                  </div>
                  {packages.map((p, i) => {
                    const count = activeMembers.filter(m => m.pkg === p.name).length;
                    return (
                      <div key={i} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>{p.sessions ? `${p.sessions} × 25-min sessions/mo` : 'Single session'} · {p.notes}</div>
                          {count > 0 && <div style={{ fontSize: 11, color: '#1B8DB3', marginTop: 4, fontWeight: 600 }}>{count} active member{count !== 1 ? 's' : ''}</div>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#1B8DB3' }}>${p.price}<span style={{ fontSize: 11, fontWeight: 400, color: '#888' }}>{p.sessions > 1 ? '/mo' : ''}</span></div>
                          <button style={{ ...S.btnSm, color: '#A32D2D', borderColor: '#F7C1C1' }} onClick={() => setPackages(prev => prev.filter((_, j) => j !== i))}><i className="ti ti-trash" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Member Cleanup */}
              {page === 'cleanup' && <DrewMode />}

              {/* Add Member */}
              {page === 'addmember' && (
                <div>
                  <div style={S.pageHeader}><div style={S.pageTitle}>Add New Member</div></div>
                  <div style={{ ...S.card, maxWidth: 520 }}>
                    <div style={S.formRow}>
                      <div style={S.formGroup}><label style={S.label}>First name</label><input style={S.input} value={newMember.firstName} onChange={e => setNewMember(p => ({ ...p, firstName: e.target.value }))} placeholder="Sarah" /></div>
                      <div style={S.formGroup}><label style={S.label}>Last name</label><input style={S.input} value={newMember.lastName} onChange={e => setNewMember(p => ({ ...p, lastName: e.target.value }))} placeholder="Miller" /></div>
                    </div>
                    <div style={S.formGroup}><label style={S.label}>Email</label><input style={S.input} type="email" value={newMember.email} onChange={e => setNewMember(p => ({ ...p, email: e.target.value }))} placeholder="sarah@email.com" /></div>
                    <div style={S.formGroup}><label style={S.label}>Phone</label><input style={S.input} value={newMember.phone} onChange={e => setNewMember(p => ({ ...p, phone: e.target.value }))} placeholder="(617) 555-0100" /></div>
                    <div style={S.formRow}>
                      <div style={S.formGroup}><label style={S.label}>Package</label>
                        <select style={S.input} value={newMember.pkg} onChange={e => setNewMember(p => ({ ...p, pkg: e.target.value }))}>
                          <option value="">Select…</option>
                          {packages.map((p, i) => <option key={i} value={p.name}>{p.name} — ${p.price}</option>)}
                        </select>
                      </div>
                      <div style={S.formGroup}><label style={S.label}>Start date</label><input style={S.input} type="date" value={newMember.start} onChange={e => setNewMember(p => ({ ...p, start: e.target.value }))} /></div>
                    </div>
                    <div style={S.formGroup}>
                      <label style={S.label}>2-Month Commitment Start</label>
                      <input style={S.input} type="date" value={newMember.commitmentStart} onChange={e => setNewMember(p => ({ ...p, commitmentStart: e.target.value }))} />
                      {newMember.commitmentStart && (
                        <div style={{ fontSize: 11, color: '#1B8DB3', marginTop: 4 }}>
                          ✓ Commitment ends {new Date(new Date(newMember.commitmentStart).setMonth(new Date(newMember.commitmentStart).getMonth() + 2)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                    <div style={S.formGroup}><label style={S.label}>Card on file (last 4)</label><input style={S.input} maxLength={4} value={newMember.card} onChange={e => setNewMember(p => ({ ...p, card: e.target.value }))} placeholder="4242" /></div>
                    <div style={S.formGroup}><label style={S.label}>Notes</label><textarea style={{ ...S.input, resize: 'vertical' }} rows={2} value={newMember.notes} onChange={e => setNewMember(p => ({ ...p, notes: e.target.value }))} placeholder="Health notes, goals, preferences…" /></div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={S.btnPrimary} onClick={addMember}><i className="ti ti-check" />Save member</button>
                      <button style={S.btn} onClick={() => nav('members')}>Cancel</button>
                    </div>
                    {nmSuccess && <div style={{ background: '#E1F5EE', border: '1px solid #9FE1CB', color: '#0F6E56', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 12 }}>✓ Member added successfully!</div>}
                  </div>
                </div>
              )}

              {/* Member Detail */}
              {page === 'detail' && detailMember && <MemberDetail
                member={members.find(x => String(x._id) === String(detailMember._id)) || detailMember}
                members={members}
                packages={packages}
                flags={flags}
                nav={nav}
                detailBack={detailBack}
                updateMember={updateMember}
                removeMember={removeMember}
                resolveFlag={resolveFlag}
                setFlagForm={setFlagForm}
                setShowFlagModal={setShowFlagModal}
                styles={S}
              />}
            </>
          )}
        </div>
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div style={S.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowFlagModal(false); }}>
          <div style={S.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Add Flag</div>
              <button style={{ ...S.btnSm, border: 'none' }} onClick={() => setShowFlagModal(false)}><i className="ti ti-x" /></button>
            </div>
            <div style={S.formGroup}><label style={S.label}>Member</label>
              <select style={S.input} value={flagForm.memberId} onChange={e => setFlagForm(p => ({ ...p, memberId: e.target.value }))}>
                <option value="">Select…</option>
                {members.map(m => <option key={String(m._id)} value={String(m._id)}>{fullName(m)}</option>)}
              </select>
            </div>
            <div style={S.formGroup}><label style={S.label}>Reason</label>
              <select style={S.input} value={flagForm.reason} onChange={e => setFlagForm(p => ({ ...p, reason: e.target.value }))}>
                <option value="card">Card declined</option>
                <option value="commitment">2-month commitment ending</option>
                <option value="expiring">Membership expiring</option>
                <option value="inactive">Inactive — no bookings</option>
                <option value="manual">Manual note</option>
              </select>
            </div>
            <div style={S.formGroup}><label style={S.label}>Note (optional)</label>
              <input style={S.input} value={flagForm.note} onChange={e => setFlagForm(p => ({ ...p, note: e.target.value }))} placeholder="Add context…" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
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
              <div style={{ fontSize: 15, fontWeight: 700 }}>New Package</div>
              <button style={{ ...S.btnSm, border: 'none' }} onClick={() => setShowPkgModal(false)}><i className="ti ti-x" /></button>
            </div>
            <div style={S.formRow}>
              <div style={S.formGroup}><label style={S.label}>Name</label><input style={S.input} value={pkgForm.name} onChange={e => setPkgForm(p => ({ ...p, name: e.target.value }))} placeholder="4x/month" /></div>
              <div style={S.formGroup}><label style={S.label}>Price ($)</label><input style={S.input} type="number" value={pkgForm.price} onChange={e => setPkgForm(p => ({ ...p, price: e.target.value }))} placeholder="170" /></div>
            </div>
            <div style={S.formRow}>
              <div style={S.formGroup}><label style={S.label}>Sessions/mo</label><input style={S.input} type="number" value={pkgForm.sessions} onChange={e => setPkgForm(p => ({ ...p, sessions: e.target.value }))} placeholder="4" /></div>
              <div style={S.formGroup}><label style={S.label}>Type</label>
                <select style={S.input} value={pkgForm.type} onChange={e => setPkgForm(p => ({ ...p, type: e.target.value }))}>
                  <option>Stretch therapy</option><option>Massage therapy</option><option>Combo</option>
                </select>
              </div>
            </div>
            <div style={S.formGroup}><label style={S.label}>Notes</label><input style={S.input} value={pkgForm.notes} onChange={e => setPkgForm(p => ({ ...p, notes: e.target.value }))} placeholder="e.g. First responder rate" /></div>
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


function WalkInsPage({ members, setMembers, packages, viewMember, styles: S, refreshDashboard }) {
  const [visitTab, setVisitTab] = useState('log');
  const [visitForm, setVisitForm] = useState({ memberSearch: '', memberId: '', memberName: '', service: '25-min Stretch Session', duration: '25', rateCharged: '95', rateType: 'walkin', therapist: '', notes: '' });
  const [visitSearch, setVisitSearch] = useState([]);
  const [visitLogged, setVisitLogged] = useState(null);
  const [allVisits, setAllVisits] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [editingVisit, setEditingVisit] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [addVisitorForm, setAddVisitorForm] = useState({ firstName: '', lastName: '', email: '', phone: '', status: 'walkin', notes: '' });
  const [visitorAdded, setVisitorAdded] = useState(false);

  const visitors = members.filter(m => ['walkin', 'frequent', 'og'].includes(m.status));
  const ogMembers = members.filter(m => m.status === 'og');
  const frequentVisitors = members.filter(m => m.status === 'frequent');
  const walkIns = members.filter(m => m.status === 'walkin');

  function ini(m) { return ((m.firstName||'?')[0] + (m.lastName||'?')[0]).toUpperCase(); }
  function fullName(m) { return `${m.firstName} ${m.lastName}`; }

  async function loadVisits() {
    setLoadingVisits(true);
    try {
      const res = await fetch('/api/visits');
      const data = await res.json();
      setAllVisits(Array.isArray(data) ? data : []);
    } catch {}
    setLoadingVisits(false);
  }

  useEffect(() => { loadVisits(); }, []);

  // Today's visits derived from allVisits — always accurate, no separate fetch needed
  const todayVisits = allVisits.filter(v => {
    const d = new Date(v.visitDate);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const todayRevenue = todayVisits.reduce((a, v) => a + (v.rateCharged || 0), 0);
  const allTimeRevenue = allVisits.reduce((a, v) => a + (v.rateCharged || 0), 0);

  function searchVisitors(val) {
    setVisitForm(f => ({ ...f, memberSearch: val, memberId: '', memberName: val }));
    if (!val.trim()) { setVisitSearch([]); return; }
    const q = val.toLowerCase();
    setVisitSearch(members.filter(m => (fullName(m) + (m.email||'')).toLowerCase().includes(q)).slice(0, 6));
  }

  async function logVisit() {
    if (!visitForm.memberName.trim()) { alert('Enter a name'); return; }
    const res = await fetch('/api/visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(visitForm) });
    const doc = await res.json();
    setVisitLogged(doc);
    setAllVisits(prev => [doc, ...prev]);
    setVisitForm({ memberSearch: '', memberId: '', memberName: '', service: '25-min Stretch Session', duration: '25', rateCharged: '95', rateType: 'walkin', therapist: '', notes: '' });
    setVisitSearch([]);
    setTimeout(() => setVisitLogged(null), 4000);
    if (refreshDashboard) refreshDashboard();
  }

  function startEdit(v) {
    setEditingVisit(v._id);
    setEditForm({ ...v, rateCharged: String(v.rateCharged) });
  }

  async function saveEdit() {
    await fetch('/api/visits', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) });
    setAllVisits(prev => prev.map(v => String(v._id) === String(editForm._id) ? { ...editForm, rateCharged: parseFloat(editForm.rateCharged) || 0 } : v));
    setEditingVisit(null);
    setEditForm(null);
    if (refreshDashboard) refreshDashboard();
  }

  async function deleteVisit(id) {
    if (!confirm('Delete this visit log entry? This cannot be undone.')) return;
    await fetch(`/api/visits?id=${id}`, { method: 'DELETE' });
    setAllVisits(prev => prev.filter(v => String(v._id) !== String(id)));
    if (refreshDashboard) refreshDashboard();
  }

  async function addVisitor() {
    if (!addVisitorForm.firstName || !addVisitorForm.lastName) { alert('Name required'); return; }
    const res = await fetch('/api/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...addVisitorForm, createdAt: new Date() }) });
    const doc = await res.json();
    setMembers(prev => [...prev, doc]);
    setAddVisitorForm({ firstName: '', lastName: '', email: '', phone: '', status: 'walkin', notes: '' });
    setVisitorAdded(true);
    setTimeout(() => setVisitorAdded(false), 3000);
  }

  const rateOptions25 = [
    { key: 'walkin', label: '25-min Walk-in', amount: 95 },
    { key: 'member', label: 'Member rate', amount: 170 },
    { key: 'og', label: 'OG rate', amount: 153 },
    { key: 'comp', label: 'Comp', amount: 0 },
  ];
  const rateOptions50 = [
    { key: 'walkin', label: '50-min Walk-in', amount: 80 },
    { key: 'walkin_premium', label: '50-min (premium)', amount: 95 },
    { key: 'member', label: 'Member rate', amount: 170 },
    { key: 'comp', label: 'Comp', amount: 0 },
  ];
  const rateOptions = visitForm.duration === '50' ? rateOptions50 : rateOptions25;
  const editRateOptions = editForm?.duration === '50' ? rateOptions50 : rateOptions25;

  return (
    <div>
      <div style={S.pageHeader}>
        <div>
          <div style={S.pageTitle}>Walk-ins & Visitors</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Log visits, track cash, manage your regulars</div>
        </div>
      </div>

      {/* Persistent cash tally — always visible at top */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <div style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', borderRadius: 12, padding: '16px 18px', border: '1px solid #A7F3D0' }}>
          <div style={{ fontSize: 11, color: '#047857', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>💵 Today's Cash Tally</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#047857' }}>${todayRevenue}</div>
          <div style={{ fontSize: 11, color: '#047857', opacity: 0.7 }}>{todayVisits.length} visit{todayVisits.length !== 1 ? 's' : ''} logged today</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #EBF6FB, #D6EEF7)', borderRadius: 12, padding: '16px 18px', border: '1px solid #B5D4E4' }}>
          <div style={{ fontSize: 11, color: '#1B8DB3', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>All-Time Walk-in Revenue</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#1B8DB3' }}>${allTimeRevenue.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: '#1B8DB3', opacity: 0.7 }}>{allVisits.length} total visits logged</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', borderRadius: 12, padding: '16px 18px', border: '1px solid #FDE68A' }}>
          <div style={{ fontSize: 11, color: '#92400E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Visitors in System</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#92400E' }}>{visitors.length}</div>
          <div style={{ fontSize: 11, color: '#92400E', opacity: 0.7 }}>{ogMembers.length} OG · {frequentVisitors.length} frequent · {walkIns.length} walk-in</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, background: '#F0F4F7', padding: 3, borderRadius: 10, width: 'fit-content' }}>
        {[
          { key: 'log', label: '📋 Log a Visit' },
          { key: 'history', label: `🧾 Visit Log (${allVisits.length})` },
          { key: 'roster', label: '👥 Visitor Roster' },
          { key: 'add', label: '➕ Add Visitor' },
        ].map(t => (
          <button key={t.key} onClick={() => setVisitTab(t.key)} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontWeight: 600, border: 'none', background: visitTab === t.key ? '#fff' : 'transparent', color: visitTab === t.key ? '#1B8DB3' : '#888', boxShadow: visitTab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.label}</button>
        ))}
      </div>

      {/* Log a Visit */}
      {visitTab === 'log' && (
        <div style={{ maxWidth: 520 }}>
          {visitLogged && (
            <div style={{ background: '#E1F5EE', border: '1px solid #9FE1CB', color: '#0F6E56', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>
              ✓ Visit logged for {visitLogged.memberName} — ${visitLogged.rateCharged}
            </div>
          )}
          <div style={S.card}>
            <div style={S.cardTitle}>Log Visit</div>
            <div style={{ ...S.formGroup, position: 'relative' }}>
              <label style={S.label}>Member / Visitor Name</label>
              <input style={S.input} value={visitForm.memberSearch} onChange={e => searchVisitors(e.target.value)} placeholder="Search or type name…" autoComplete="off" />
              {visitSearch.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #E0E6EB', borderRadius: 8, zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', marginTop: 2 }}>
                  {visitSearch.map(m => (
                    <div key={String(m._id)} onClick={() => { setVisitForm(f => ({ ...f, memberSearch: fullName(m), memberId: String(m._id), memberName: fullName(m), rateType: m.status === 'og' ? 'og' : m.status === 'frequent' ? 'member' : 'walkin', rateCharged: m.status === 'og' ? '153' : m.status === 'frequent' ? '170' : (f.duration === '50' ? '80' : '95') })); setVisitSearch([]); }}
                      style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '0.5px solid #F5F5F5' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.status === 'og' ? '#FEF3C7' : '#D6EEF7', color: m.status === 'og' ? '#92400E' : '#1B8DB3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{ini(m)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{fullName(m)}</div>
                        <div style={{ fontSize: 10 }}><StatusBadge status={m.status} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={S.formRow}>
              <div style={S.formGroup}>
                <label style={S.label}>Session Length</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['25', '50'].map(d => (
                    <button key={d} type="button" onClick={() => {
                      const defaultRate = d === '50' ? '80' : '95';
                      setVisitForm(f => ({ ...f, duration: d, service: `${d}-min Stretch Session`, rateType: 'walkin', rateCharged: defaultRate }));
                    }} style={{ flex: 1, padding: '9px 8px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', border: '1.5px solid', borderColor: visitForm.duration === d ? '#1B8DB3' : '#E0E6EB', background: visitForm.duration === d ? '#EBF6FB' : '#fff', color: visitForm.duration === d ? '#1B8DB3' : '#666' }}>
                      {d} min
                    </button>
                  ))}
                </div>
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Service Type</label>
                <select style={S.input} value={visitForm.service} onChange={e => setVisitForm(f => ({ ...f, service: e.target.value }))}>
                  <option>{visitForm.duration}-min Stretch Session</option>
                  <option>{visitForm.duration}-min Massage</option>
                  <option>{visitForm.duration}-min Combo</option>
                </select>
              </div>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Rate</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                {rateOptions.map(r => (
                  <button key={r.key} type="button" onClick={() => setVisitForm(f => ({ ...f, rateType: r.key, rateCharged: String(r.amount) }))} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', border: '1.5px solid', borderColor: visitForm.rateType === r.key ? '#1B8DB3' : '#E0E6EB', background: visitForm.rateType === r.key ? '#EBF6FB' : '#fff', color: visitForm.rateType === r.key ? '#1B8DB3' : '#666' }}>
                    {r.label} {r.amount > 0 ? `$${r.amount}` : ''}
                  </button>
                ))}
              </div>
              <input type="number" style={S.input} value={visitForm.rateCharged} onChange={e => setVisitForm(f => ({ ...f, rateCharged: e.target.value }))} placeholder="Custom amount" />
            </div>
            <div style={S.formRow}>
              <div style={S.formGroup}>
                <label style={S.label}>Therapist</label>
                <input style={S.input} value={visitForm.therapist} onChange={e => setVisitForm(f => ({ ...f, therapist: e.target.value }))} placeholder="Staff name" />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Notes</label>
                <input style={S.input} value={visitForm.notes} onChange={e => setVisitForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional" />
              </div>
            </div>
            <button onClick={logVisit} style={{ ...S.btnPrimary, width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }}>
              ✓ Log Visit
            </button>
          </div>
        </div>
      )}

      {/* Visit Log — all visits, editable */}
      {visitTab === 'history' && (
        <div>
          {loadingVisits ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading visit log…</div>
          ) : allVisits.length === 0 ? (
            <div style={{ ...S.card, textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
              <div style={{ fontSize: 14, color: '#888' }}>No visits logged yet</div>
            </div>
          ) : (
            <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
              <table style={S.table}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #F8FAFB, #F0F4F7)' }}>
                    <th style={S.th}>Name</th><th style={S.th}>Service</th><th style={S.th}>Rate</th><th style={S.th}>Therapist</th><th style={S.th}>Date</th><th style={S.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {allVisits.map(v => (
                    editingVisit === String(v._id) ? (
                      <tr key={String(v._id)} style={{ background: '#FFFBEB' }}>
                        <td style={S.td} colSpan={6}>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', padding: '6px 0' }}>
                            <input style={{ ...S.input, width: 140 }} value={editForm.memberName} onChange={e => setEditForm(f => ({ ...f, memberName: e.target.value }))} placeholder="Name" />
                            <select style={{ ...S.input, width: 110 }} value={editForm.duration} onChange={e => setEditForm(f => ({ ...f, duration: e.target.value, service: `${e.target.value}-min Stretch Session` }))}>
                              <option value="25">25 min</option>
                              <option value="50">50 min</option>
                            </select>
                            <input style={{ ...S.input, width: 160 }} value={editForm.service} onChange={e => setEditForm(f => ({ ...f, service: e.target.value }))} placeholder="Service" />
                            <input type="number" style={{ ...S.input, width: 90 }} value={editForm.rateCharged} onChange={e => setEditForm(f => ({ ...f, rateCharged: e.target.value }))} placeholder="Rate" />
                            <input style={{ ...S.input, width: 110 }} value={editForm.therapist} onChange={e => setEditForm(f => ({ ...f, therapist: e.target.value }))} placeholder="Therapist" />
                            <button onClick={saveEdit} style={{ ...S.btnSm, background: '#1B8DB3', color: '#fff', border: 'none' }}>Save</button>
                            <button onClick={() => { setEditingVisit(null); setEditForm(null); }} style={S.btnSm}>Cancel</button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={String(v._id)} style={{ borderBottom: '0.5px solid #f0f0f0' }}>
                        <td style={{ ...S.td, fontWeight: 600 }}>{v.memberName}</td>
                        <td style={{ ...S.td, fontSize: 12, color: '#666' }}>{v.service}</td>
                        <td style={{ ...S.td, fontSize: 13, fontWeight: 700, color: '#1B8DB3' }}>${v.rateCharged}</td>
                        <td style={{ ...S.td, fontSize: 12, color: '#888' }}>{v.therapist || '—'}</td>
                        <td style={{ ...S.td, fontSize: 11, color: '#aaa' }}>{new Date(v.visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {new Date(v.visitDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</td>
                        <td style={S.td}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <span style={S.alink} onClick={() => startEdit(v)}>Edit</span>
                            <span style={{ ...S.alink, color: '#A32D2D' }} onClick={() => deleteVisit(v._id)}>Delete</span>
                          </div>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Visitor Roster */}
      {visitTab === 'roster' && (
        <div>
          {ogMembers.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#92400E', marginBottom: 10 }}>⭐ OGs <span style={{ fontSize: 12, fontWeight: 400, color: '#aaa' }}>Long-time loyalists</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ogMembers.map(m => (
                  <div key={String(m._id)} onClick={() => viewMember(m, 'walkins')} style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF9E7)', border: '1px solid #FDE68A', borderLeft: '3px solid #92400E', borderRadius: 10, padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #FDE68A, #FCD34D)', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{ini(m)}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#92400E' }}>⭐ {fullName(m)}</div>
                        <div style={{ fontSize: 11, color: '#A16207' }}>{m.email || m.phone || 'No contact info'}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: '#A16207' }}>{m.totalVisits ? `${m.totalVisits} visits` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {frequentVisitors.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#7C3AED', marginBottom: 10 }}>🔄 Frequent Visitors <span style={{ fontSize: 12, fontWeight: 400, color: '#aaa' }}>Regulars, no commitment</span></div>
              <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                <table style={S.table}>
                  <thead><tr style={{ background: '#FAF5FF' }}><th style={S.th}>Name</th><th style={S.th}>Contact</th><th style={S.th}>Visits</th><th style={S.th}>Last Visit</th><th style={S.th}></th></tr></thead>
                  <tbody>
                    {frequentVisitors.map(m => (
                      <tr key={String(m._id)} style={{ borderBottom: '0.5px solid #f0f0f0' }}>
                        <td style={S.td}><div style={{ fontWeight: 600 }}>{fullName(m)}</div></td>
                        <td style={{ ...S.td, fontSize: 11, color: '#888' }}>{m.email || m.phone || '—'}</td>
                        <td style={{ ...S.td, fontSize: 13, fontWeight: 700, color: '#7C3AED' }}>{m.totalVisits || '—'}</td>
                        <td style={{ ...S.td, fontSize: 11, color: '#888' }}>{m.daysSinceLastAppt != null ? `${m.daysSinceLastAppt}d ago` : '—'}</td>
                        <td style={S.td}><span style={S.alink} onClick={() => viewMember(m, 'walkins')}>View →</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {walkIns.length > 0 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#4338CA', marginBottom: 10 }}>🚶 Walk-ins <span style={{ fontSize: 12, fontWeight: 400, color: '#aaa' }}>One-offs & new faces</span></div>
              <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                <table style={S.table}>
                  <thead><tr style={{ background: '#EEF2FF' }}><th style={S.th}>Name</th><th style={S.th}>Contact</th><th style={S.th}>Last Visit</th><th style={S.th}></th></tr></thead>
                  <tbody>
                    {walkIns.map(m => (
                      <tr key={String(m._id)} style={{ borderBottom: '0.5px solid #f0f0f0' }}>
                        <td style={S.td}><div style={{ fontWeight: 600 }}>{fullName(m)}</div></td>
                        <td style={{ ...S.td, fontSize: 11, color: '#888' }}>{m.email || m.phone || '—'}</td>
                        <td style={{ ...S.td, fontSize: 11, color: '#888' }}>{m.daysSinceLastAppt != null ? `${m.daysSinceLastAppt}d ago` : '—'}</td>
                        <td style={S.td}><span style={S.alink} onClick={() => viewMember(m, 'walkins')}>View →</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {visitors.length === 0 && (
            <div style={{ ...S.card, textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
              <div style={{ fontSize: 14, color: '#888' }}>No visitors in the system yet</div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>Use the Add Visitor tab to add OGs and regulars</div>
            </div>
          )}
        </div>
      )}

      {/* Add Visitor */}
      {visitTab === 'add' && (
        <div style={{ maxWidth: 520 }}>
          {visitorAdded && (
            <div style={{ background: '#E1F5EE', border: '1px solid #9FE1CB', color: '#0F6E56', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>
              ✓ Visitor added!
            </div>
          )}
          <div style={S.card}>
            <div style={S.cardTitle}>Add Visitor to System</div>
            <div style={S.formRow}>
              <div style={S.formGroup}><label style={S.label}>First name</label><input style={S.input} value={addVisitorForm.firstName} onChange={e => setAddVisitorForm(f => ({ ...f, firstName: e.target.value }))} placeholder="John" /></div>
              <div style={S.formGroup}><label style={S.label}>Last name</label><input style={S.input} value={addVisitorForm.lastName} onChange={e => setAddVisitorForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Smith" /></div>
            </div>
            <div style={S.formRow}>
              <div style={S.formGroup}><label style={S.label}>Email</label><input style={S.input} type="email" value={addVisitorForm.email} onChange={e => setAddVisitorForm(f => ({ ...f, email: e.target.value }))} placeholder="john@email.com" /></div>
              <div style={S.formGroup}><label style={S.label}>Phone</label><input style={S.input} value={addVisitorForm.phone} onChange={e => setAddVisitorForm(f => ({ ...f, phone: e.target.value }))} placeholder="(617) 555-0100" /></div>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Category</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { key: 'walkin', label: '🚶 Walk-in', color: '#4338CA' },
                  { key: 'frequent', label: '🔄 Frequent', color: '#7C3AED' },
                  { key: 'og', label: '⭐ OG', color: '#92400E' },
                ].map(c => (
                  <button key={c.key} onClick={() => setAddVisitorForm(f => ({ ...f, status: c.key }))} style={{ flex: 1, padding: '10px 8px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', border: '1.5px solid', borderColor: addVisitorForm.status === c.key ? c.color : '#E0E6EB', background: addVisitorForm.status === c.key ? c.color + '15' : '#fff', color: addVisitorForm.status === c.key ? c.color : '#666' }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={S.formGroup}><label style={S.label}>Notes</label><textarea style={{ ...S.input, resize: 'vertical' }} rows={2} value={addVisitorForm.notes} onChange={e => setAddVisitorForm(f => ({ ...f, notes: e.target.value }))} placeholder="How they found us, preferences, etc." /></div>
            <button onClick={addVisitor} style={{ ...S.btnPrimary, width: '100%', justifyContent: 'center', padding: '11px', fontSize: 14 }}>
              Add to System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MemberDetail({ member, members, packages, flags, nav, detailBack, updateMember, removeMember, resolveFlag, setFlagForm, setShowFlagModal, styles: S }) {
  const [editingPkg, setEditingPkg] = useState(false);
  const [newPkg, setNewPkg] = useState(member.pkg || '');

  const m = member;
  const mf = flags.filter(f => !f.resolved && String(f.memberId) === String(m._id));
  const pkg = packages.find(p => p.name === m.pkg);

  async function savePkg() {
    await updateMember(m, { pkg: newPkg, status: newPkg ? 'active' : m.status });
    setEditingPkg(false);
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button style={S.btnSm} onClick={() => nav(detailBack)}><i className="ti ti-arrow-left" />Back</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, background: '#fff', borderRadius: 12, padding: '20px', border: '1px solid #E8ECF0' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1B8DB3, #0d6a8a)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>
          {((m.firstName||'?')[0] + (m.lastName||'?')[0]).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{m.firstName} {m.lastName}</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{m.email} · {m.phone}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <StatusBadge status={m.status} />
            {mf.map((f, i) => <FlagPill key={i} reason={f.reason} />)}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div style={S.card}>
          <div style={S.cardTitle}>Membership</div>
          <div style={{ ...S.detailRow, alignItems: 'center' }}>
            <span style={{ color: '#888' }}>Package</span>
            {editingPkg ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <select value={newPkg} onChange={e => setNewPkg(e.target.value)} style={{ ...S.input, fontSize: 12, padding: '4px 8px', width: 'auto' }}>
                  <option value="">No package</option>
                  {packages.map((p, i) => <option key={i} value={p.name}>{p.name}</option>)}
                </select>
                <button onClick={savePkg} style={{ ...S.btnSm, background: '#1B8DB3', color: '#fff', border: 'none' }}>Save</button>
                <button onClick={() => setEditingPkg(false)} style={S.btnSm}>✕</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>{m.pkg || '—'}</span>
                <button onClick={() => setEditingPkg(true)} style={{ ...S.btnSm, fontSize: 10, padding: '2px 7px', color: '#1B8DB3', borderColor: '#B5D4E4' }}>Change</button>
              </div>
            )}
          </div>
          {pkg && <div style={S.detailRow}><span style={{ color: '#888' }}>Sessions</span><span>{pkg.sessions} × 25 min/mo</span></div>}
          {pkg && <div style={S.detailRow}><span style={{ color: '#888' }}>Rate</span><span style={{ fontWeight: 600, color: '#1B8DB3' }}>${pkg.price}/mo</span></div>}
          <div style={S.detailRow}><span style={{ color: '#888' }}>Next billing</span><span>{m.billing || '—'}</span></div>
          <div style={S.detailRow}><span style={{ color: '#888' }}>Card on file</span><span>···· {m.card || '????'}</span></div>
          {m.daysSinceLastAppt != null && <div style={S.detailRow}><span style={{ color: '#888' }}>Last visit</span><span style={{ color: m.daysSinceLastAppt > 90 ? '#A32D2D' : '#444' }}>{m.daysSinceLastAppt}d ago</span></div>}
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Notes & Flags</div>
          <div style={{ fontSize: 12, color: '#666', lineHeight: 1.7, marginBottom: 12 }}>{m.notes || 'No notes on file.'}</div>
          {mf.length > 0 ? mf.map(f => (
            <div key={String(f._id)} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FlagPill reason={f.reason} />
                <span style={{ color: '#1D9E75', cursor: 'pointer', fontSize: 11 }} onClick={() => resolveFlag(f)}>Resolve</span>
              </div>
              {f.note && <div style={{ background: '#f5f5f5', borderRadius: 6, padding: '5px 9px', fontSize: 11, color: '#666', marginTop: 4 }}>{f.note}</div>}
            </div>
          )) : <div style={{ fontSize: 11, color: '#aaa' }}>No open flags.</div>}
          <button style={{ ...S.btnSm, marginTop: 12 }} onClick={() => { setFlagForm({ memberId: String(m._id), reason: 'card', note: '' }); setShowFlagModal(true); }}>
            <i className="ti ti-flag" />Add flag
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button style={S.btnSm} onClick={() => updateMember(m, { status: 'active' })}><i className="ti ti-check" />Mark active</button>
        <button style={S.btnSm} onClick={() => updateMember(m, { status: 'paused' })}><i className="ti ti-pause" />Pause</button>
        <button style={{ ...S.btnSm, color: '#92400E', borderColor: '#FDE68A' }} onClick={() => updateMember(m, { status: 'og' })}>⭐ Mark OG</button>
        <button style={{ ...S.btnSm, color: '#7C3AED', borderColor: '#E9D5FF' }} onClick={() => updateMember(m, { status: 'frequent' })}>🔄 Frequent Visitor</button>
        <button style={{ ...S.btnSm, color: '#A32D2D', borderColor: '#F7C1C1' }} onClick={() => removeMember(m)}><i className="ti ti-trash" />Remove</button>
      </div>
    </div>
  );
}

const styles = {
  app: { display: 'flex', height: '100vh', background: '#F4F7FA', fontFamily: 'system-ui, sans-serif', color: '#1a1a1a' },
  sidebar: { width: 216, minWidth: 216, background: '#fff', borderRight: '1px solid #E8ECF0', display: 'flex', flexDirection: 'column', height: '100vh', boxShadow: '2px 0 8px rgba(0,0,0,0.04)' },
  logo: { padding: '14px', borderBottom: '1px solid #1570A0', background: 'linear-gradient(135deg, #1B8DB3, #0d6a8a)' },
  logoName: { fontSize: 15, fontWeight: 900, fontStyle: 'italic', color: '#1B8DB3', textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: 1.1 },
  logoSub: { fontSize: 7, color: '#1B8DB3', marginTop: 3, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 },
  navItem: { display: 'flex', alignItems: 'center', gap: 9, padding: '9px 18px', fontSize: 13, cursor: 'pointer', color: '#666', borderLeft: '3px solid transparent', transition: 'all .12s' },
  navItemActive: { background: 'linear-gradient(90deg, #EBF6FB, #F4FAFD)', color: '#1B8DB3', borderLeftColor: '#1B8DB3', fontWeight: 600 },
  navBadge: { marginLeft: 'auto', background: '#FCEBEB', color: '#A32D2D', borderRadius: 10, fontSize: 10, padding: '1px 6px', fontWeight: 600 },
  navSection: { fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em', color: '#bbb', padding: '.75rem 18px .3rem', marginTop: '.25rem' },
  sidebarFooter: { padding: '14px 18px', borderTop: '1px solid #E8ECF0' },
  main: { flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' },
  pageHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' },
  pageTitle: { fontSize: 20, fontWeight: 800, color: '#1a1a1a' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: '1.25rem' },
  card: { background: '#fff', border: '1px solid #E8ECF0', borderRadius: 12, padding: '16px 18px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  cardTitle: { fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center' },
  flagRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #f3f3f3' },
  table: { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' },
  th: { textAlign: 'left', fontWeight: 700, fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: '.05em', padding: '10px 12px', borderBottom: '1px solid #E8ECF0' },
  td: { padding: '10px 12px', verticalAlign: 'middle' },
  avatar: { width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #D6EEF7, #B5D4E4)', color: '#1B8DB3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 },
  input: { fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#1a1a1a', background: '#F8FAFB', border: '1px solid #E0E6EB', borderRadius: 8, padding: '8px 10px', width: '100%', outline: 'none', boxSizing: 'border-box' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 },
  label: { fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: '1px solid #E0E6EB', background: '#fff', color: '#555', fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontWeight: 600 },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #1B8DB3, #0d6a8a)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontWeight: 700, boxShadow: '0 2px 8px rgba(27,141,179,0.25)' },
  btnSm: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, border: '1px solid #E0E6EB', background: '#fff', color: '#555', fontSize: 11, cursor: 'pointer', fontFamily: 'system-ui, sans-serif' },
  alink: { color: '#1B8DB3', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  tabs: { display: 'flex', gap: 2, marginBottom: 16, background: '#F0F4F7', padding: 3, borderRadius: 8, width: 'fit-content' },
  tab: { padding: '6px 16px', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: '#888', fontWeight: 500 },
  tabActive: { background: '#fff', color: '#1B8DB3', fontWeight: 700, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  empty: { fontSize: 13, color: '#bbb', padding: '16px 0', textAlign: 'center' },
  detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '7px 0', borderBottom: '0.5px solid #F0F0F0' },
  searchDrop: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #E0E6EB', borderRadius: 10, zIndex: 200, maxHeight: 220, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
  searchItem: { padding: '9px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '0.5px solid #F5F5F5' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' },
  modal: { background: '#fff', borderRadius: 14, padding: '1.5rem', width: 460, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
};
