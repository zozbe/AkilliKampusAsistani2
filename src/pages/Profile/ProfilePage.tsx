import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Avatar,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Paper,
  Chip,
  Badge,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Alert,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import {
  Person,
  Edit,
  PhotoCamera,
  Email,
  Phone,
  School,
  Work,
  LocationOn,
  Language,
  Notifications,
  Security,
  Palette,
  Settings,
  Save,
  Cancel,
  Badge as BadgeIcon,
  Stars,
  Timeline,
  CalendarToday,
  TrendingUp,
  EmojiEvents,
  ExpandMore,
  LightMode,
  DarkMode,
  VolumeUp,
  VolumeOff,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateUser } from '../../store/slices/authSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAcademic = user?.role === 'staff' || user?.role === 'admin';
  
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: '+90 555 123 4567',
    department: isAcademic ? 'Bilgisayar Mühendisliği' : 'Mühendislik Fakültesi',
    bio: isAcademic ? 'Yazılım geliştirme ve veri bilimi alanında uzman' : 'Bilgisayar mühendisliği öğrencisi',
    location: 'İskenderun, Hatay',
    language: 'tr',
    title: isAcademic ? 'Dr. Öğr. Üyesi' : 'Lisans Öğrencisi'
  });

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      assignments: true,
      grades: true,
      events: true,
      announcements: true
    },
    privacy: {
      profileVisible: true,
      emailVisible: false,
      phoneVisible: false,
      showOnlineStatus: true
    },
    preferences: {
      theme: 'light',
      language: 'tr',
      timezone: 'Europe/Istanbul',
      itemsPerPage: 10
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileUpdate = () => {
    dispatch(updateUser({
      first_name: profileData.first_name,
      last_name: profileData.last_name
    }));
    setEditMode(false);
  };

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  // Örnek istatistikler
  const academicStats = isAcademic ? {
    courses: 8,
    students: 156,
    publications: 23,
    citations: 342
  } : {
    gpa: 3.64,
    completedCourses: 45,
    currentCourses: 6,
    totalCredits: 240
  };

  const achievements = [
    { title: 'Mükemmellik Ödülü', icon: '🏆', date: '2024' },
    { title: 'En İyi Proje', icon: '🥇', date: '2023' },
    { title: 'Yılın Öğrencisi', icon: '⭐', date: '2023' }
  ];

  return (
    <Container maxWidth="xl">
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', fontWeight: 700, mb: 3 }}>
          <Person sx={{ mr: 2, fontSize: 40 }} />
          Profil
        </Typography>

        {/* Profile Summary Card */}
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton 
                      size="small" 
                      sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                      onClick={() => setPhotoDialogOpen(true)}
                    >
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      border: '4px solid white',
                      fontSize: '3rem',
                      bgcolor: 'rgba(255,255,255,0.2)'
                    }}
                  >
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </Avatar>
                </Badge>
              </Grid>
              
              <Grid item xs>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  {profileData.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={user?.role === 'admin' ? 'Yönetici' : user?.role === 'staff' ? 'Akademisyen' : 'Öğrenci'} 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  {user?.student_number && (
                    <Chip 
                      label={`#${user.student_number}`} 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  )}
                  <Chip 
                    label={profileData.department} 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setEditMode(true)}
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  Profili Düzenle
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {Object.entries(academicStats).map(([key, value], index) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                  {typeof value === 'number' ? value : value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  {key === 'gpa' ? 'GPA' :
                   key === 'completedCourses' ? 'Tamamlanan Ders' :
                   key === 'currentCourses' ? 'Mevcut Dersler' :
                   key === 'totalCredits' ? 'Toplam Kredi' :
                   key === 'courses' ? 'Verilen Dersler' :
                   key === 'students' ? 'Öğrenci Sayısı' :
                   key === 'publications' ? 'Yayın Sayısı' :
                   key === 'citations' ? 'Atıf Sayısı' : key}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tabs Section */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Genel Bilgiler" icon={<Person />} />
          <Tab label="Hesap Ayarları" icon={<Settings />} />
          <Tab label="Bildirimler" icon={<Notifications />} />
          <Tab label="Güvenlik" icon={<Security />} />
          <Tab label="Başarılar" icon={<EmojiEvents />} />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} />
                  Kişisel Bilgiler
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ad"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData(prev => ({...prev, first_name: e.target.value}))}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Soyad"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData(prev => ({...prev, last_name: e.target.value}))}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      value={profileData.email}
                      disabled
                      InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} /> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                      disabled={!editMode}
                      InputProps={{ startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} /> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Konum"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                      disabled={!editMode}
                      InputProps={{ startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} /> }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Biyografi"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                      disabled={!editMode}
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>

                {editMode && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleProfileUpdate}
                    >
                      Kaydet
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => setEditMode(false)}
                    >
                      İptal
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Profil Tamamlama
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={85} 
                    sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    85%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Profilinizi %100 tamamlamak için telefon numaranızı ekleyin.
                </Typography>
              </CardContent>
            </Card>

            {/* Son Aktiviteler */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Son Aktiviteler
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Profil güncellendi"
                      secondary="2 saat önce"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Şifre değiştirildi"
                      secondary="1 hafta önce"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Timeline color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Hesap oluşturuldu"
                      secondary="6 ay önce"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Tercihler
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Palette />
                    </ListItemIcon>
                    <ListItemText primary="Tema" secondary="Arayüz görünümü" />
                    <ListItemSecondaryAction>
                      <FormControl size="small">
                        <Select
                          value={settings.preferences.theme}
                          onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                        >
                          <MenuItem value="light">Açık</MenuItem>
                          <MenuItem value="dark">Koyu</MenuItem>
                          <MenuItem value="auto">Otomatik</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText primary="Dil" secondary="Arayüz dili" />
                    <ListItemSecondaryAction>
                      <FormControl size="small">
                        <Select
                          value={settings.preferences.language}
                          onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                        >
                          <MenuItem value="tr">Türkçe</MenuItem>
                          <MenuItem value="en">English</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText primary="Saat Dilimi" secondary="Zaman gösterimi" />
                    <ListItemSecondaryAction>
                      <FormControl size="small">
                        <Select
                          value={settings.preferences.timezone}
                          onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                        >
                          <MenuItem value="Europe/Istanbul">İstanbul</MenuItem>
                          <MenuItem value="UTC">UTC</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Gizlilik
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Visibility />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Profil Görünürlüğü" 
                      secondary="Diğer kullanıcılar profilinizi görebilir" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.privacy.profileVisible}
                        onChange={(e) => handleSettingChange('privacy', 'profileVisible', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText 
                      primary="E-posta Görünürlüğü" 
                      secondary="E-posta adresiniz diğerleri tarafından görülebilir" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.privacy.emailVisible}
                        onChange={(e) => handleSettingChange('privacy', 'emailVisible', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Telefon Görünürlüğü" 
                      secondary="Telefon numaranız diğerleri tarafından görülebilir" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.privacy.phoneVisible}
                        onChange={(e) => handleSettingChange('privacy', 'phoneVisible', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Bildirim Ayarları
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Genel Bildirimler
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText primary="E-posta Bildirimleri" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.email}
                        onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText primary="Push Bildirimleri" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.push}
                        onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText primary="SMS Bildirimleri" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.sms}
                        onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Akademik Bildirimler
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <School />
                    </ListItemIcon>
                    <ListItemText primary="Ödev Bildirimleri" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.assignments}
                        onChange={(e) => handleSettingChange('notifications', 'assignments', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp />
                    </ListItemIcon>
                    <ListItemText primary="Not Bildirimleri" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.grades}
                        onChange={(e) => handleSettingChange('notifications', 'grades', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText primary="Etkinlik Bildirimleri" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.events}
                        onChange={(e) => handleSettingChange('notifications', 'events', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Şifre Değiştir
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Güvenliğiniz için şifrenizi düzenli olarak değiştirin.
                  </Alert>
                  <Button
                    variant="contained"
                    startIcon={<Security />}
                    onClick={() => setChangePasswordDialog(true)}
                  >
                    Şifre Değiştir
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  İki Faktörlü Kimlik Doğrulama
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Hesabınızın güvenliğini artırmak için iki faktörlü kimlik doğrulamayı etkinleştirin.
                </Typography>
                
                <Button variant="outlined" color="success">
                  Etkinleştir
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Son Giriş Aktiviteleri
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Web Tarayıcı - Chrome"
                      secondary="15 Ocak 2024, 14:30 - İstanbul, Türkiye"
                    />
                    <Chip label="Şu anda aktif" color="success" size="small" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Mobil Uygulama - Android"
                      secondary="14 Ocak 2024, 09:15 - İstanbul, Türkiye"
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Web Tarayıcı - Firefox"
                      secondary="12 Ocak 2024, 16:45 - İstanbul, Türkiye"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Başarılar ve Rozetler
                </Typography>
                
                <Grid container spacing={3}>
                  {achievements.map((achievement, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper 
                        sx={{ 
                          p: 3, 
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-4px)' }
                        }}
                      >
                        <Typography variant="h3" sx={{ mb: 1 }}>
                          {achievement.icon}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {achievement.date}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 3 }}>
                  İstatistikler
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50' }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                        {isAcademic ? '156' : '24'}
                      </Typography>
                      <Typography variant="body2">
                        {isAcademic ? 'Toplam Öğrenci' : 'Tamamlanan Proje'}
                      </Typography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50' }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                        {isAcademic ? '8' : '45'}
                      </Typography>
                      <Typography variant="body2">
                        {isAcademic ? 'Aktif Ders' : 'Tamamlanan Ders'}
                      </Typography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50' }}>
                      <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                        {isAcademic ? '23' : '3.64'}
                      </Typography>
                      <Typography variant="body2">
                        {isAcademic ? 'Yayın Sayısı' : 'GPA'}
                      </Typography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'error.50' }}>
                      <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
                        {isAcademic ? '342' : '6'}
                      </Typography>
                      <Typography variant="body2">
                        {isAcademic ? 'Atıf Sayısı' : 'Aktif Ders'}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Photo Upload Dialog */}
      <Dialog open={photoDialogOpen} onClose={() => setPhotoDialogOpen(false)}>
        <DialogTitle>Profil Fotoğrafı Güncelle</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-upload"
              type="file"
            />
            <label htmlFor="photo-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoCamera />}
              >
                Fotoğraf Seç
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialogOpen(false)}>İptal</Button>
          <Button variant="contained">Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordDialog} onClose={() => setChangePasswordDialog(false)}>
        <DialogTitle>Şifre Değiştir</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="Mevcut Şifre"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Yeni Şifre"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Yeni Şifre Tekrar"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordDialog(false)}>İptal</Button>
          <Button 
            variant="contained"
            disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
          >
            Şifreyi Değiştir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage; 