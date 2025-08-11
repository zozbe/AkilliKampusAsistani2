import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Announcement,
  Event,
  Restaurant,
  Schedule,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const DashboardPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Mock data
  const recentAnnouncements = [
    { id: 1, title: 'Yeni Dönem Kayıtları Başladı', date: '2024-01-15', priority: 'high' },
    { id: 2, title: 'Kampüs WiFi Güncellemesi', date: '2024-01-14', priority: 'medium' },
    { id: 3, title: 'Kütüphane Çalışma Saatleri', date: '2024-01-13', priority: 'low' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Kariyer Günleri', date: '2024-01-20', location: 'Konferans Salonu' },
    { id: 2, title: 'Bilim Fuarı', date: '2024-01-25', location: 'Ana Kampüs' },
    { id: 3, title: 'Mezuniyet Töreni', date: '2024-02-01', location: 'Spor Kompleksi' },
  ];

  const todaySchedule = [
    { id: 1, course: 'Matematik I', time: '09:00 - 10:30', room: 'A101', instructor: 'Dr. Ahmet Yılmaz' },
    { id: 2, course: 'Fizik II', time: '11:00 - 12:30', room: 'B205', instructor: 'Prof. Dr. Ayşe Demir' },
    { id: 3, course: 'Programlama', time: '14:00 - 15:30', room: 'C301', instructor: 'Dr. Mehmet Kaya' },
  ];

  const todayMenu = {
    breakfast: 'Menemen, Ekmek, Çay',
    lunch: 'Tavuk Şiş, Pilav, Salata',
    dinner: 'Köfte, Patates, Ayran'
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hoş Geldiniz, {user?.first_name}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Öğrenci No: {user?.student_number}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Günlük Özet */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <DashboardIcon sx={{ mr: 1 }} />
                Günlük Özet
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, backgroundColor: 'primary.light', borderRadius: 1, color: 'white' }}>
                    <Typography variant="subtitle2">Bugün</Typography>
                    <Typography variant="h6">{todaySchedule.length} Ders</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, backgroundColor: 'secondary.light', borderRadius: 1, color: 'white' }}>
                    <Typography variant="subtitle2">Bu Hafta</Typography>
                    <Typography variant="h6">{upcomingEvents.length} Etkinlik</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Bugünkü Ders Programı */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 1 }} />
                Bugünkü Ders Programı
              </Typography>
              
              <List>
                {todaySchedule.map((course) => (
                  <ListItem key={course.id} divider>
                    <ListItemText
                      primary={course.course}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {course.time} • {course.room} • {course.instructor}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Yan Panel */}
        <Grid item xs={12} md={4}>
          {/* Son Duyurular */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Announcement sx={{ mr: 1 }} />
                Son Duyurular
              </Typography>
              
              <List>
                {recentAnnouncements.map((announcement) => (
                  <ListItem key={announcement.id} divider>
                    <ListItemText
                      primary={announcement.title}
                      secondary={announcement.date}
                    />
                    <Chip
                      size="small"
                      label={announcement.priority === 'high' ? 'Önemli' : announcement.priority === 'medium' ? 'Orta' : 'Normal'}
                      color={announcement.priority === 'high' ? 'error' : announcement.priority === 'medium' ? 'warning' : 'default'}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Yaklaşan Etkinlikler */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Event sx={{ mr: 1 }} />
                Yaklaşan Etkinlikler
              </Typography>
              
              <List>
                {upcomingEvents.map((event) => (
                  <ListItem key={event.id} divider>
                    <ListItemText
                      primary={event.title}
                      secondary={`${event.date} • ${event.location}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Günün Menüsü */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Restaurant sx={{ mr: 1 }} />
                Günün Menüsü
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="primary">Kahvaltı</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>{todayMenu.breakfast}</Typography>
                
                <Typography variant="subtitle2" color="primary">Öğle Yemeği</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>{todayMenu.lunch}</Typography>
                
                <Typography variant="subtitle2" color="primary">Akşam Yemeği</Typography>
                <Typography variant="body2">{todayMenu.dinner}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage; 