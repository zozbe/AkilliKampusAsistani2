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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Divider,
  Stack,
} from '@mui/material';
import {
  Schedule,
  Add,
  Search,
  Edit,
  Delete,
  Person,
  Room,
  AccessTime,
  Book,
  CalendarToday,
  FilterList,
  Class,
  School,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface Course {
  id: number;
  name: string;
  code: string;
  instructor: string;
  room: string;
  day: number; // 0-6 (Pazartesi-Pazar)
  startTime: string;
  endTime: string;
  credits: number;
  type: 'Zorunlu' | 'Seçmeli' | 'Müfredat Dışı';
  color: string;
  description?: string;
}

const SchedulePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAcademic = user?.role === 'staff' || user?.role === 'admin';

  // Başlangıç verilerini tanımla
  const getInitialCourses = (): Course[] => {
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      try {
        return JSON.parse(savedCourses);
      } catch (error) {
        console.error('Kaydedilmiş ders verileri okunamadı:', error);
      }
    }
    
    // Default veriler
    return [
      {
        id: 1,
        name: 'Matematik I',
        code: 'MAT101',
        instructor: 'Dr. Ahmet Yılmaz',
        room: 'A101',
        day: 0, // Pazartesi
        startTime: '09:00',
        endTime: '10:30',
        credits: 4,
        type: 'Zorunlu',
        color: '#2196F3',
        description: 'Temel matematik kavramları ve analiz',
      },
      {
        id: 2,
        name: 'Fizik II',
        code: 'FIZ202',
        instructor: 'Prof. Dr. Ayşe Demir',
        room: 'B205',
        day: 0, // Pazartesi
        startTime: '11:00',
        endTime: '12:30',
        credits: 3,
        type: 'Zorunlu',
        color: '#FF4081',
      },
      {
        id: 3,
        name: 'Programlama',
        code: 'BIL101',
        instructor: 'Dr. Mehmet Kaya',
        room: 'C301',
        day: 0, // Pazartesi
        startTime: '14:00',
        endTime: '15:30',
        credits: 3,
        type: 'Zorunlu',
        color: '#4CAF50',
      },
      {
        id: 4,
        name: 'İngilizce',
        code: 'ING101',
        instructor: 'Öğr. Gör. Sarah Johnson',
        room: 'D102',
        day: 1, // Salı
        startTime: '10:00',
        endTime: '11:30',
        credits: 2,
        type: 'Zorunlu',
        color: '#FF9800',
      },
      {
        id: 5,
        name: 'Sanat Tarihi',
        code: 'SAN201',
        instructor: 'Dr. Fatma Özkan',
        room: 'E201',
        day: 2, // Çarşamba
        startTime: '13:00',
        endTime: '14:30',
        credits: 2,
        type: 'Seçmeli',
        color: '#9C27B0',
      },
    ];
  };

  const [courses, setCourses] = useState<Course[]>(getInitialCourses);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('calendar');
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    instructor: '',
    room: '',
    day: 0,
    startTime: '',
    endTime: '',
    credits: 3,
    type: 'Zorunlu' as 'Zorunlu' | 'Seçmeli' | 'Müfredat Dışı',
    description: '',
  });

  // Courses değiştiğinde localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem('courses', JSON.stringify(courses));
    } catch (error) {
      console.error('Courses localStorage\'a kaydedilemedi:', error);
    }
  }, [courses]);

  const weekDays = [
    'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const courseTypes = ['Zorunlu', 'Seçmeli', 'Müfredat Dışı'];

  const typeColors: Record<string, string> = {
    'Zorunlu': 'primary',
    'Seçmeli': 'secondary',
    'Müfredat Dışı': 'info',
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || course.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getCoursesForDay = (dayIndex: number) => {
    return filteredCourses
      .filter(course => course.day === dayIndex)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getTimeSlotCourse = (dayIndex: number, timeSlot: string) => {
    return filteredCourses.find(course => 
      course.day === dayIndex && 
      course.startTime <= timeSlot && 
      course.endTime > timeSlot
    );
  };

  const handleAddCourse = () => {
    const newId = Math.max(...courses.map(c => c.id)) + 1;
    const course: Course = {
      id: newId,
      ...newCourse,
      color: getRandomColor(),
    };
    
    setCourses([...courses, course]);
    setNewCourse({
      name: '',
      code: '',
      instructor: '',
      room: '',
      day: 0,
      startTime: '',
      endTime: '',
      credits: 3,
      type: 'Zorunlu',
      description: '',
    });
    setOpen(false);
  };

  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const getRandomColor = () => {
    const colors = ['#2196F3', '#FF4081', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#F44336'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getTotalCredits = () => {
    return filteredCourses.reduce((total, course) => total + course.credits, 0);
  };

  const renderCalendarView = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Saat</TableCell>
            {weekDays.map((day, index) => (
              <TableCell key={index} align="center" sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSlots.map((timeSlot) => (
            <TableRow key={timeSlot}>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                {timeSlot}
              </TableCell>
              {weekDays.map((_, dayIndex) => {
                const course = getTimeSlotCourse(dayIndex, timeSlot);
                return (
                  <TableCell key={dayIndex} sx={{ p: 1, height: 80 }}>
                    {course && (
                      <Card 
                        sx={{ 
                          height: '100%',
                          bgcolor: course.color,
                          color: 'white',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: 3,
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                            {course.code}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
                            {course.name}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            {course.room}
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderTableView = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Ders Kodu</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Ders Adı</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Öğretim Görevlisi</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Gün/Saat</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Yer</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Kredi</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Tür</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCourses.map((course) => (
            <TableRow key={course.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      bgcolor: course.color, 
                      borderRadius: '50%' 
                    }} 
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {course.code}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{course.name}</Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="body2">{course.instructor}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {weekDays[course.day]} {course.startTime}-{course.endTime}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Room sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2">{course.room}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip label={`${course.credits} Kredi`} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                <Chip 
                  label={course.type} 
                  size="small" 
                  color={typeColors[course.type] as any}
                />
              </TableCell>
              <TableCell>
                {isAcademic ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    -
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
          <Schedule sx={{ mr: 2, fontSize: 40 }} />
          Ders Programı
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip 
            label={`${filteredCourses.length} Ders`}
            color="primary"
            variant="filled"
          />
          <Chip 
            label={`${getTotalCredits()} Kredi`}
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Özet Kartları */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Class sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {filteredCourses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Ders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <School sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {getTotalCredits()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Kredi
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Person sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {new Set(filteredCourses.map(c => c.instructor)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Öğretim Görevlisi
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarToday sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {new Set(filteredCourses.map(c => c.day)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aktif Gün
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Arama ve Filtreler */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Ders ara..."
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
                label="Ders Türü"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <MenuItem value="all">Tüm Dersler</MenuItem>
                {courseTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('calendar')}
                  startIcon={<CalendarToday />}
                >
                  Takvim
                </Button>
                <Button
                  fullWidth
                  variant={viewMode === 'table' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('table')}
                  startIcon={<FilterList />}
                >
                  Liste
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Program Görünümü */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent>
            <Alert severity="info">
              Arama kriterlerinize uygun ders bulunamadı.
            </Alert>
          </CardContent>
        </Card>
      ) : (
        viewMode === 'calendar' ? renderCalendarView() : renderTableView()
      )}

      {/* Ekleme Butonu - Sadece Akademisyenler */}
      {isAcademic && (
        <Fab
          color="primary"
          aria-label="ders ekle"
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
        <DialogTitle>Yeni Ders Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ders Adı"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ders Kodu"
                value={newCourse.code}
                onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Öğretim Görevlisi"
                value={newCourse.instructor}
                onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Gün"
                value={newCourse.day}
                onChange={(e) => setNewCourse({ ...newCourse, day: parseInt(e.target.value) })}
              >
                {weekDays.map((day, index) => (
                  <MenuItem key={index} value={index}>{day}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Başlangıç Saati"
                type="time"
                value={newCourse.startTime}
                onChange={(e) => setNewCourse({ ...newCourse, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bitiş Saati"
                type="time"
                value={newCourse.endTime}
                onChange={(e) => setNewCourse({ ...newCourse, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Derslik"
                value={newCourse.room}
                onChange={(e) => setNewCourse({ ...newCourse, room: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Kredi"
                type="number"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Tür"
                value={newCourse.type}
                onChange={(e) => setNewCourse({ ...newCourse, type: e.target.value as any })}
              >
                {courseTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Açıklama (İsteğe bağlı)"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button 
            onClick={handleAddCourse}
            variant="contained"
            disabled={!newCourse.name || !newCourse.code || !newCourse.instructor || !newCourse.room || !newCourse.startTime || !newCourse.endTime}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SchedulePage; 