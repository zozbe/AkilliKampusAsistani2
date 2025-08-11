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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Rating,
  Avatar,
} from '@mui/material';
import {
  Restaurant,
  Add,
  Search,
  Edit,
  Delete,
  Star,
  LocalDining,
  Coffee,
  DinnerDining,
  Fastfood,
  Cake,
  Schedule,
  AttachMoney,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: 'kahvaltı' | 'öğle' | 'akşam' | 'atıştırmalık';
  price: number;
  calories: number;
  rating: number;
  isVegetarian: boolean;
  isAvailable: boolean;
  image?: string;
  ingredients: string[];
  allergens: string[];
}

interface DayMenu {
  date: string;
  breakfast: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
  snacks: MenuItem[];
}

const MenuPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAcademic = user?.role === 'staff' || user?.role === 'admin';

  // Başlangıç verilerini tanımla
  const getInitialWeeklyMenu = (): DayMenu[] => {
    const savedWeeklyMenu = localStorage.getItem('weeklyMenu');
    if (savedWeeklyMenu) {
      try {
        return JSON.parse(savedWeeklyMenu);
      } catch (error) {
        console.error('Kaydedilmiş menü verileri okunamadı:', error);
      }
    }
    
    // Default veriler
    return [
      {
        date: '2024-01-15',
        breakfast: [
          {
            id: 1,
            name: 'Menemen',
            description: 'Taze domates, biber ve yumurta ile hazırlanan geleneksel lezzet',
            category: 'kahvaltı',
            price: 25,
            calories: 280,
            rating: 4.5,
            isVegetarian: true,
            isAvailable: true,
            ingredients: ['Yumurta', 'Domates', 'Biber', 'Soğan'],
            allergens: ['Yumurta'],
          },
          {
            id: 2,
            name: 'Börek',
            description: 'El açması su böreği, peynir ve ıspanak seçenekleriyle',
            category: 'kahvaltı',
            price: 20,
            calories: 320,
            rating: 4.2,
            isVegetarian: true,
            isAvailable: true,
            ingredients: ['Yufka', 'Peynir', 'Yumurta', 'Süt'],
            allergens: ['Gluten', 'Süt', 'Yumurta'],
          },
        ],
        lunch: [
          {
            id: 3,
            name: 'Tavuk Şiş',
            description: 'Marine edilmiş tavuk parçaları, pilav ve salata ile',
            category: 'öğle',
            price: 45,
            calories: 520,
            rating: 4.7,
            isVegetarian: false,
            isAvailable: true,
            ingredients: ['Tavuk', 'Pilav', 'Salata', 'Baharatlar'],
            allergens: [],
          },
          {
            id: 4,
            name: 'Mercimek Çorbası',
            description: 'Vitamin deposu kırmızı mercimek çorbası',
            category: 'öğle',
            price: 15,
            calories: 180,
            rating: 4.3,
            isVegetarian: true,
            isAvailable: true,
            ingredients: ['Kırmızı mercimek', 'Sebze', 'Baharatlar'],
            allergens: [],
          },
        ],
        dinner: [
          {
            id: 5,
            name: 'Köfte',
            description: 'Ev yapımı köfte, patates kızartması ve ayran ile',
            category: 'akşam',
            price: 40,
            calories: 480,
            rating: 4.4,
            isVegetarian: false,
            isAvailable: true,
            ingredients: ['Dana eti', 'Patates', 'Ayran'],
            allergens: ['Süt'],
          },
        ],
        snacks: [
          {
            id: 6,
            name: 'Tost',
            description: 'Kaşar peynirli tost',
            category: 'atıştırmalık',
            price: 18,
            calories: 250,
            rating: 4.0,
            isVegetarian: true,
            isAvailable: true,
            ingredients: ['Ekmek', 'Kaşar peyniri'],
            allergens: ['Gluten', 'Süt'],
          },
        ],
      },
    ];
  };

  const getInitialFavorites = (): number[] => {
    const savedFavorites = localStorage.getItem('menuFavorites');
    if (savedFavorites) {
      try {
        return JSON.parse(savedFavorites);
      } catch (error) {
        console.error('Kaydedilmiş favori verileri okunamadı:', error);
      }
    }
    return [];
  };

  const [weeklyMenu, setWeeklyMenu] = useState<DayMenu[]>(getInitialWeeklyMenu);

  const [currentDay, setCurrentDay] = useState(0);
  const [currentMeal, setCurrentMeal] = useState(0);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<number[]>(getInitialFavorites);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    category: 'öğle' as 'kahvaltı' | 'öğle' | 'akşam' | 'atıştırmalık',
    price: 0,
    calories: 0,
    isVegetarian: false,
    ingredients: '',
    allergens: '',
  });

  // WeeklyMenu değiştiğinde localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem('weeklyMenu', JSON.stringify(weeklyMenu));
    } catch (error) {
      console.error('WeeklyMenu localStorage\'a kaydedilemedi:', error);
    }
  }, [weeklyMenu]);

  // Favorites değiştiğinde localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem('menuFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('MenuFavorites localStorage\'a kaydedilemedi:', error);
    }
  }, [favorites]);

  const mealTypes = [
    { key: 'breakfast', label: 'Kahvaltı', icon: <Coffee />, color: 'warning' },
    { key: 'lunch', label: 'Öğle Yemeği', icon: <LocalDining />, color: 'primary' },
    { key: 'dinner', label: 'Akşam Yemeği', icon: <DinnerDining />, color: 'secondary' },
    { key: 'snacks', label: 'Atıştırmalık', icon: <Fastfood />, color: 'info' },
  ];

  const weekDays = [
    'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'
  ];

  const getCurrentDayMenu = () => {
    if (!weeklyMenu[currentDay]) return [];
    
    const dayMenu = weeklyMenu[currentDay];
    switch (currentMeal) {
      case 0: return dayMenu.breakfast || [];
      case 1: return dayMenu.lunch || [];
      case 2: return dayMenu.dinner || [];
      case 3: return dayMenu.snacks || [];
      default: return [];
    }
  };

  const filteredMenuItems = getCurrentDayMenu().filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'vegetarian' && item.isVegetarian) ||
                           (selectedCategory === 'available' && item.isAvailable);
    
    return matchesSearch && matchesCategory;
  });

  const handleAddMenuItem = () => {
    const newId = Date.now();
    const menuItem: MenuItem = {
      id: newId,
      ...newMenuItem,
      rating: 0,
      isAvailable: true,
      ingredients: newMenuItem.ingredients.split(',').map(i => i.trim()),
      allergens: newMenuItem.allergens.split(',').map(a => a.trim()).filter(a => a),
    };
    
    // Yeni öğeyi ilgili öğün kategorisine ekle
    const updatedWeeklyMenu = [...weeklyMenu];
    if (!updatedWeeklyMenu[currentDay]) return;
    
    const mealKey = ['breakfast', 'lunch', 'dinner', 'snacks'][currentMeal] as keyof DayMenu;
    if (mealKey !== 'date') {
      (updatedWeeklyMenu[currentDay][mealKey] as MenuItem[]).push(menuItem);
    }
    
    setWeeklyMenu(updatedWeeklyMenu);
    setNewMenuItem({
      name: '',
      description: '',
      category: 'öğle',
      price: 0,
      calories: 0,
      isVegetarian: false,
      ingredients: '',
      allergens: '',
    });
    setOpen(false);
  };

  const handleDeleteMenuItem = (id: number) => {
    const updatedWeeklyMenu = [...weeklyMenu];
    if (!updatedWeeklyMenu[currentDay]) return;
    
    const mealKey = ['breakfast', 'lunch', 'dinner', 'snacks'][currentMeal] as keyof DayMenu;
    if (mealKey !== 'date') {
      const mealItems = updatedWeeklyMenu[currentDay][mealKey] as MenuItem[];
      updatedWeeklyMenu[currentDay][mealKey] = mealItems.filter(item => item.id !== id) as any;
    }
    
    setWeeklyMenu(updatedWeeklyMenu);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const getMealIcon = (category: string) => {
    switch (category) {
      case 'kahvaltı': return <Coffee />;
      case 'öğle': return <LocalDining />;
      case 'akşam': return <DinnerDining />;
      case 'atıştırmalık': return <Fastfood />;
      default: return <Restaurant />;
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
          <Restaurant sx={{ mr: 2, fontSize: 40 }} />
          Yemek Listesi
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip 
            label={`${getCurrentDayMenu().length} Yemek`}
            color="primary"
            variant="filled"
          />
          <Chip 
            label={`${favorites.length} Favorim`}
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Gün Seçimi */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Gün Seçimi</Typography>
          <Tabs
            value={currentDay}
            onChange={(_, newValue) => setCurrentDay(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {weekDays.map((day, index) => (
              <Tab key={index} label={day} />
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Öğün Seçimi */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Öğün Seçimi</Typography>
          <Tabs
            value={currentMeal}
            onChange={(_, newValue) => setCurrentMeal(newValue)}
            variant="fullWidth"
          >
            {mealTypes.map((meal, index) => (
              <Tab 
                key={index} 
                icon={meal.icon} 
                label={meal.label}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Arama ve Filtreler */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Yemek ara..."
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
                label="Filtre"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="vegetarian">Vejetaryen</MenuItem>
                <MenuItem value="available">Mevcut</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Yemek Listesi */}
      <Grid container spacing={3}>
        {filteredMenuItems.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Alert severity="info">
                  Bu öğün için henüz yemek eklenmemiş veya arama kriterlerinize uygun yemek bulunamadı.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredMenuItems.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: item.isAvailable ? 1 : 0.6,
                }}
              >
                <Box
                  sx={{
                    height: 120,
                    background: `linear-gradient(135deg, ${
                      item.category === 'kahvaltı' ? '#FF9800' :
                      item.category === 'öğle' ? '#2196F3' :
                      item.category === 'akşam' ? '#FF4081' : '#00BCD4'
                    } 0%, ${
                      item.category === 'kahvaltı' ? '#F57C00' :
                      item.category === 'öğle' ? '#1976D2' :
                      item.category === 'akşam' ? '#C51162' : '#0097A7'
                    } 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    position: 'relative',
                  }}
                >
                  <Typography variant="h2" sx={{ opacity: 0.3 }}>
                    {getMealIcon(item.category)}
                  </Typography>
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton 
                      sx={{ color: 'white' }}
                      onClick={() => toggleFavorite(item.id)}
                    >
                      {favorites.includes(item.id) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                  {!item.isAvailable && (
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: 'error.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                      }}
                    >
                      Tükendi
                    </Box>
                  )}
                </Box>
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    {isAcademic && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteMenuItem(item.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {item.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AttachMoney sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                        {item.price}₺
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      {item.calories} kcal
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Rating value={item.rating} precision={0.5} size="small" readOnly />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {item.isVegetarian && (
                        <Chip label="Vejetaryen" size="small" color="success" variant="outlined" />
                      )}
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>İçerikler:</strong> {item.ingredients.join(', ')}
                  </Typography>
                  
                  {item.allergens.length > 0 && (
                    <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
                      <strong>Alerjenler:</strong> {item.allergens.join(', ')}
                    </Typography>
                  )}
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
          aria-label="yemek ekle"
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
        <DialogTitle>Yeni Yemek Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Yemek Adı"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Kategori"
                value={newMenuItem.category}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value as any })}
              >
                <MenuItem value="kahvaltı">Kahvaltı</MenuItem>
                <MenuItem value="öğle">Öğle Yemeği</MenuItem>
                <MenuItem value="akşam">Akşam Yemeği</MenuItem>
                <MenuItem value="atıştırmalık">Atıştırmalık</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Fiyat (₺)"
                type="number"
                value={newMenuItem.price}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, price: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Kalori"
                type="number"
                value={newMenuItem.calories}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, calories: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Açıklama"
                value={newMenuItem.description}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="İçerikler (virgülle ayırın)"
                value={newMenuItem.ingredients}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, ingredients: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alerjenler (virgülle ayırın)"
                value={newMenuItem.allergens}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, allergens: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={newMenuItem.isVegetarian}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, isVegetarian: e.target.checked })}
                />
                <Typography sx={{ ml: 1 }}>Vejetaryen</Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button 
            onClick={handleAddMenuItem}
            variant="contained"
            disabled={!newMenuItem.name || !newMenuItem.description}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MenuPage; 