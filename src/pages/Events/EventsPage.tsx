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
  InputAdornment,
  Divider,
  Alert,
  CardMedia,
  CardActions,
  Stack,
} from '@mui/material';
import {
  Event,
  Add,
  Search,
  LocationOn,
  Schedule,
  Person,
  CalendarToday,
  Edit,
  Delete,
  Share,
  Favorite,
  FavoriteBorder,
  Groups,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface EventItem {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
  image?: string;
  capacity: number;
  registered: number;
  isFavorite: boolean;
  tags: string[];
}

const EventsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAcademic = user?.role === 'staff' || user?.role === 'admin';

  // Başlangıç verilerini tanımla
  const getInitialEvents = (): EventItem[] => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      try {
        return JSON.parse(savedEvents);
      } catch (error) {
        console.error('Kaydedilmiş etkinlik verileri okunamadı:', error);
      }
    }
    
    // Default veriler
    return [
      {
        id: 1,
        title: 'Kariyer Günleri 2024',
        description: 'Sektörün önde gelen firmalarıyla tanışma, staj ve iş imkanları hakkında bilgi alma fırsatı.',
        category: 'Kariyer',
        location: 'Konferans Salonu',
        date: '2024-01-20',
        time: '09:00',
        organizer: 'Kariyer Merkezi',
        capacity: 500,
        registered: 234,
        isFavorite: false,
        tags: ['İş', 'Kariyer', 'Networking'],
      },
      {
        id: 2,
        title: 'Bilim Fuarı',
        description: 'Öğrencilerin bilim projelerini sergileyeceği, interaktif deneyimler sunacağı fuar etkinliği.',
        category: 'Akademik',
        location: 'Ana Kampüs',
        date: '2024-01-25',
        time: '10:00',
        organizer: 'Fen Fakültesi',
        capacity: 1000,
        registered: 567,
        isFavorite: true,
        tags: ['Bilim', 'Proje', 'Sergi'],
      },
      {
        id: 3,
        title: 'Mezuniyet Töreni',
        description: '2023-2024 akademik yılı mezuniyet töreni. Mezunlarımızı kutluyoruz!',
        category: 'Tören',
        location: 'Spor Kompleksi',
        date: '2024-02-01',
        time: '14:00',
        organizer: 'Rektörlük',
        capacity: 2000,
        registered: 1850,
        isFavorite: false,
        tags: ['Mezuniyet', 'Kutlama', 'Tören'],
      },
      {
        id: 4,
        title: 'Müzik Konseri',
        description: 'Üniversite müzik topluluğunun düzenlediği yılsonu konseri.',
        category: 'Kültür',
        location: 'Amfi Tiyatro',
        date: '2024-01-28',
        time: '19:00',
        organizer: 'Müzik Topluluğu',
        capacity: 300,
        registered: 189,
        isFavorite: true,
        tags: ['Müzik', 'Konser', 'Sanat'],
      },
    ];
  };

  const [events, setEvents] = useState<EventItem[]>(getInitialEvents);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: 'Akademik',
    location: '',
    date: '',
    time: '',
    capacity: 100,
  });

  // Events değiştiğinde localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem('events', JSON.stringify(events));
    } catch (error) {
      console.error('Events localStorage\'a kaydedilemedi:', error);
    }
  }, [events]);

  const categories = ['Akademik', 'Kariyer', 'Kültür', 'Spor', 'Sosyal', 'Tören'];

  const categoryColors: Record<string, any> = {
    'Akademik': 'primary',
    'Kariyer': 'success',
    'Kültür': 'secondary',
    'Spor': 'warning',
    'Sosyal': 'info',
    'Tören': 'error',
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddEvent = () => {
    const newId = Math.max(...events.map(e => e.id)) + 1;
    const event: EventItem = {
      id: newId,
      ...newEvent,
      organizer: 'Yönetim',
      registered: 0,
      isFavorite: false,
      tags: [],
    };
    
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      category: 'Akademik',
      location: '',
      date: '',
      time: '',
      capacity: 100,
    });
    setOpen(false);
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const toggleFavorite = (id: number) => {
    setEvents(events.map(e => 
      e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
    ));
  };

  const handleRegister = (id: number) => {
    setEvents(events.map(e => 
      e.id === id && e.registered < e.capacity 
        ? { ...e, registered: e.registered + 1 } 
        : e
    ));
  };

  const getDateStatus = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Geçmiş', color: 'default' as const };
    if (diffDays === 0) return { label: 'Bugün', color: 'error' as const };
    if (diffDays <= 7) return { label: `${diffDays} gün kaldı`, color: 'warning' as const };
    return { label: new Date(dateStr).toLocaleDateString('tr-TR'), color: 'primary' as const };
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
          <Event sx={{ mr: 2, fontSize: 40 }} />
          Etkinlikler
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip 
            label={`${events.length} Etkinlik`}
            color="primary"
            variant="filled"
          />
          <Chip 
            label={`${events.filter(e => e.isFavorite).length} Favorim`}
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Arama ve Filtreler */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Etkinlik ara..."
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? 'Liste' : 'Kart'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Etkinlik Listesi */}
      <Grid container spacing={3}>
        {filteredEvents.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Alert severity="info">
                  Arama kriterlerinize uygun etkinlik bulunamadı.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredEvents.map((event) => {
            const dateStatus = getDateStatus(event.date);
            const occupancyPercentage = (event.registered / event.capacity) * 100;
            
            return (
              <Grid item xs={12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} key={event.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: viewMode === 'list' ? 'row' : 'column',
                  }}
                >
                  {viewMode === 'grid' && (
                    <CardMedia
                      sx={{ 
                        height: 200,
                        background: `linear-gradient(135deg, ${
                          categoryColors[event.category] === 'primary' ? '#2196F3' : 
                          categoryColors[event.category] === 'success' ? '#4CAF50' :
                          categoryColors[event.category] === 'secondary' ? '#FF4081' :
                          categoryColors[event.category] === 'warning' ? '#FF9800' :
                          categoryColors[event.category] === 'info' ? '#00BCD4' : '#F44336'
                        } 0%, ${
                          categoryColors[event.category] === 'primary' ? '#1976D2' : 
                          categoryColors[event.category] === 'success' ? '#388E3C' :
                          categoryColors[event.category] === 'secondary' ? '#C51162' :
                          categoryColors[event.category] === 'warning' ? '#F57C00' :
                          categoryColors[event.category] === 'info' ? '#0097A7' : '#D32F2F'
                        } 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        position: 'relative',
                      }}
                    >
                      <Typography variant="h2" sx={{ opacity: 0.3 }}>
                        <Event />
                      </Typography>
                      <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                        <IconButton 
                          sx={{ color: 'white' }}
                          onClick={() => toggleFavorite(event.id)}
                        >
                          {event.isFavorite ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                      </Box>
                    </CardMedia>
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={event.category}
                          color={categoryColors[event.category]}
                          size="small"
                        />
                        <Chip
                          label={dateStatus.label}
                          color={dateStatus.color}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      
                      {viewMode === 'list' && (
                        <IconButton 
                          onClick={() => toggleFavorite(event.id)}
                          color={event.isFavorite ? 'error' : 'default'}
                        >
                          {event.isFavorite ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                      )}
                    </Box>
                    
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {event.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {event.description}
                    </Typography>
                    
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(event.date).toLocaleDateString('tr-TR')} - {event.time}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Groups sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.registered} / {event.capacity} kişi
                        </Typography>
                        <Box 
                          sx={{ 
                            flexGrow: 1, 
                            height: 4, 
                            bgcolor: 'grey.200', 
                            borderRadius: 2,
                            ml: 1,
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: `${occupancyPercentage}%`, 
                              height: '100%', 
                              bgcolor: occupancyPercentage > 80 ? 'error.main' : 'primary.main',
                              borderRadius: 2,
                            }} 
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.organizer}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    {event.tags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        {event.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {isAcademic && (
                        <>
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )}
                      <IconButton size="small" color="primary">
                        <Share />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => toggleFavorite(event.id)}
                        color={event.isFavorite ? 'error' : 'default'}
                      >
                        {event.isFavorite ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    </Box>
                    
                    <Button 
                      variant="contained" 
                      size="small"
                      disabled={event.registered >= event.capacity}
                      onClick={() => handleRegister(event.id)}
                    >
                      {event.registered >= event.capacity ? 'Dolu' : 'Katıl'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Ekleme Butonu - Sadece Akademisyenler */}
      {isAcademic && (
        <Fab
          color="primary"
          aria-label="etkinlik ekle"
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
        <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Etkinlik Adı"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Kategori"
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lokasyon"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tarih"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Saat"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Kapasite"
                type="number"
                value={newEvent.capacity}
                onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Açıklama"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button 
            onClick={handleAddEvent}
            variant="contained"
            disabled={!newEvent.title || !newEvent.description || !newEvent.location || !newEvent.date || !newEvent.time}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventsPage; 