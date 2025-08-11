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
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  Divider,
  Alert,
} from '@mui/material';
import {
  Announcement,
  Add,
  Search,
  FilterList,
  PriorityHigh,
  Info,
  Warning,
  Edit,
  Delete,
  Person,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  author: string;
  date: string;
  isRead: boolean;
}

const AnnouncementsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAcademic = user?.role === 'staff' || user?.role === 'admin';
  
  // Başlangıç verilerini tanımla
  const getInitialAnnouncements = (): AnnouncementItem[] => {
    const savedAnnouncements = localStorage.getItem('announcements');
    if (savedAnnouncements) {
      try {
        return JSON.parse(savedAnnouncements);
      } catch (error) {
        console.error('Kaydedilmiş duyuru verileri okunamadı:', error);
      }
    }
    
    // Default veriler
    return [
      {
        id: 1,
        title: 'Yeni Dönem Kayıtları Başladı',
        content: 'Güz dönemi kayıtları 15 Ocak tarihinde başlamıştır. Tüm öğrencilerin ders kayıtlarını zamanında yapması gerekmektedir.',
        priority: 'high',
        category: 'Akademik',
        author: 'Öğrenci İşleri',
        date: '2024-01-15',
        isRead: false,
      },
      {
        id: 2,
        title: 'Kampüs WiFi Güncellemesi',
        content: 'Kampüs genelinde WiFi altyapısı güncellenmektedir. Geçici kesintiler yaşanabilir.',
        priority: 'medium',
        category: 'Teknoloji',
        author: 'BİT Müdürlüğü',
        date: '2024-01-14',
        isRead: true,
      },
      {
        id: 3,
        title: 'Kütüphane Çalışma Saatleri',
        content: 'Kütüphane hafta sonu çalışma saatleri güncellendi. Yeni saatler 09:00-22:00 olarak belirlenmiştir.',
        priority: 'low',
        category: 'Genel',
        author: 'Kütüphane',
        date: '2024-01-13',
        isRead: true,
      },
    ];
  };

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(getInitialAnnouncements);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: 'Genel',
  });

  // Announcements değiştiğinde localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem('announcements', JSON.stringify(announcements));
    } catch (error) {
      console.error('Announcements localStorage\'a kaydedilemedi:', error);
    }
  }, [announcements]);

  const priorityColors = {
    high: 'error',
    medium: 'warning',
    low: 'info',
  } as const;

  const priorityLabels = {
    high: 'Yüksek',
    medium: 'Orta',
    low: 'Düşük',
  };

  const priorityIcons = {
    high: <PriorityHigh />,
    medium: <Warning />,
    low: <Info />,
  };

  const categories = ['Akademik', 'Teknoloji', 'Genel', 'Etkinlik', 'Duyuru'];

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const handleAddAnnouncement = () => {
    const newId = Math.max(...announcements.map(a => a.id)) + 1;
    const announcement: AnnouncementItem = {
      id: newId,
      ...newAnnouncement,
      author: 'Yönetim',
      date: new Date().toISOString().split('T')[0],
      isRead: false,
    };
    
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: '',
      content: '',
      priority: 'medium',
      category: 'Genel',
    });
    setOpen(false);
  };

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const markAsRead = (id: number) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, isRead: true } : a
    ));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
          <Announcement sx={{ mr: 2, fontSize: 40 }} />
          Duyurular
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip 
            label={`${announcements.filter(a => !a.isRead).length} Okunmamış`}
            color="primary"
            variant="filled"
          />
        </Box>
      </Box>

      {/* Arama ve Filtreler */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Duyuru ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Öncelik"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <MenuItem value="all">Tüm Öncelikler</MenuItem>
                <MenuItem value="high">Yüksek</MenuItem>
                <MenuItem value="medium">Orta</MenuItem>
                <MenuItem value="low">Düşük</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Kategori"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">Tüm Kategoriler</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Duyuru Listesi */}
      <Grid container spacing={3}>
        {filteredAnnouncements.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Alert severity="info">
                  Arama kriterlerinize uygun duyuru bulunamadı.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Grid item xs={12} key={announcement.id}>
              <Card 
                sx={{ 
                  position: 'relative',
                  opacity: announcement.isRead ? 0.8 : 1,
                  cursor: 'pointer',
                }}
                onClick={() => markAsRead(announcement.id)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        icon={priorityIcons[announcement.priority]}
                        label={priorityLabels[announcement.priority]}
                        color={priorityColors[announcement.priority]}
                        size="small"
                      />
                      <Chip
                        label={announcement.category}
                        variant="outlined"
                        size="small"
                      />
                      {!announcement.isRead && (
                        <Chip
                          label="Yeni"
                          color="success"
                          size="small"
                        />
                      )}
                    </Box>
                    
                    {isAcademic && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAnnouncement(announcement.id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    {announcement.title}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {announcement.content}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24 }}>
                        <Person />
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {announcement.author}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      {new Date(announcement.date).toLocaleDateString('tr-TR')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Ekleme Butonu - Sadece Akademisyenler */}
      {isAcademic && (
        <Fab
          color="primary"
          aria-label="duyuru ekle"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
          onClick={() => setOpen(true)}
        >
          <Add />
        </Fab>
      )}

      {/* Ekleme Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Yeni Duyuru Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Başlık"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Öncelik"
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as 'high' | 'medium' | 'low' })}
              >
                <MenuItem value="high">Yüksek</MenuItem>
                <MenuItem value="medium">Orta</MenuItem>
                <MenuItem value="low">Düşük</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Kategori"
                value={newAnnouncement.category}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="İçerik"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button 
            onClick={handleAddAnnouncement}
            variant="contained"
            disabled={!newAnnouncement.title || !newAnnouncement.content}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AnnouncementsPage; 