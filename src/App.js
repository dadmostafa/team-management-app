import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent,
  CardActions, Button, TextField, Box, Chip, InputAdornment, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from '@mui/icons-material/Groups';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    fetch('http://127.0.0.1:8001/login', { method: 'POST', body: formData })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.role);
        onLogin(data.role);
      })
      .catch(() => setError('Invalid username or password'));
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card elevation={4} sx={{ p: 4, borderRadius: 3, width: '100%', maxWidth: 400 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <LockOutlinedIcon sx={{ fontSize: 48, color: '#1a1a2e', mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">ACME Inc.</Typography>
          <Typography color="text.secondary">Team Management Portal</Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField fullWidth label="Username" value={username} onChange={e => setUsername(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} sx={{ mb: 3 }} onKeyPress={e => e.key === 'Enter' && handleLogin()} />
        <Button fullWidth variant="contained" size="large" sx={{ backgroundColor: '#1a1a2e' }} onClick={handleLogin}>Sign In</Button>
        <Box mt={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">Admin: admin / admin123 — Viewer: viewer / viewer123</Typography>
        </Box>
      </Card>
    </Box>
  );
}

function TeamDetailPage({ team, role, onBack }) {
  const token = localStorage.getItem('token');
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', location: '', is_lead: false, is_direct_staff: true });

  const fetchMembers = () => {
    fetch(`http://127.0.0.1:8001/teams/${team.name}/members`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMembers(data.members || []));
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleAddMember = () => {
    fetch(`http://127.0.0.1:8001/teams/${team.name}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    }).then(() => {
      fetchMembers();
      setForm({ name: '', role: '', location: '', is_lead: false, is_direct_staff: true });
      setShowForm(false);
    });
  };

  const handleDeleteMember = (memberName) => {
    fetch(`http://127.0.0.1:8001/teams/${team.name}/members/${memberName}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => fetchMembers());
  };

  const coLocated = Array.isArray(members) ? members.filter(m => m.location === team.location).length : 0;
const nonDirectLeads = Array.isArray(members) ? members.filter(m => m.is_lead && !m.is_direct_staff).length : 0;
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1a1a2e' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <GroupsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
            {team.name} — Members
          </Typography>
          {role === 'admin' && (
            <Button color="inherit" startIcon={<AddIcon />} onClick={() => setShowForm(!showForm)}>
              Add Member
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
              <Typography variant="h3" fontWeight="bold" color="primary">{members.length}</Typography>
              <Typography color="text.secondary">Total Members</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
              <Typography variant="h3" fontWeight="bold" color="success.main">{coLocated}</Typography>
              <Typography color="text.secondary">Co-located with Team</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
              <Typography variant="h3" fontWeight="bold" color="warning.main">{nonDirectLeads}</Typography>
              <Typography color="text.secondary">Non-direct Staff Leads</Typography>
            </Card>
          </Grid>
        </Grid>

        {showForm && role === 'admin' && (
          <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>New Member</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Role / Title" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControlLabel control={<Switch checked={form.is_lead} onChange={e => setForm({ ...form, is_lead: e.target.checked })} />} label="Team Lead" />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControlLabel control={<Switch checked={form.is_direct_staff} onChange={e => setForm({ ...form, is_direct_staff: e.target.checked })} />} label="Direct Staff" />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" sx={{ backgroundColor: '#1a1a2e' }} onClick={handleAddMember}>Save Member</Button>
              </Grid>
            </Grid>
          </Card>
        )}

        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1a1a2e' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Team Lead</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Direct Staff</TableCell>
                {role === 'admin' && <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
                {!Array.isArray(members) || members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No members yet — add some!</TableCell>
                  </TableRow>
                ) : (
                  members.map((member, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.location}</TableCell>
                      <TableCell>
                        <Chip label={member.is_lead ? 'Yes' : 'No'} color={member.is_lead ? 'success' : 'default'} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={member.is_direct_staff ? 'Yes' : 'No'} color={member.is_direct_staff ? 'primary' : 'warning'} size="small" />
                      </TableCell>
                      {role === 'admin' && (
                        <TableCell>
                          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteMember(member.name)}>Delete</Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}

function TeamCard({ team, onDelete, onEdit, onViewMembers, role }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...team });

  const handleSave = () => { onEdit(team.name, form); setEditing(false); };

  if (editing) {
    return (
      <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">Edit Team</Typography>
          <TextField fullWidth label="Team Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Members" type="number" value={form.members} onChange={e => setForm({ ...form, members: parseInt(e.target.value) })} sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Team Lead" value={form.lead} onChange={e => setForm({ ...form, lead: e.target.value })} sx={{ mb: 2 }} size="small" />
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
        <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">{team.name}</Typography>
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
        <Chip label={team.location === 'Remote' ? 'Remote' : 'On-site'} color={team.location === 'Remote' ? 'success' : 'primary'} size="small" />
      </CardContent>
      <CardActions>
        <Button size="small" variant="outlined" onClick={() => onViewMembers(team)}>View Members</Button>
        {role === 'admin' && <>
          <Button size="small" color="primary" onClick={() => setEditing(true)}>Edit</Button>
          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(team.name)}>Delete</Button>
        </>}
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
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const token = localStorage.getItem('token');

  const fetchTeams = () => {
    fetch("http://127.0.0.1:8001/teams", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { setTeams(data.teams); setLoading(false); });
  };

  useEffect(() => { if (loggedIn) fetchTeams(); }, [loggedIn]);

  const handleLogin = (userRole) => { setRole(userRole); setLoggedIn(true); };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setLoggedIn(false);
    setRole('');
    setTeams([]);
    setSelectedTeam(null);
  };

  const handleAdd = () => {
    fetch("http://127.0.0.1:8001/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, members: parseInt(form.members) }),
    }).then(() => { fetchTeams(); setForm({ name: '', location: '', members: '', lead: '' }); setShowForm(false); });
  };

  const handleDelete = (teamName) => {
    fetch(`http://127.0.0.1:8001/teams/${teamName}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchTeams());
  };

  const handleEdit = (oldName, updatedTeam) => {
    fetch(`http://127.0.0.1:8001/teams/${oldName}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(updatedTeam),
    }).then(() => fetchTeams());
  };

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase())
  );

  if (!loggedIn) return <LoginPage onLogin={handleLogin} />;

  if (selectedTeam) return (
    <TeamDetailPage team={selectedTeam} role={role} token={token} onBack={() => setSelectedTeam(null)} />
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1a1a2e' }}>
        <Toolbar>
          <GroupsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>ACME Inc. — Team Management</Typography>
          <Chip label={role.toUpperCase()} color="warning" size="small" sx={{ mr: 2 }} />
          {role === 'admin' && (
            <Button color="inherit" startIcon={<AddIcon />} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add Team'}
            </Button>
          )}
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {showForm && role === 'admin' && (
          <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>New Team</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Team Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Number of Members" type="number" value={form.members} onChange={e => setForm({ ...form, members: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Team Lead" value={form.lead} onChange={e => setForm({ ...form, lead: e.target.value })} /></Grid>
              <Grid item xs={12}><Button variant="contained" sx={{ backgroundColor: '#1a1a2e' }} onClick={handleAdd}>Save Team</Button></Grid>
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
              <Typography variant="h3" fontWeight="bold" color="primary">{teams.reduce((sum, t) => sum + t.members, 0)}</Typography>
              <Typography color="text.secondary">Total Members</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
              <Typography variant="h3" fontWeight="bold" color="success.main">{teams.filter(t => t.location === 'Remote').length}</Typography>
              <Typography color="text.secondary">Remote Teams</Typography>
            </Card>
          </Grid>
        </Grid>

        <TextField fullWidth placeholder="Search by team name or location..."
          value={search} onChange={e => setSearch(e.target.value)}
          sx={{ mb: 4, backgroundColor: 'white', borderRadius: 2 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />

        {loading ? <Typography>Loading teams...</Typography> : (
          <Grid container spacing={3}>
            {filtered.map(team => (
              <Grid item xs={12} sm={6} md={4} key={team.name}>
                <TeamCard team={team} onDelete={handleDelete} onEdit={handleEdit} onViewMembers={setSelectedTeam} role={role} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default App;