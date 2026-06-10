async function runAutoClean() {
  setAutoCleaning(true);
  const ids = autoInactive.map(m => String(m._id));
  await fetch('/api/members', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, updates: { status: 'inactive' } }),
  });
  setMembers(prev => prev.map(m =>
    autoInactive.find(x => String(x._id) === String(m._id)) ? { ...m, status: 'inactive' } : m
  ));
  setAutoCleaned(true);
  setAutoCleaning(false);
}
