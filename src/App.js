import React, { useState, useEffect } from 'react';

function TeamCard({ team }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.teamName}>{team.name}</h2>
      <p style={styles.detail}>📍 {team.location}</p>
      <p style={styles.detail}>👥 {team.members} members</p>
      <p style={styles.detail}>🧑‍💼 Lead: {team.lead}</p>
    </div>
  );
}

function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/teams")
      .then(res => res.json())
      .then(data => {
        setTeams(data.teams);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Team Management App</h1>
      <p style={styles.subtitle}>ACME Inc. — Team Directory</p>
      {loading ? <p>Loading teams...</p> : (
        <div style={styles.grid}>
          {teams.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  header: { color: '#1a1a2e', fontSize: '2rem', marginBottom: '4px' },
  subtitle: { color: '#555', marginBottom: '32px' },
  grid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '260px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  teamName: { color: '#1a1a2e', marginBottom: '12px' },
  detail: { color: '#444', margin: '6px 0', fontSize: '0.95rem' },
};
