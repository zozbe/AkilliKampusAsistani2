import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Fab,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from '@mui/material';
import {
  Notifications,
  Add,
  MarkEmailRead,
  MarkEmailUnread,
  Delete,
  DeleteSweep,
  FilterList,
  Search,
  School,
  Assignment,
  Quiz,
  Event,
  Computer,
  Warning,
  Info,
  Error,
  CheckCircle,
  Schedule,
  LocationOn,
  Grade,
  Announcement,
  PersonPin,
  AccessTime,
  ExpandMore,
  Circle
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ders_degisikligi' | 'not_ilani' | 'sinav_duyurusu' | 'etkinlik' | 'sistem' | 'acil' | 'genel';
  priority: 'dusuk' | 'orta' | 'yuksek' | 'acil';
  isRead: boolean;
  date: string;
  time: string;
  sender: string;
  courseCode?: string;
  courseName?: string;
  location?: string;
  newLocation?: string;
  examDate?: string;
  eventDate?: string;
  grade?: string;
  relatedInfo?: string;
}

const NotificationsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAcademic = user?.role === 'staff' || user?.role === 'admin';
  
  // Başlangıç verilerini tanımla
  const getInitialNotifications = (): Notification[] => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        return JSON.parse(savedNotifications);
      } catch (error) {
        console.error('Kaydedilmiş bildirim verileri okunamadı:', error);
      }
    }
    
    // Default veriler
    return [
      {
        id: '1',
        title: 'CSE101 Dersi Sınıf Değişikliği',
        message: 'Programlama Temelleri dersinizin sınıfı A205\'ten B301\'e taşınmıştır. Yeni ders saati aynı kalacaktır.',
        type: 'ders_degisikligi',
        priority: 'yuksek',
        isRead: false,
        date: '2024-01-15',
        time: '14:30',
        sender: 'Dr. Ahmet Yılmaz',
        courseCode: 'CSE101',
        courseName: 'Programlama Temelleri',
        location: 'A205',
        newLocation: 'B301'
      },
      {
        id: '2',
        title: 'MAT201 Vize Notları İlan Edildi',
        message: 'Matematik II dersi vize sınav sonuçları öğrenci bilgi sisteminde yayınlanmıştır. Notunuzu kontrol edebilirsiniz.',
        type: 'not_ilani',
        priority: 'orta',
        isRead: false,
        date: '2024-01-14',
        time: '16:45',
        sender: 'Prof. Dr. Ayşe Demir',
        courseCode: 'MAT201',
        courseName: 'Matematik II',
        grade: 'BB'
      },
      {
        id: '3',
        title: 'Final Sınavı Programı Açıklandı',
        message: 'Web Programlama dersi final sınavı 25 Ocak 2024 Perşembe günü saat 09:00\'da C202 sınıfında yapılacaktır.',
        type: 'sinav_duyurusu',
        priority: 'yuksek',
        isRead: true,
        date: '2024-01-13',
        time: '10:15',
        sender: 'Öğrenci İşleri',
        courseCode: 'CSE301',
        courseName: 'Web Programlama',
        examDate: '25 Ocak 2024 - 09:00',
        location: 'C202'
      },
      {
        id: '4',
        title: 'Teknoversite Günleri 2024',
        message: 'İSTE Teknoversite Günleri 20-22 Mart tarihlerinde düzenlenecektir. Etkinlik programı ve kayıt bilgileri için web sitemizi ziyaret edin.',
        type: 'etkinlik',
        priority: 'orta',
        isRead: true,
        date: '2024-01-12',
        time: '11:20',
        sender: 'Öğrenci Toplulukları',
        eventDate: '20-22 Mart 2024',
        location: 'Kampüs Genel'
      },
      {
        id: '5',
        title: 'Sistem Bakım Bildirimi',
        message: 'Öğrenci Bilgi Sistemi 16 Ocak 2024 Salı günü saat 02:00-06:00 arası bakım nedeniyle erişime kapalı olacaktır.',
        type: 'sistem',
        priority: 'orta',
        isRead: false,
        date: '2024-01-11',
        time: '15:30',
        sender: 'Bilgi İşlem Merkezi',
        relatedInfo: '16 Ocak 2024 - 02:00-06:00'
      },
      {
        id: '6',
        title: 'FİZ102 Lab Dersi İptal',
        message: 'Fizik II laboratuvar dersi öğretim görevlisinin rahatsızlığı nedeniyle bugün iptal edilmiştir. Telafi dersi tarihi duyurulacaktır.',
        type: 'ders_degisikligi',
        priority: 'acil',
        isRead: false,
        date: '2024-01-10',
        time: '08:45',
        sender: 'Dr. Mehmet Kaya',
        courseCode: 'FİZ102',
        courseName: 'Fizik II Laboratuvarı'
      },
      {
        id: '7',
        title: 'Burs Başvuru Sonuçları',
        message: 'Başarı bursu başvuru sonuçları açıklanmıştır. Sonucunuzu öğrenci işleri daire başkanlığından öğrenebilirsiniz.',
        type: 'genel',
        priority: 'yuksek',
        isRead: true,
        date: '2024-01-09',
        time: '13:00',
        sender: 'Öğrenci İşleri Daire Başkanlığı'
      }
    ];
  };

  const [notifications, setNotifications] = useState<Notification[]>(getInitialNotifications);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'genel',
    priority: 'orta'
  });

  // Notifications değiştiğinde localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Notifications localStorage\'a kaydedilemedi:', error);
    }
  }, [notifications]);

  const notificationTypes = {
    ders_degisikligi: 'Ders Değişikliği',
    not_ilani: 'Not İlanı',
    sinav_duyurusu: 'Sınav Duyurusu',
    etkinlik: 'Etkinlik',
    sistem: 'Sistem',
    acil: 'Acil Durum',
    genel: 'Genel'
  };

  const notificationIcons = {
    ders_degisikligi: <School />,
    not_ilani: <Grade />,
    sinav_duyurusu: <Quiz />,
    etkinlik: <Event />,
    sistem: <Computer />,
    acil: <Warning />,
    genel: <Announcement />
  };

  const priorityColors = {
    dusuk: '#4caf50',
    orta: '#ff9800',
    yuksek: '#f44336',
    acil: '#d32f2f'
  };

  const priorityLabels = {
    dusuk: 'Düşük',
    orta: 'Orta',
    yuksek: 'Yüksek',
    acil: 'Acil'
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notification.courseCode && notification.courseCode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'read' && notification.isRead) ||
                         (filterStatus === 'unread' && !notification.isRead);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getNotificationStats = () => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const urgent = notifications.filter(n => n.priority === 'acil' || n.priority === 'yuksek').length;
    const today = notifications.filter(n => n.date === new Date().toISOString().split('T')[0]).length;
    
    return { total, unread, urgent, today };
  };

  const stats = getNotificationStats();

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: false } : notification
    ));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const handleDeleteSelected = () => {
    setNotifications(prev => prev.filter(notification => !selectedNotifications.includes(notification.id)));
    setSelectedNotifications([]);
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.message) {
      return;
    }

    const newNotification: Notification = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      type: formData.type as any,
      priority: formData.priority as any,
      isRead: false,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      sender: `${user?.first_name} ${user?.last_name}`
    };

    setNotifications(prev => [newNotification, ...prev]);
    setOpen(false);
    setFormData({
      title: '',
      message: '',
      type: 'genel',
      priority: 'orta'
    });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge badgeContent={stats.unread} color="error">
        <Notifications sx={{ mr: 2 }} />
          </Badge>
        Bildirimler
      </Typography>
      
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<MarkEmailRead />}
            onClick={handleMarkAllAsRead}
            disabled={stats.unread === 0}
          >
            Tümünü Okundu İşaretle
          </Button>
          {selectedNotifications.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteSweep />}
              onClick={handleDeleteSelected}
            >
              Seçilenleri Sil ({selectedNotifications.length})
            </Button>
          )}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#2196f3', color: 'white' }}>
            <Typography variant="h4">{stats.total}</Typography>
            <Typography variant="body2">Toplam Bildirim</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f44336', color: 'white' }}>
            <Typography variant="h4">{stats.unread}</Typography>
            <Typography variant="body2">Okunmamış</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#ff9800', color: 'white' }}>
            <Typography variant="h4">{stats.urgent}</Typography>
            <Typography variant="body2">Acil/Önemli</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#4caf50', color: 'white' }}>
            <Typography variant="h4">{stats.today}</Typography>
            <Typography variant="body2">Bugün</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Bildirim ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Tür</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                startAdornment={<FilterList sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">Tüm Türler</MenuItem>
                {Object.entries(notificationTypes).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="unread">Okunmamış</MenuItem>
                <MenuItem value="read">Okunmuş</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary" align="center">
              {filteredNotifications.length} bildirim
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Notifications List */}
      <Grid container spacing={2}>
        {filteredNotifications.map((notification) => (
          <Grid item xs={12} key={notification.id}>
            <Accordion>
              <AccordionSummary 
                expandIcon={<ExpandMore />}
                sx={{ 
                  bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                  <Checkbox
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <Avatar sx={{ bgcolor: notification.isRead ? 'grey.400' : priorityColors[notification.priority] }}>
                    {notificationIcons[notification.type]}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: notification.isRead ? 'normal' : 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        {!notification.isRead && (
                          <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                        )}
                        {notification.title}
                      </Typography>
                      <Chip 
                        label={notificationTypes[notification.type]}
                        size="small"
                        variant="outlined"
                      />
                      <Chip 
                        label={priorityLabels[notification.priority]}
                        size="small"
                        sx={{ 
                          bgcolor: priorityColors[notification.priority],
                          color: 'white',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {notification.message}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonPin sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{notification.sender}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{notification.date} - {notification.time}</Typography>
                      </Box>
                      {notification.courseCode && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <School sx={{ fontSize: 16 }} />
                          <Typography variant="caption">{notification.courseCode}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        notification.isRead ? handleMarkAsUnread(notification.id) : handleMarkAsRead(notification.id);
                      }}
                      title={notification.isRead ? 'Okunmadı işaretle' : 'Okundu işaretle'}
                    >
                      {notification.isRead ? <MarkEmailUnread /> : <MarkEmailRead />}
                    </IconButton>
                    <IconButton 
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      title="Sil"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                <Box sx={{ pt: 2 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {notification.message}
                  </Typography>
                  
                  {/* Ders bilgileri */}
                  {(notification.courseCode || notification.courseName) && (
                    <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.50' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <School /> Ders Bilgileri
                      </Typography>
                      {notification.courseCode && (
                        <Typography variant="body2">
                          <strong>Ders Kodu:</strong> {notification.courseCode}
                        </Typography>
                      )}
                      {notification.courseName && (
                        <Typography variant="body2">
                          <strong>Ders Adı:</strong> {notification.courseName}
                        </Typography>
                      )}
                    </Paper>
                  )}
                  
                  {/* Yer değişikliği bilgileri */}
                  {(notification.location || notification.newLocation) && (
                    <Paper sx={{ p: 2, mb: 2, bgcolor: 'warning.50' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn /> Yer Bilgileri
                      </Typography>
                      {notification.location && (
                        <Typography variant="body2">
                          <strong>Eski Yer:</strong> {notification.location}
                        </Typography>
                      )}
                      {notification.newLocation && (
                        <Typography variant="body2">
                          <strong>Yeni Yer:</strong> {notification.newLocation}
                        </Typography>
                      )}
                    </Paper>
                  )}
                  
                  {/* Not bilgileri */}
                  {notification.grade && (
                    <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.50' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Grade /> Not Bilgisi
                      </Typography>
                      <Typography variant="body2">
                        <strong>Notunuz:</strong> {notification.grade}
                      </Typography>
                    </Paper>
                  )}
                  
                  {/* Sınav bilgileri */}
                  {notification.examDate && (
                    <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.50' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Quiz /> Sınav Bilgileri
                      </Typography>
                      <Typography variant="body2">
                        <strong>Sınav Tarihi:</strong> {notification.examDate}
                      </Typography>
                      {notification.location && (
                        <Typography variant="body2">
                          <strong>Sınav Yeri:</strong> {notification.location}
                        </Typography>
                      )}
                    </Paper>
                  )}
                  
                  {/* Etkinlik bilgileri */}
                  {notification.eventDate && (
                    <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.50' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Event /> Etkinlik Bilgileri
                      </Typography>
                      <Typography variant="body2">
                        <strong>Etkinlik Tarihi:</strong> {notification.eventDate}
                      </Typography>
                      {notification.location && (
                        <Typography variant="body2">
                          <strong>Etkinlik Yeri:</strong> {notification.location}
                        </Typography>
                      )}
                    </Paper>
                  )}
                  
                  {/* Ek bilgiler */}
                  {notification.relatedInfo && (
                    <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Info /> Ek Bilgiler
                      </Typography>
                      <Typography variant="body2">
                        {notification.relatedInfo}
          </Typography>
                    </Paper>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      {filteredNotifications.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
              ? 'Arama kriterlerinize uygun bildirim bulunamadı' 
              : 'Henüz bildirim bulunmuyor'
            }
          </Typography>
        </Paper>
      )}

      {/* Add Notification FAB - Sadece Akademisyenler */}
      {isAcademic && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
          }}
          onClick={() => setOpen(true)}
        >
          <Add />
        </Fab>
      )}

      {/* Add Notification Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Yeni Bildirim Oluştur</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bildirim Başlığı"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Bildirim Türü</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  >
                    {Object.entries(notificationTypes).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Öncelik</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    {Object.entries(priorityLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bildirim Mesajı"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || !formData.message}
          >
            Bildirim Gönder
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NotificationsPage; 