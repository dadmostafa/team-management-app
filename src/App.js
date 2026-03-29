import React, { useState, useEffect } from 'react';

function TeamCard({ team, onDelete }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.teamName}>{team.name}</h2>
      <p style={styles.detail}>📍 {team.location}</p>
      <p style={styles.detail}>👥 {team.members} members</p>
      <p style={styles.detail}>🧑‍💼 Lead: {team.lead}</p>
      <button style={styles.deleteBtn} onClick={() => onDelete(team.name)}>
        Delete
      </button>
    </div>
  );
}

function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', location: '', members: '', lead: '' });
  const [showForm, setShowForm] = useState(false);

  const fetchTeams = () => {
    fetch("http://127.0.0.1:8000/teams")
      .then(res => res.json())
      .then(data => {
        setTeams(data.teams);
        setLoading(false);
      });
  };

  useEffect(() => { fetchTeams(); }, []);

  const handleAdd = () => {
    fetch("http://127.0.0.1:8000/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, members: parseInt(form.members) }),
    }).then(() => {
      fetchTeams();
      setForm({ name: '', location: '', members: '', lead: '' });
      setShowForm(false);
    });
  };

  const handleDelete = (teamName) => {
    fetch(`http://127.0.0.1:8000/teams/${teamName}`, { method: "DELETE" })
      .then(() => fetchTeams());
  };

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Team Management App</h1>
      <p style={styles.subtitle}>ACME Inc. — Team Directory</p>

      <div style={styles.toolbar}>
        <input
          style={styles.search}
          placeholder="Search by name or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Team'}
        </button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <h3 style={{ marginBottom: '12px' }}>New Team</h3>
          <input style={styles.input} placeholder="Team name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input style={styles.input} placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          <input style={styles.input} placeholder="Number of members" value={form.members} onChange={e => setForm({ ...form, members: e.target.value })} />
          <input style={styles.input} placeholder="Team lead name" value={form.lead} onChange={e => setForm({ ...form, lead: e.target.value })} />
          <button style={styles.addBtn} onClick={handleAdd}>Save Team</button>
        </div>
      )}

      {loading ? <p>Loading teams...</p> : (
        <div style={styles.grid}>
          {filtered.map(team => (
            <TeamCard key={team.name} team={team} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  header: { color: '#1a1a2e', fontSize: '2rem', marginBottom: '4px' },
  subtitle: { color: '#555', marginBottom: '24px' },
  toolbar: { display: 'flex', gap: '12px', marginBottom: '24px' },
  search: { flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  addBtn: { padding: '10px 20px', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  form: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  input: { display: 'block', width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  grid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '260px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  teamName: { color: '#1a1a2e', marginBottom: '12px' },
  detail: { color: '#444', margin: '6px 0', fontSize: '0.95rem' },
  deleteBtn: { marginTop: '12px', padding: '6px 14px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default App;