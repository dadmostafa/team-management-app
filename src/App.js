import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent,
  CardActions, Button, TextField, Box, Chip, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from '@mui/icons-material/Groups';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';

function TeamCard({ team, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...team });

  const handleSave = () => {
    onEdit(team.name, form);
    setEditing(false);
  };

  if (editing) {
    return (
      <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            Edit Team
          </Typography>
          <TextField fullWidth label="Team Name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Location" value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Members" type="number" value={form.members}
            onChange={e => setForm({ ...form, members: parseInt(e.target.value) })}
            sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Team Lead" value={form.lead}
            onChange={e => setForm({ ...form, lead: e.target.value })}
            sx={{ mb: 2 }} size="small" />
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" onClick={handleSave}>Save</Button>
          <Button size="small" onClick={() => setEditing(false)}>Cancel</Button>
        </CardActions>
      </Card>
    );
  }

  return (
    <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
          {team.name}
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">{team.location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <GroupsIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">{team.members} members</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">{team.lead}</Typography>
        </Box>
        <Chip label={team.location === 'Remote' ? 'Remote' : 'On-site'}
          color={team.location === 'Remote' ? 'success' : 'primary'}
          size="small" />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={() => setEditing(true)}>Edit</Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />}
          onClick={() => onDelete(team.name)}>Delete</Button>
      </CardActions>
    </Card>
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

  const handleEdit = (oldName, updatedTeam) => {
  fetch(`http://127.0.0.1:8000/teams/${oldName}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTeam),
  }).then(() => fetchTeams());
};

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1a1a2e' }}>
        <Toolbar>
          <GroupsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
            ACME Inc. — Team Management
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? 'outlined' : 'text'}
          >
            {showForm ? 'Cancel' : 'Add Team'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>

        {showForm && (
          <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>New Team</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Team Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Number of Members" type="number" value={form.members} onChange={e => setForm({ ...form, members: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Team Lead" value={form.lead} onChange={e => setForm({ ...form, lead: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" sx={{ backgroundColor: '#1a1a2e' }} onClick={handleAdd}>
                  Save Team
                </Button>
              </Grid>
            </Grid>
          </Card>
        )}
<Grid container spacing={3} sx={{ mb: 4 }}>
  <Grid item xs={12} sm={4}>
    <Card elevation={2} sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
      <Typography variant="h3" fontWeight="bold" color="primary">{teams.length}</Typography>
      <Typography color="text.secondary">Total Teams</Typography>
    </Card>
  </Grid>
  <Grid item xs={12} sm={4}>
    <Card elevation={2} sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
      <Typography variant="h3" fontWeight="bold" color="primary">
        {teams.reduce((sum, t) => sum + t.members, 0)}
      </Typography>
      <Typography color="text.secondary">Total Members</Typography>
    </Card>
  </Grid>
  <Grid item xs={12} sm={4}>
    <Card elevation={2} sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
      <Typography variant="h3" fontWeight="bold" color="success.main">
        {teams.filter(t => t.location === 'Remote').length}
      </Typography>
      <Typography color="text.secondary">Remote Teams</Typography>
    </Card>
  </Grid>
</Grid>
        <TextField
          fullWidth
          placeholder="Search by team name or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 4, backgroundColor: 'white', borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Typography>Loading teams...</Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map(team => (
              <Grid item xs={12} sm={6} md={4} key={team.name}>
                <TeamCard team={team} onDelete={handleDelete} onEdit={handleEdit} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default App;