import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent,
  CardActions, Button, TextField, Box, Chip, InputAdornment, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, FormControlLabel, Switch, Select, MenuItem,
  InputLabel, FormControl, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from '@mui/icons-material/Groups';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';


const theme = createTheme({
  palette: {
    primary: { main: '#6C63FF' },
    secondary: { main: '#FF6584' },
    background: { default: '#F0F4FF' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(108, 99, 255, 0.1)',
        },
      },
    },
  },
});

const API = 'https://9sb0c46a2c.execute-api.us-east-1.amazonaws.com';
const MotionCard = motion(Card);
const MotionBox = motion(Box);

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    fetch('https://9sb0c46a2c.execute-api.us-east-1.amazonaws.com/login', { method: 'POST', body: formData })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.role);
        onLogin(data.role);
      })
      .catch(() => setError('Invalid username or password'));
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <MotionBox
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ width: '100%', maxWidth: 420, px: 2 }}
      >
        <Card elevation={0} sx={{ p: 4, borderRadius: 4, backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.95)' }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Box sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', borderRadius: '50%', p: 2, mb: 2 }}>
              <LockOutlinedIcon sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            <Typography variant="h4" fontWeight="800" sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ACME Inc.
            </Typography>
            <Typography color="text.secondary" mt={0.5}>Team Management Portal</Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <TextField fullWidth label="Username" value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
            sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
            sx={{ mb: 3 }} />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button fullWidth variant="contained" size="large"
              sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', py: 1.5, fontSize: '1rem' }}
              onClick={handleLogin}>
              Sign In
            </Button>
          </motion.div>
          <Box mt={2} p={2} sx={{ backgroundColor: '#F0F4FF', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Admin: admin / admin123 — Manager: manager / manager123 — Contributor: contributor / contributor123 — Viewer: viewer / viewer123
            </Typography>
          </Box>
        </Card>
      </MotionBox>
    </Box>
  );
}

function StatCard({ value, label, color }) {
  return (
    <MotionCard
      elevation={0}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(108,99,255,0.15)' }}
      transition={{ duration: 0.2 }}
      sx={{ textAlign: 'center', p: 2 }}
    >
      <Typography variant="h3" fontWeight="800" sx={{ color }}>{value}</Typography>
      <Typography color="text.secondary" fontWeight={500}>{label}</Typography>
    </MotionCard>
  );
}

function TeamDetailPage({ team, role, onBack }) {
  const token = localStorage.getItem('token');
  const [members, setMembers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState('members');
  const [showForm, setShowForm] = useState(false);
  const [showAchieveForm, setShowAchieveForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', location: '', is_lead: false, is_direct_staff: true });
  const [achieveForm, setAchieveForm] = useState({ title: '', description: '', month: '', year: 2026 });

  const fetchMembers = () => {
    fetch(`https://9sb0c46a2c.execute-api.us-east-1.amazonaws.com/teams/${team.name}/members`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(data => setMembers(data.members || []));
  };

  const fetchAchievements = () => {
    fetch(`https://9sb0c46a2c.execute-api.us-east-1.amazonaws.com/teams/${team.name}/achievements`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(data => setAchievements(data.achievements || []));
  };

  useEffect(() => { fetchMembers(); fetchAchievements(); }, []);

  const handleAddMember = () => {
    fetch(`https://9sb0c46a2c.execute-api.us-east-1.amazonaws.com/teams/${team.name}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    }).then(() => { fetchMembers(); setForm({ name: '', role: '', location: '', is_lead: false, is_direct_staff: true }); setShowForm(false); });
  };

  const handleDeleteMember = (memberName) => {
    fetch(`https://9sb0c46a2c.execute-api.us-east-1.amazonaws.com/teams/${team.name}/members/${memberName}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
    }).then(() => fetchMembers());
  };

  const handleAddAchievement = () => {
    fetch(`https://9sb0c46a2c.execute-api.us-east-1.amazonaws.com/teams/${team.name}/achievements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(achieveForm),
    }).then(() => { fetchAchievements(); setAchieveForm({ title: '', description: '', month: '', year: 2026 }); setShowAchieveForm(false); });
  };

  const coLocated = Array.isArray(members) ? members.filter(m => m.location === team.location).length : 0;
  const nonDirectLeads = Array.isArray(members) ? members.filter(m => m.is_lead && !m.is_direct_staff).length : 0;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#F0F4FF' }}>
        <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)' }}>
          <Toolbar>
            <IconButton color="inherit" onClick={onBack} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <GroupsIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>{team.name}</Typography>
            <Button color="inherit" variant={activeTab === 'members' ? 'outlined' : 'text'}
              onClick={() => setActiveTab('members')} sx={{ mr: 1, borderColor: 'rgba(255,255,255,0.5)' }}>
              Members
            </Button>
            <Button color="inherit" variant={activeTab === 'achievements' ? 'outlined' : 'text'}
              onClick={() => setActiveTab('achievements')} sx={{ mr: 1, borderColor: 'rgba(255,255,255,0.5)' }}
              startIcon={<EmojiEventsIcon />}>
              Achievements
            </Button>
            {role === 'admin' && activeTab === 'members' && members.length > 0 && (
              <Button color="inherit" onClick={() => {
                const newLead = prompt('Enter new team lead name:');
                if (newLead) {
                  fetch(`https://9sb0c46a2c.execute-api.us-east-1.amazonaws.com/teams/${team.name}/lead`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ lead: newLead })
                  }).then(() => fetchMembers());
                }
              }}>
                Change Lead
              </Button>
            )}
            {role === 'admin' && activeTab === 'members' && (
              <Button color="inherit" startIcon={<AddIcon />} onClick={() => setShowForm(!showForm)}>Add Member</Button>
            )}
            {role === 'admin' && activeTab === 'achievements' && (
              <Button color="inherit" startIcon={<AddIcon />} onClick={() => setShowAchieveForm(!showAchieveForm)}>Add Achievement</Button>
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <StatCard value={members.length} label="Total Members" color="#6C63FF" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard value={coLocated} label="Co-located with Team" color="#4CAF50" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard value={nonDirectLeads} label="Non-direct Staff Leads" color="#FF9800" />
            </Grid>
          </Grid>

          {activeTab === 'members' && (
            <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {showForm && role === 'admin' && (
                <Card elevation={0} sx={{ p: 3, mb: 4 }}>
                  <Typography variant="h6" mb={2}>New Member</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Role / Title" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></Grid>
                    <Grid item xs={12} sm={3}><FormControlLabel control={<Switch checked={form.is_lead} onChange={e => setForm({ ...form, is_lead: e.target.checked })} color="primary" />} label="Team Lead" /></Grid>
                    <Grid item xs={12} sm={3}><FormControlLabel control={<Switch checked={form.is_direct_staff} onChange={e => setForm({ ...form, is_direct_staff: e.target.checked })} color="primary" />} label="Direct Staff" /></Grid>
                    <Grid item xs={12}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
                        <Button variant="contained" onClick={handleAddMember} sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}>Save Member</Button>
                      </motion.div>
                    </Grid>
                  </Grid>
                </Card>
              )}
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(108,99,255,0.1)' }}>
                <Table>
                  <TableHead sx={{ background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)' }}>
                    <TableRow>
                      {['Name', 'Role', 'Location', 'Team Lead', 'Direct Staff', role === 'admin' ? 'Actions' : ''].map(h => (
                        <TableCell key={h} sx={{ color: 'white', fontWeight: 700 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!Array.isArray(members) || members.length === 0 ? (
                      <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No members yet — add some!</TableCell></TableRow>
                    ) : (
                      members.map((member, index) => (
                        <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: 'rgba(108,99,255,0.04)' } }}>
                          <TableCell fontWeight={600}>{member.name}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>{member.location}</TableCell>
                          <TableCell><Chip label={member.is_lead ? 'Yes' : 'No'} color={member.is_lead ? 'success' : 'default'} size="small" /></TableCell>
                          <TableCell><Chip label={member.is_direct_staff ? 'Yes' : 'No'} color={member.is_direct_staff ? 'primary' : 'warning'} size="small" /></TableCell>
                          {role === 'admin' && (
                            <TableCell>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteMember(member.name)}>Delete</Button>
                              </motion.div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </MotionBox>
          )}

          {activeTab === 'achievements' && (
            <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {showAchieveForm && role === 'admin' && (
                <Card elevation={0} sx={{ p: 3, mb: 4 }}>
                  <Typography variant="h6" mb={2}>New Achievement</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Title" value={achieveForm.title} onChange={e => setAchieveForm({ ...achieveForm, title: e.target.value })} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Month" value={achieveForm.month} onChange={e => setAchieveForm({ ...achieveForm, month: e.target.value })} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Year" type="number" value={achieveForm.year} onChange={e => setAchieveForm({ ...achieveForm, year: parseInt(e.target.value) })} /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Description" multiline rows={2} value={achieveForm.description} onChange={e => setAchieveForm({ ...achieveForm, description: e.target.value })} /></Grid>
                    <Grid item xs={12}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
                        <Button variant="contained" onClick={handleAddAchievement} sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}>Save Achievement</Button>
                      </motion.div>
                    </Grid>
                  </Grid>
                </Card>
              )}
              <Grid container spacing={3}>
                {achievements.length === 0 ? (
                  <Grid item xs={12}><Typography color="text.secondary" textAlign="center" py={4}>No achievements yet!</Typography></Grid>
                ) : (
                  achievements.map((a, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <MotionCard elevation={0} whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(108,99,255,0.15)' }} transition={{ duration: 0.2 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <EmojiEventsIcon sx={{ color: '#FFD700' }} />
                            <Chip label={`${a.month} ${a.year}`} size="small" sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: 'white' }} />
                          </Box>
                          <Typography variant="h6" fontWeight={700}>{a.title}</Typography>
                          <Typography variant="body2" color="text.secondary" mt={1}>{a.description}</Typography>
                        </CardContent>
                        {role === 'admin' && (
                          <CardActions>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                              <Button size="small" color="error" startIcon={<DeleteIcon />}
                                onClick={() => {
                                  fetch(`https://9sb0c46a2c.execute-api.us-east-1.amazonaws.com/teams/${team.name}/achievements/${a.title}`, {
                                    method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
                                  }).then(() => fetchAchievements());
                                }}>Delete</Button>
                            </motion.div>
                          </CardActions>
                        )}
                      </MotionCard>
                    </Grid>
                  ))
                )}
              </Grid>
            </MotionBox>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

function TeamCard({ team, onDelete, onEdit, onViewMembers, role, onAssignDept }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...team });
  const handleSave = () => { onEdit(team.name, form); setEditing(false); };

  if (editing) {
    return (
      <MotionCard elevation={0} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">Edit Team</Typography>
          <TextField fullWidth label="Team Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Members" type="number" value={form.members} onChange={e => setForm({ ...form, members: parseInt(e.target.value) })} sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Team Lead" value={form.lead} onChange={e => setForm({ ...form, lead: e.target.value })} sx={{ mb: 2 }} size="small" />
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" onClick={handleSave} sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}>Save</Button>
          <Button size="small" onClick={() => setEditing(false)}>Cancel</Button>
        </CardActions>
      </MotionCard>
    );
  }

  return (
    <MotionCard
      elevation={0}
      whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(108,99,255,0.2)' }}
      transition={{ duration: 0.25 }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" fontWeight="800" color="primary">{team.name}</Typography>
          <Chip
            label={team.location === 'Remote' ? 'Remote' : 'On-site'}
            size="small"
            sx={{
              background: team.location === 'Remote' ? 'linear-gradient(135deg, #4CAF50, #8BC34A)' : 'linear-gradient(135deg, #6C63FF, #FF6584)',
              color: 'white', fontWeight: 600
            }}
          />
        </Box>
        {team.department && (
          <Chip
            label={team.department}
            size="small"
            sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: 'white', fontWeight: 600, mb: 1 }}
          />
        )}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <LocationOnIcon fontSize="small" sx={{ color: '#6C63FF' }} />
          <Typography variant="body2" color="text.secondary">{team.location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <GroupsIcon fontSize="small" sx={{ color: '#6C63FF' }} />
          <Typography variant="body2" color="text.secondary">{team.members} members</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon fontSize="small" sx={{ color: '#6C63FF' }} />
          <Typography variant="body2" color="text.secondary">{team.lead}</Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, flexWrap: 'wrap', gap: 1 }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="small" variant="contained"
            sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', boxShadow: '0 4px 12px rgba(108,99,255,0.4)' }}
            onClick={() => onViewMembers(team)}>
            View Team
          </Button>
        </motion.div>
        {role === 'admin' && <>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="small" variant="outlined" color="primary"
              sx={{ boxShadow: '0 2px 8px rgba(108,99,255,0.2)' }}
              onClick={() => setEditing(true)}>
              Edit
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="small" variant="contained" color="error"
              startIcon={<DeleteIcon />}
              sx={{ boxShadow: '0 4px 12px rgba(255,0,0,0.2)' }}
              onClick={() => onDelete(team.name)}>
              Delete
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="small" variant="outlined" color="primary"
              startIcon={<BusinessIcon />}
              sx={{ boxShadow: '0 2px 8px rgba(108,99,255,0.2)' }}
              onClick={() => onAssignDept(team)}>
              {team.department ? 'Change Dept' : 'Add to Dept'}
            </Button>
          </motion.div>
        </>}
      </CardActions>
    </MotionCard>
  );
}

function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', location: '', lead: '', department: '' });
  const [formErrors, setFormErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [newDeptName, setNewDeptName] = useState('');
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [assignDeptTeam, setAssignDeptTeam] = useState(null);
  const [assignDeptValue, setAssignDeptValue] = useState('');
  const token = localStorage.getItem('token');

  const fetchDepartments = () => {
    fetch(`${API}/departments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setDepartments(data.departments || []));
  };

  const fetchTeams = () => {
    fetch(`${API}/teams`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { setTeams(data.teams || []); setLoading(false); });
  };

  useEffect(() => { 
    if (loggedIn) {
        fetchTeams();
        fetchDepartments();
    }
  }, [loggedIn]);

  const handleLogin = (userRole) => { setRole(userRole); setLoggedIn(true); };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setLoggedIn(false);
    setRole('');
    setTeams([]);
    setSelectedTeam(null);
  };

  const validateTeamForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Team name is required";
    if (!form.location.trim()) errors.location = "Location is required";
    if (!form.lead.trim()) errors.lead = "Team lead is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = () => {
    if (!validateTeamForm()) return;
    fetch("https://9sb0c46a2c.execute-api.us-east-1.amazonaws.com/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form }),
    }).then(() => { fetchTeams(); setForm({ name: '', location: '', lead: '', department: '' }); setShowForm(false); });
  };

  const handleDelete = (teamName) => {
    fetch(`https://9sb0c46a2c.execute-api.us-east-1.amazonaws.com/teams/${teamName}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchTeams());
  };

  const handleEdit = (oldName, updatedTeam) => {
    fetch(`https://9sb0c46a2c.execute-api.us-east-1.amazonaws.com/teams/${oldName}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(updatedTeam),
    }).then(() => fetchTeams());
  };

  const filtered = (teams || []).filter(t =>
    (t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase())) &&
    (selectedDept === 'All' || t.department === selectedDept)
  );

  if (!loggedIn) return <ThemeProvider theme={theme}><LoginPage onLogin={handleLogin} /></ThemeProvider>;
  if (selectedTeam) return <ThemeProvider theme={theme}><TeamDetailPage team={selectedTeam} role={role} onBack={() => setSelectedTeam(null)} /></ThemeProvider>;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#F0F4FF' }}>
        <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)' }}>
          <Toolbar>
            <GroupsIcon sx={{ mr: 2 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              ACME Inc. — Team Management
              {selectedDept !== 'All' && (
                <Chip
                  label={`Filtering: ${selectedDept}`}
                  size="small"
                  onDelete={() => setSelectedDept('All')}
                  sx={{ ml: 2, backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 600 }}
                />
              )}
            </Typography>
            <Chip label={role.toUpperCase()} size="small" sx={{ mr: 2, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700 }} />
            {role === 'admin' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button color="inherit" variant="outlined"
                  startIcon={<BusinessIcon />}
                  onClick={() => setShowDeptForm(true)}
                  sx={{ mr: 1, borderColor: 'rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  Departments
                </Button>
              </motion.div>
            )}
            {role === 'admin' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button color="inherit" startIcon={<AddIcon />} onClick={() => setShowForm(!showForm)} sx={{ mr: 1 }}>
                  {showForm ? 'Cancel' : 'Add Team'}
                </Button>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </motion.div>
          </Toolbar>
        </AppBar>

        <Dialog open={showDeptForm} onClose={() => setShowDeptForm(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Manage Departments</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2, mt: 1 }}>
              {departments.map(d => (
                <Box key={d.name} display="flex" justifyContent="space-between" alignItems="center" mb={1}
                  sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#F0F4FF' }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BusinessIcon fontSize="small" sx={{ color: '#6C63FF' }} />
                    <Typography fontWeight={600}>{d.name}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={`${teams.filter(t => t.department === d.name).length} teams`}
                      size="small" color="primary" variant="outlined"
                    />
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button size="small" color="error" variant="contained"
                        sx={{ boxShadow: '0 4px 12px rgba(255,0,0,0.2)' }}
                        onClick={() => {
                          fetch(`${API}/departments/${d.name}`, {
                            method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
                          }).then(() => fetchDepartments());
                        }}>
                        Delete
                      </Button>
                    </motion.div>
                  </Box>
                </Box>
              ))}
            </Box>
            <TextField fullWidth label="New Department Name" value={newDeptName}
              onChange={e => setNewDeptName(e.target.value)} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setShowDeptForm(false)}>Close</Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="contained"
                sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', boxShadow: '0 4px 12px rgba(108,99,255,0.4)' }}
                onClick={() => {
                  if (!newDeptName.trim()) return;
                  fetch(`${API}/departments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ name: newDeptName })
                  }).then(() => { fetchDepartments(); setNewDeptName(''); });
                }}>
                Add Department
              </Button>
            </motion.div>
          </DialogActions>
        </Dialog>

        <Dialog open={!!assignDeptTeam} onClose={() => setAssignDeptTeam(null)} maxWidth="sm" fullWidth>
          <DialogTitle>Assign Department — {assignDeptTeam?.name}</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary" mb={2}>
              Current department: <strong>{assignDeptTeam?.department || 'None'}</strong>
            </Typography>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>Select Department</InputLabel>
              <Select value={assignDeptValue} label="Select Department"
                onChange={e => setAssignDeptValue(e.target.value)}>
                {departments.map(d => (
                  <MenuItem key={d.name} value={d.name}>{d.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAssignDeptTeam(null)}>Cancel</Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="contained"
                sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', boxShadow: '0 4px 12px rgba(108,99,255,0.4)' }}
                onClick={() => {
                  if (!assignDeptValue) return;
                  fetch(`${API}/teams/${assignDeptTeam.name}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ ...assignDeptTeam, department: assignDeptValue })
                  }).then(() => {
                    fetchTeams();
                    setAssignDeptTeam(null);
                    setAssignDeptValue('');
                  });
                }}>
                Assign
              </Button>
            </motion.div>
          </DialogActions>
        </Dialog>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <AnimatePresence>
            {showForm && role === 'admin' && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card elevation={0} sx={{ p: 3, mb: 4 }}>
                  <Typography variant="h6" mb={2}>New Team</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Team Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={!!formErrors.name} helperText={formErrors.name} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} error={!!formErrors.location} helperText={formErrors.location} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Team Lead" value={form.lead} onChange={e => setForm({ ...form, lead: e.target.value })} error={!!formErrors.lead} helperText={formErrors.lead} /></Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Department</InputLabel>
                        <Select value={form.department || ''} label="Department"
                          onChange={e => setForm({ ...form, department: e.target.value })}>
                          {departments.map(d => (
                            <MenuItem key={d.name} value={d.name}>{d.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Department</InputLabel>
                        <Select
                          value={form.department || ''}
                          label="Department"
                          onChange={e => setForm({ ...form, department: e.target.value })}
                        >
                          {departments.map(d => (
                            <MenuItem key={d.name} value={d.name}>{d.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
                        <Button variant="contained" onClick={handleAdd} sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}>Save Team</Button>
                      </motion.div>
                    </Grid>
                  </Grid>
                </Card>
              </MotionBox>
            )}
          </AnimatePresence>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <StatCard value={teams.length} label="Total Teams" color="#6C63FF" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard value={teams.reduce((sum, t) => sum + (t.members || 0), 0)} label="Total Members" color="#6C63FF" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard value={teams.filter(t => t.location === 'Remote').length} label="Remote Teams" color="#4CAF50" />
            </Grid>
          </Grid>

          {departments.length > 0 && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {departments.map(d => (
                <Grid item xs={12} sm={6} md={4} key={d.name}>
                  <MotionCard elevation={4}
                    whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(108,99,255,0.2)' }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedDept(selectedDept === d.name ? 'All' : d.name)}
                    sx={{ cursor: 'pointer', p: 2, border: selectedDept === d.name ? '2px solid #6C63FF' : '1px solid rgba(108,99,255,0.1)' }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <BusinessIcon sx={{ color: '#6C63FF' }} />
                      <Typography fontWeight={700} color="primary">{d.name}</Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <Chip label={`${teams.filter(t => t.department === d.name).length} Teams`} size="small"
                        sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: 'white' }} />
                      <Chip label={`${teams.filter(t => t.department === d.name).reduce((s, t) => s + (t.members || 0), 0)} Members`}
                        size="small" variant="outlined" color="primary" />
                    </Box>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          )}

          <TextField fullWidth placeholder="Search by team name or location..."
            value={search} onChange={e => setSearch(e.target.value)}
            sx={{ mb: 4, backgroundColor: 'white', borderRadius: 3 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#6C63FF' }} /></InputAdornment> }}
          />

          {loading ? (
            <Typography textAlign="center" color="text.secondary">Loading teams...</Typography>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {filtered.map((team, index) => (
                  <Grid item xs={12} sm={6} md={4} key={team.name}>
                    <MotionBox
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <TeamCard team={team} onDelete={handleDelete} onEdit={handleEdit} onViewMembers={setSelectedTeam} role={role} onAssignDept={team => { setAssignDeptTeam(team); setAssignDeptValue(team.department || ''); }} />
                    </MotionBox>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;