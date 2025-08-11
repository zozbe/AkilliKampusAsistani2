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
  InputAdornment,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  CardActions,
  LinearProgress,
  Stack,
  Paper,
} from '@mui/material';
import {
  DirectionsBus,
  Add,
  Search,
  Edit,
  Delete,
  LocationOn,
  Schedule,
  Route,
  AccessTime,
  MonetizationOn,
  People,
  Navigation,
  MyLocation,
  DirectionsTransit,
  LocalTaxi,
  DirectionsWalk,
} from '@mui/icons-material';

interface TransportRoute {
  id: number;
  name: string;
  type: 'Ring' | 'Şehir İçi' | 'Şehirler Arası' | 'Metro' | 'Taksi';
  route: string[];
  schedule: string[];
  price: number;
  duration: number;
  frequency: number; // dakika
  color: string;
  isActive: boolean;
  currentLocation?: string;
  capacity: number;
  occupancy: number;
}

interface BusStop {
  id: number;
  name: string;
  location: string;
  routes: number[];
  facilities: string[];
  estimatedTime?: number;
}

const TransportPage: React.FC = () => {
  // Başlangıç verilerini tanımla
  const getInitialRoutes = (): TransportRoute[] => {
    const savedRoutes = localStorage.getItem('transportRoutes');
    if (savedRoutes) {
      try {
        return JSON.parse(savedRoutes);
      } catch (error) {
        console.error('Kaydedilmiş route verileri okunamadı:', error);
      }
    }
    
    // Default veriler
    return [
      {
        id: 1,
        name: 'Kampüs Ring 1',
        type: 'Ring',
        route: ['Ana Kapı', 'Rektörlük', 'Kütüphane', 'Yemekhaneler', 'Yurtlar', 'Spor Merkezi'],
        schedule: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
        price: 0,
        duration: 25,
        frequency: 30,
        color: '#2196F3',
        isActive: true,
        currentLocation: 'Kütüphane',
        capacity: 40,
        occupancy: 32,
      },
      {
        id: 2,
        name: 'Kampüs Ring 2',
        type: 'Ring',
        route: ['Ana Kapı', 'Mühendislik Fakültesi', 'Fen Fakültesi', 'Tıp Fakültesi', 'Hastane', 'Ana Kapı'],
        schedule: ['08:15', '08:45', '09:15', '09:45', '10:15', '10:45', '11:15', '11:45', '12:15', '12:45', '13:15', '13:45', '14:15', '14:45', '15:15', '15:45', '16:15', '16:45', '17:15'],
        price: 0,
        duration: 30,
        frequency: 30,
        color: '#FF4081',
        isActive: true,
        currentLocation: 'Mühendislik Fakültesi',
        capacity: 40,
        occupancy: 28,
      },
      {
        id: 3,
        name: 'Şehir Merkezi Hattı',
        type: 'Şehir İçi',
        route: ['Kampüs', 'Devlet Hastanesi', 'Otogar', 'Belediye', 'AVM', 'Merkez'],
        schedule: ['07:00', '07:30', '08:00', '08:30', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        price: 5,
        duration: 45,
        frequency: 60,
        color: '#4CAF50',
        isActive: true,
        currentLocation: 'Otogar',
        capacity: 50,
        occupancy: 35,
      },
      {
        id: 4,
        name: 'Metro Bağlantısı',
        type: 'Metro',
        route: ['Kampüs', 'Metro İstasyonu'],
        schedule: ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'],
        price: 3,
        duration: 15,
        frequency: 30,
        color: '#FF9800',
        isActive: true,
        currentLocation: 'Metro İstasyonu',
        capacity: 60,
        occupancy: 45,
      },
    ];
  };

  const [routes, setRoutes] = useState<TransportRoute[]>(getInitialRoutes);

  // Bus stops için başlangıç verilerini tanımla
  const getInitialBusStops = (): BusStop[] => {
    const savedBusStops = localStorage.getItem('transportBusStops');
    if (savedBusStops) {
      try {
        return JSON.parse(savedBusStops);
      } catch (error) {
        console.error('Kaydedilmiş durak verileri okunamadı:', error);
      }
    }
    
    // Default veriler
    return [
      {
        id: 1,
        name: 'Ana Kapı',
        location: 'Kampüs Ana Girişi',
        routes: [1, 2, 3],
        facilities: ['Beklemeli', 'Bilgi Ekranı', 'WiFi'],
        estimatedTime: 5,
      },
      {
        id: 2,
        name: 'Rektörlük',
        location: 'İdari Binalar',
        routes: [1],
        facilities: ['Beklemeli', 'Aydınlatma'],
        estimatedTime: 3,
      },
      {
        id: 3,
        name: 'Kütüphane',
        location: 'Merkez Kütüphane',
        routes: [1],
        facilities: ['Beklemeli', 'Bilgi Ekranı'],
        estimatedTime: 8,
      },
    ];
  };

  const [busStops, setBusStops] = useState<BusStop[]>(getInitialBusStops);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [newRoute, setNewRoute] = useState({
    name: '',
    type: 'Ring' as 'Ring' | 'Şehir İçi' | 'Şehirler Arası' | 'Metro' | 'Taksi',
    route: '',
    price: 0,
    duration: 30,
    frequency: 30,
    capacity: 40,
  });

  // Routes değiştiğinde localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem('transportRoutes', JSON.stringify(routes));
    } catch (error) {
      console.error('Routes localStorage\'a kaydedilemedi:', error);
    }
  }, [routes]);

  // Bus stops değiştiğinde localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem('transportBusStops', JSON.stringify(busStops));
    } catch (error) {
      console.error('Bus stops localStorage\'a kaydedilemedi:', error);
    }
  }, [busStops]);

  const transportTypes = ['Ring', 'Şehir İçi', 'Şehirler Arası', 'Metro', 'Taksi'];

  const typeColors: Record<string, string> = {
    'Ring': 'primary',
    'Şehir İçi': 'success',
    'Şehirler Arası': 'warning',
    'Metro': 'secondary',
    'Taksi': 'info',
  };

  const typeIcons: Record<string, React.ReactNode> = {
    'Ring': <DirectionsBus />,
    'Şehir İçi': <DirectionsTransit />,
    'Şehirler Arası': <DirectionsTransit />,
    'Metro': <DirectionsTransit />,
    'Taksi': <LocalTaxi />,
  };

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.route.some(stop => stop.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || route.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const handleAddRoute = () => {
    const newId = Math.max(...routes.map(r => r.id)) + 1;
    const route: TransportRoute = {
      id: newId,
      ...newRoute,
      route: newRoute.route.split(',').map(stop => stop.trim()),
      schedule: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
      color: getRandomColor(),
      isActive: true,
      occupancy: 0,
    };
    
    setRoutes([...routes, route]);
    setNewRoute({
      name: '',
      type: 'Ring',
      route: '',
      price: 0,
      duration: 30,
      frequency: 30,
      capacity: 40,
    });
    setOpen(false);
  };

  const handleDeleteRoute = (id: number) => {
    setRoutes(routes.filter(r => r.id !== id));
  };

  const getRandomColor = () => {
    const colors = ['#2196F3', '#FF4081', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#F44336'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getOccupancyPercentage = (route: TransportRoute) => {
    return (route.occupancy / route.capacity) * 100;
  };

  const getNextDeparture = (schedule: string[]) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const nextTime = schedule.find(time => time > currentTime);
    return nextTime || schedule[0];
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage < 50) return 'success';
    if (percentage < 80) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
          <DirectionsBus sx={{ mr: 2, fontSize: 40 }} />
          Ulaşım Bilgileri
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip 
            label={`${filteredRoutes.length} Hat`}
            color="primary"
            variant="filled"
          />
          <Chip 
            label={`${filteredRoutes.filter(r => r.isActive).length} Aktif`}
            color="success"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Hızlı Bilgiler */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <DirectionsBus sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {routes.filter(r => r.type === 'Ring').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ring Hatları
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <DirectionsTransit sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {routes.filter(r => r.type === 'Şehir İçi').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Şehir İçi Hatları
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {Math.round(routes.reduce((avg, r) => avg + r.frequency, 0) / routes.length)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ort. Sefer Aralığı (dk)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {Math.round(routes.reduce((avg, r) => avg + getOccupancyPercentage(r), 0) / routes.length)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ort. Doluluk
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Arama ve Filtreler */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Hat veya durak ara..."
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
                label="Ulaşım Türü"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <MenuItem value="all">Tüm Hatlar</MenuItem>
                {transportTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Hat Listesi */}
      <Grid container spacing={3}>
        {filteredRoutes.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Alert severity="info">
                  Arama kriterlerinize uygun hat bulunamadı.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredRoutes.map((route) => {
            const occupancyPercentage = getOccupancyPercentage(route);
            const nextDeparture = getNextDeparture(route.schedule);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={route.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: route.isActive ? 1 : 0.6,
                  }}
                >
                  <Box
                    sx={{
                      height: 80,
                      background: `linear-gradient(135deg, ${route.color} 0%, ${route.color}aa 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: 'white',
                      p: 2,
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {typeIcons[route.type]}
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {route.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Sonraki Sefer
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {nextDeparture}
                      </Typography>
                    </Box>
                    
                    {!route.isActive && (
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'error.main',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                        }}
                      >
                        Servis Dışı
                      </Box>
                    )}
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip
                        label={route.type}
                        color={typeColors[route.type] as any}
                        size="small"
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteRoute(route.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Stack spacing={2} sx={{ mb: 2, flexGrow: 1 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <Route sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          Güzergah:
                        </Typography>
                        <Typography variant="body2">
                          {route.route.join(' → ')}
                        </Typography>
                      </Box>
                      
                      {route.currentLocation && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <MyLocation sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            Şu An:
                          </Typography>
                          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                            {route.currentLocation}
                          </Typography>
                        </Box>
                      )}
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {route.duration} dk
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MonetizationOn sx={{ fontSize: 16, color: route.price === 0 ? 'success.main' : 'text.secondary' }} />
                            <Typography variant="body2" color={route.price === 0 ? 'success.main' : 'text.secondary'}>
                              {route.price === 0 ? 'Ücretsiz' : `${route.price}₺`}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Doluluk: {route.occupancy}/{route.capacity}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color={`${getOccupancyColor(occupancyPercentage)}.main`}
                            sx={{ fontWeight: 600 }}
                          >
                            %{Math.round(occupancyPercentage)}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={occupancyPercentage}
                          color={getOccupancyColor(occupancyPercentage)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button 
                      size="small" 
                      startIcon={<Navigation />}
                      variant="outlined"
                    >
                      Rotayı Gör
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<Schedule />}
                      variant="contained"
                    >
                      Saatler
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Durak Bilgileri */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ mr: 1 }} />
            Yakındaki Duraklar
          </Typography>
          
          <List>
            {busStops.map((stop, index) => (
              <React.Fragment key={stop.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <LocationOn />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={stop.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {stop.location}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                          {stop.facilities.map((facility, idx) => (
                            <Chip key={idx} label={facility} size="small" variant="outlined" />
                          ))}
                        </Box>
                        {stop.estimatedTime && (
                          <Typography variant="body2" color="success.main" sx={{ mt: 0.5, fontWeight: 600 }}>
                            Tahmini varış: {stop.estimatedTime} dakika
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      {stop.routes.length} hat
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                      {stop.routes.map(routeId => {
                        const route = routes.find(r => r.id === routeId);
                        return route ? (
                          <Chip 
                            key={routeId}
                            label={route.name.split(' ')[route.name.split(' ').length - 1]}
                            size="small"
                            sx={{ bgcolor: route.color, color: 'white' }}
                          />
                        ) : null;
                      })}
                    </Box>
                  </Box>
                </ListItem>
                {index < busStops.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Ekleme Butonu */}
      <Fab
        color="primary"
        aria-label="hat ekle"
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

      {/* Ekleme Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Yeni Hat Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Hat Adı"
                value={newRoute.name}
                onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Tür"
                value={newRoute.type}
                onChange={(e) => setNewRoute({ ...newRoute, type: e.target.value as any })}
              >
                {transportTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Güzergah (virgülle ayırın)"
                value={newRoute.route}
                onChange={(e) => setNewRoute({ ...newRoute, route: e.target.value })}
                placeholder="Durak 1, Durak 2, Durak 3..."
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Fiyat (₺)"
                type="number"
                value={newRoute.price}
                onChange={(e) => setNewRoute({ ...newRoute, price: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Süre (dk)"
                type="number"
                value={newRoute.duration}
                onChange={(e) => setNewRoute({ ...newRoute, duration: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Sefer Aralığı (dk)"
                type="number"
                value={newRoute.frequency}
                onChange={(e) => setNewRoute({ ...newRoute, frequency: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Kapasite"
                type="number"
                value={newRoute.capacity}
                onChange={(e) => setNewRoute({ ...newRoute, capacity: parseInt(e.target.value) || 0 })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button 
            onClick={handleAddRoute}
            variant="contained"
            disabled={!newRoute.name || !newRoute.route}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TransportPage; 