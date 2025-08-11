import React, { useState } from 'react';
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
  Paper,
  ButtonGroup,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Map,
  Add,
  Search,
  Edit,
  Delete,
  LocationOn,
  Business,
  School,
  LocalHospital,
  Restaurant,
  SportsSoccer,
  LocalLibrary,
  Home,
  DirectionsWalk,
  ZoomIn,
  ZoomOut,
  MyLocation,
  Layers,
  FilterList,
  Info,
  Engineering,
  Architecture,
  Business as BusinessIcon,
  Flight,
  DirectionsBoat,
  Science,
  Hotel,
  AdminPanelSettings
} from '@mui/icons-material';

interface MapLocation {
  id: number;
  name: string;
  category: 'Fakülte' | 'İdari' | 'Sosyal' | 'Sağlık' | 'Spor' | 'Yurt' | 'Meslek Yüksekokulu' | 'Konservatuvar' | 'Diğer';
  coordinates: { x: number; y: number };
  description: string;
  facilities: string[];
  openHours?: string;
  phone?: string;
  capacity?: number;
  isAccessible: boolean;
  image?: string;
}

const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<MapLocation[]>([
    {
      id: 1,
      name: 'Rektörlük Binası',
      category: 'İdari',
      coordinates: { x: 50, y: 25 },
      description: 'İSTE Rektörlüğü ve merkezi idari birimler',
      facilities: ['WiFi', 'Klima', 'Asansör', 'Otopark', 'Güvenlik'],
      openHours: '08:00 - 17:00',
      phone: '0 (326) 310 10 10',
      isAccessible: true,
    },
    {
      id: 2,
      name: 'Barbaros Hayrettin Gemi İnşaatı ve Denizcilik Fakültesi',
      category: 'Fakülte',
      coordinates: { x: 25, y: 45 },
      description: 'Gemi inşaatı ve denizcilik mühendisliği bölümleri',
      facilities: ['WiFi', 'Laboratuvar', 'Atölye', 'Amfi', 'Klima'],
      openHours: '08:00 - 18:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 3,
      name: 'Deniz Bilimleri ve Teknoloji Fakültesi',
      category: 'Fakülte',
      coordinates: { x: 35, y: 55 },
      description: 'Deniz bilimleri ve su ürünleri mühendisliği',
      facilities: ['WiFi', 'Araştırma Laboratuvarı', 'Amfi', 'Klima'],
      openHours: '08:00 - 18:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 4,
      name: 'Havacılık ve Uzay Bilimleri Fakültesi',
      category: 'Fakülte',
      coordinates: { x: 65, y: 35 },
      description: 'Havacılık ve uzay mühendisliği bölümleri',
      facilities: ['WiFi', 'Simülatör Lab', 'Hangarlı Atölye', 'Amfi'],
      openHours: '08:00 - 18:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 5,
      name: 'İşletme ve Yönetim Bilimleri Fakültesi',
      category: 'Fakülte',
      coordinates: { x: 75, y: 55 },
      description: 'İşletme, iktisat ve yönetim bilimleri',
      facilities: ['WiFi', 'Konferans Salonu', 'Bilgisayar Lab', 'Klima'],
      openHours: '08:00 - 18:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 6,
      name: 'Mimarlık Fakültesi',
      category: 'Fakülte',
      coordinates: { x: 45, y: 70 },
      description: 'Mimarlık ve şehir planlama bölümleri',
      facilities: ['WiFi', 'Tasarım Atölyesi', 'Maket Atölyesi', 'Sergi Alanı'],
      openHours: '08:00 - 20:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 7,
      name: 'Mühendislik ve Doğa Bilimleri Fakültesi',
      category: 'Fakülte',
      coordinates: { x: 30, y: 35 },
      description: 'Mühendislik ve fen bilimleri bölümleri',
      facilities: ['WiFi', 'Araştırma Lab', 'Bilgisayar Lab', 'Amfi'],
      openHours: '08:00 - 18:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 8,
      name: 'Turizm Fakültesi',
      category: 'Fakülte',
      coordinates: { x: 60, y: 65 },
      description: 'Turizm ve otel işletmeciliği bölümleri',
      facilities: ['WiFi', 'Uygulama Oteli', 'Mutfak Lab', 'Servis Lab'],
      openHours: '08:00 - 18:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 9,
      name: 'Denizcilik Meslek Yüksekokulu',
      category: 'Meslek Yüksekokulu',
      coordinates: { x: 20, y: 60 },
      description: 'Denizcilik alanında meslek yüksekokulu programları',
      facilities: ['WiFi', 'Simülatör', 'Atölye', 'Klima'],
      openHours: '08:00 - 18:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 10,
      name: 'İskenderun Meslek Yüksekokulu',
      category: 'Meslek Yüksekokulu',
      coordinates: { x: 70, y: 45 },
      description: 'Teknik ve sosyal alanlar meslek yüksekokulu',
      facilities: ['WiFi', 'Atölye', 'Bilgisayar Lab', 'Klima'],
      openHours: '08:00 - 18:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 11,
      name: 'Mustafa Yazıcı Devlet Konservatuvarı',
      category: 'Konservatuvar',
      coordinates: { x: 80, y: 25 },
      description: 'Müzik ve sahne sanatları eğitimi (Ayrı yerleşke)',
      facilities: ['WiFi', 'Konser Salonu', 'Prova Odaları', 'Kayıt Stüdyosu'],
      openHours: '08:00 - 20:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 12,
      name: 'Merkez Kütüphane',
      category: 'Sosyal',
      coordinates: { x: 40, y: 40 },
      description: 'Ana kütüphane ve çalışma alanları',
      facilities: ['WiFi', 'Sessiz Çalışma Alanı', 'Grup Çalışma Odaları', 'Dijital Arşiv'],
      openHours: '08:00 - 22:00',
      phone: '0 (326) 613 87 75',
      capacity: 1500,
      isAccessible: true,
    },
    {
      id: 13,
      name: 'Ana Yemekhane',
      category: 'Sosyal',
      coordinates: { x: 55, y: 50 },
      description: 'Merkez yemek salonu ve kafeterya',
      facilities: ['WiFi', 'Klima', 'Geniş Oturma Alanı', 'Kahve Köşesi'],
      openHours: '07:00 - 21:00',
      phone: '0 (326) 613 87 75',
      capacity: 1200,
      isAccessible: true,
    },
    {
      id: 14,
      name: 'Sağlık Merkezi',
      category: 'Sağlık',
      coordinates: { x: 25, y: 25 },
      description: 'Kampüs sağlık hizmetleri ve revir',
      facilities: ['Acil Servis', 'Eczane', 'Muayene Odaları', 'Hasta Takip'],
      openHours: '08:00 - 17:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 15,
      name: 'Spor Kompleksi',
      category: 'Spor',
      coordinates: { x: 15, y: 75 },
      description: 'Spor salonları ve fitness merkezi',
      facilities: ['Basketbol Sahası', 'Voleybol Sahası', 'Fitness Salonu', 'Soyunma Odası'],
      openHours: '06:00 - 22:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 16,
      name: 'Öğrenci Yurtları Kompleksi',
      category: 'Yurt',
      coordinates: { x: 85, y: 75 },
      description: 'Kampüs içi öğrenci konaklama tesisleri',
      facilities: ['WiFi', 'Çamaşırhane', 'Ortak Mutfak', '24 Saat Güvenlik'],
      openHours: '24 Saat',
      capacity: 2000,
      isAccessible: true,
    },
    {
      id: 17,
      name: 'Teknoloji Transfer Ofisi (İSTE-TTO)',
      category: 'İdari',
      coordinates: { x: 65, y: 25 },
      description: 'Ar-Ge projeleri ve teknoloji transferi',
      facilities: ['WiFi', 'Toplantı Salonları', 'Proje Ofisleri'],
      openHours: '08:00 - 17:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 18,
      name: 'Sosyal Tesisler',
      category: 'Sosyal',
      coordinates: { x: 45, y: 80 },
      description: 'Konferans salonları ve sosyal aktivite alanları',
      facilities: ['Konferans Salonu', 'Kafeterya', 'Sergi Alanı', 'Organizasyon Salonu'],
      openHours: '08:00 - 22:00',
      phone: '0 (326) 613 87 75',
      capacity: 500,
      isAccessible: true,
    },
    {
      id: 19,
      name: 'Araştırma Merkezleri Binası',
      category: 'İdari',
      coordinates: { x: 75, y: 35 },
      description: 'Çeşitli araştırma merkezleri ve laboratuvarlar',
      facilities: ['WiFi', 'Araştırma Lab', 'Toplantı Odaları', 'Arşiv'],
      openHours: '08:00 - 18:00',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    },
    {
      id: 20,
      name: 'Bilgi İşlem Merkezi',
      category: 'İdari',
      coordinates: { x: 35, y: 25 },
      description: 'IT hizmetleri ve sistem yönetimi',
      facilities: ['Server Odası', 'Teknik Destek', 'Network Merkezi'],
      openHours: '24 Saat',
      phone: '0 (326) 613 87 75',
      isAccessible: true,
    }
  ]);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [newLocation, setNewLocation] = useState({
    name: '',
    category: 'Fakülte' as 'Fakülte' | 'İdari' | 'Sosyal' | 'Sağlık' | 'Spor' | 'Yurt' | 'Meslek Yüksekokulu' | 'Konservatuvar' | 'Diğer',
    description: '',
    facilities: '',
    openHours: '',
    phone: '',
    coordinates: { x: 50, y: 50 },
  });

  const categories = ['Fakülte', 'İdari', 'Sosyal', 'Sağlık', 'Spor', 'Yurt', 'Meslek Yüksekokulu', 'Konservatuvar', 'Diğer'];

  const categoryColors: Record<string, string> = {
    'Fakülte': '#2196F3',
    'İdari': '#FF9800',
    'Sosyal': '#4CAF50',
    'Sağlık': '#F44336',
    'Spor': '#9C27B0',
    'Yurt': '#00BCD4',
    'Meslek Yüksekokulu': '#795548',
    'Konservatuvar': '#E91E63',
    'Diğer': '#757575',
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    'Fakülte': <School />,
    'İdari': <AdminPanelSettings />,
    'Sosyal': <Restaurant />,
    'Sağlık': <LocalHospital />,
    'Spor': <SportsSoccer />,
    'Yurt': <Home />,
    'Meslek Yüksekokulu': <Engineering />,
    'Konservatuvar': <Hotel />,
    'Diğer': <LocationOn />,
  };

  const filteredLocations = locations.filter((location) => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || location.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddLocation = () => {
    const newId = Math.max(...locations.map(l => l.id)) + 1;
    const location: MapLocation = {
      id: newId,
      name: newLocation.name,
      category: newLocation.category,
      coordinates: newLocation.coordinates,
      description: newLocation.description,
      facilities: newLocation.facilities.split(',').map(f => f.trim()),
      openHours: newLocation.openHours,
      phone: newLocation.phone,
      isAccessible: true,
    };
    
    setLocations([...locations, location]);
    setOpen(false);
    setNewLocation({
      name: '',
      category: 'Fakülte',
      description: '',
      facilities: '',
      openHours: '',
      phone: '',
      coordinates: { x: 50, y: 50 },
    });
  };

  const handleDeleteLocation = (id: number) => {
    setLocations(locations.filter(l => l.id !== id));
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setNewLocation(prev => ({
      ...prev,
      coordinates: { x: Math.round(x), y: Math.round(y) }
    }));
  };

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location);
  };

  const getCategoryStats = () => {
    return categories.map(category => ({
      category,
      count: locations.filter(loc => loc.category === category).length,
      color: categoryColors[category]
    }));
  };

  const stats = getCategoryStats();

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        <Map sx={{ mr: 2 }} />
          İSTE Kampüs Haritası
        </Typography>
        
        <Alert severity="info" sx={{ maxWidth: 500 }}>
          İskenderun Teknik Üniversitesi Merkez Kampüs haritası
        </Alert>
      </Box>

      {/* Category Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={stat.category}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: stat.color, color: 'white' }}>
              <Typography variant="h5">{stat.count}</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                {stat.category}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Search and Filter Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Bina veya bölüm ara..."
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
              label="Kategori Filtresi"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all">Tümü</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <ButtonGroup variant="contained" fullWidth>
              <Button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}>
                <ZoomOut />
              </Button>
              <Button onClick={() => setShowLabels(!showLabels)}>
                <Layers />
              </Button>
              <Button onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}>
                <ZoomIn />
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Campus Map */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: 600, position: 'relative', overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              İSTE Merkez Kampüs - İnteraktif Harita
            </Typography>
            
            <Box
              sx={{
                width: '100%',
                height: 'calc(100% - 40px)',
                background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%)',
                border: '2px solid #ddd',
                borderRadius: 2,
                position: 'relative',
                cursor: 'crosshair',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                overflow: 'hidden'
              }}
              onClick={handleMapClick}
            >
              {/* Campus Roads */}
              <Box sx={{
                position: 'absolute',
                top: '20%',
                left: 0,
                right: 0,
                height: '3px',
                bgcolor: '#666',
                zIndex: 1
              }} />
              <Box sx={{
                position: 'absolute',
                top: '60%',
                left: 0,
                right: 0,
                height: '3px',
                bgcolor: '#666',
                zIndex: 1
              }} />
              <Box sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '30%',
                width: '3px',
                bgcolor: '#666',
                zIndex: 1
              }} />
              <Box sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '70%',
                width: '3px',
                bgcolor: '#666',
                zIndex: 1
              }} />

              {/* Green Areas */}
              <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '15%',
                height: '15%',
                bgcolor: '#4CAF50',
                borderRadius: '50%',
                opacity: 0.3
              }} />
              <Box sx={{
                position: 'absolute',
                top: '75%',
                right: '10%',
                width: '20%',
                height: '20%',
                bgcolor: '#4CAF50',
                borderRadius: '50%',
                opacity: 0.3
              }} />

              {/* Map Locations */}
              {filteredLocations.map((location) => (
                <Tooltip
                  key={location.id}
                  title={`${location.name} - ${location.description}`}
                  arrow
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${location.coordinates.x}%`,
                      top: `${location.coordinates.y}%`,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: 10,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLocationClick(location);
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: categoryColors[location.category],
                        width: 40,
                        height: 40,
                        border: '2px solid white',
                        '&:hover': {
                          transform: 'scale(1.2)',
                          transition: 'transform 0.2s'
                        }
                      }}
                    >
                      {categoryIcons[location.category]}
                    </Avatar>
                    
                    {showLabels && (
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          bgcolor: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          whiteSpace: 'nowrap',
                          fontSize: '0.7rem',
                          maxWidth: '120px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {location.name}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              ))}

              {/* Compass */}
              <Box sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                bgcolor: 'rgba(255,255,255,0.9)',
                p: 1,
                borderRadius: 1,
                zIndex: 5
              }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  ↑ KUZEY
                </Typography>
              </Box>

              {/* Scale */}
              <Box sx={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                bgcolor: 'rgba(255,255,255,0.9)',
                p: 1,
                borderRadius: 1,
                zIndex: 5
              }}>
                <Typography variant="caption">
                  Zoom: {Math.round(zoomLevel * 100)}%
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Location Details Panel */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, height: 600, overflow: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedLocation ? 'Konum Detayları' : 'Konum Listesi'}
            </Typography>
            
            {selectedLocation ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: categoryColors[selectedLocation.category], mr: 2 }}>
                    {categoryIcons[selectedLocation.category]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedLocation.name}</Typography>
                    <Chip 
                      label={selectedLocation.category}
                      size="small"
                      sx={{ bgcolor: categoryColors[selectedLocation.category], color: 'white' }}
                    />
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedLocation.description}
      </Typography>
      
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Özellikler:</Typography>
                <Box sx={{ mb: 2 }}>
                  {selectedLocation.facilities.map((facility, index) => (
                    <Chip
                      key={index}
                      label={facility}
                      size="small"
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
                
                {selectedLocation.openHours && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Açık Saatler:</strong> {selectedLocation.openHours}
                  </Typography>
                )}
                
                {selectedLocation.phone && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Telefon:</strong> {selectedLocation.phone}
                  </Typography>
                )}
                
                {selectedLocation.capacity && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Kapasite:</strong> {selectedLocation.capacity} kişi
          </Typography>
                )}
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Engelli Erişimi:</strong> {selectedLocation.isAccessible ? '✓ Var' : '✗ Yok'}
          </Typography>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setSelectedLocation(null)}
                >
                  Listeye Dön
                </Button>
              </Box>
            ) : (
              <List>
                {filteredLocations.map((location) => (
                  <ListItem
                    key={location.id}
                    button
                    onClick={() => handleLocationClick(location)}
                    sx={{ mb: 1, bgcolor: 'action.hover', borderRadius: 1 }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: categoryColors[location.category], width: 32, height: 32 }}>
                        {categoryIcons[location.category]}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={location.name}
                      secondary={location.category}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Location FAB */}
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

      {/* Add Location Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Yeni Konum Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Konum Adı"
                value={newLocation.name}
                onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Kategori"
                value={newLocation.category}
                onChange={(e) => setNewLocation(prev => ({ 
                  ...prev, 
                  category: e.target.value as typeof newLocation.category 
                }))}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefon"
                value={newLocation.phone}
                onChange={(e) => setNewLocation(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                value={newLocation.description}
                onChange={(e) => setNewLocation(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Çalışma Saatleri"
                value={newLocation.openHours}
                onChange={(e) => setNewLocation(prev => ({ ...prev, openHours: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Özellikler (virgülle ayırın)"
                value={newLocation.facilities}
                onChange={(e) => setNewLocation(prev => ({ ...prev, facilities: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Haritaya tıklayarak konum koordinatlarını belirleyin. 
                Seçili koordinatlar: X:{newLocation.coordinates.x}%, Y:{newLocation.coordinates.y}%
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button 
            onClick={handleAddLocation}
            variant="contained"
            disabled={!newLocation.name || !newLocation.description}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MapPage; 