import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Grid,
  Paper,
  IconButton,
  Avatar,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Add,
  Support,
  ElectricalServices,
  Router,
  Construction,
  Computer,
  LocalCafe,
  Security,
  CleaningServices,
  Air,
  Phone,
  Warning,
  CheckCircle,
  Schedule,
  Assignment,
  ExpandMore,
  LocationOn,
  Person,
  AccessTime,
  PriorityHigh,
  Search,
  FilterList
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'elektrik' | 'internet' | 'yol_calismasi' | 'bilgisayar' | 'kantin' | 'guvenlik' | 'temizlik' | 'havalandirma' | 'telefon' | 'genel';
  priority: 'dusuk' | 'orta' | 'yuksek' | 'acil';
  status: 'beklemede' | 'inceleniyor' | 'cozumde' | 'tamamlandi' | 'iptal';
  location: string;
  reportedBy: string;
  reportDate: string;
  assignedTo?: string;
  estimatedTime?: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  message: string;
  author: string;
  date: string;
  isStaff: boolean;
}

const SupportPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Başlangıç verilerini tanımla
  const getInitialTickets = (): SupportTicket[] => {
    const savedTickets = localStorage.getItem('supportTickets');
    if (savedTickets) {
      try {
        return JSON.parse(savedTickets);
      } catch (error) {
        console.error('Kaydedilmiş destek talebi verileri okunamadı:', error);
      }
    }
    
    // Default veriler
    return [
      {
        id: '1',
        title: 'A205 Sınıfında Ampul Bozuk',
        description: 'A205 sınıfının sol arka köşesindeki floresan lamba yanmıyor. Ders işleme zorluğu yaşanıyor.',
        category: 'elektrik',
        priority: 'orta',
        status: 'cozumde',
        location: 'A Blok 205 No\'lu Sınıf',
        reportedBy: 'Ahmet Yılmaz',
        reportDate: '2024-01-15',
        assignedTo: 'Elektrik Ekibi',
        estimatedTime: '2 saat',
        responses: [
          {
            id: '1',
            message: 'Sorun bildiriminiz alındı. Elektrik ekibimiz en kısa sürede müdahale edecektir.',
            author: 'Teknik Destek',
            date: '2024-01-15',
            isStaff: true
          }
        ]
      },
      {
        id: '2',
        title: 'Ana Girişte Yol Çalışması',
        description: 'Ana giriş yolunda onarım çalışmaları devam ediyor. Alternatif güzergah belirtilmeli.',
        category: 'yol_calismasi',
        priority: 'yuksek',
        status: 'inceleniyor',
        location: 'Ana Giriş Yolu',
        reportedBy: 'Mehmet Demir',
        reportDate: '2024-01-14',
        assignedTo: 'İdari İşler',
        estimatedTime: '3 gün',
        responses: []
      },
      {
        id: '3',
        title: 'Kütüphanede İnternet Yavaş',
        description: 'Kütüphanede WiFi bağlantısı çok yavaş. Araştırma yapmak neredeyse imkansız.',
        category: 'internet',
        priority: 'orta',
        status: 'beklemede',
        location: 'Merkez Kütüphane',
        reportedBy: 'Ayşe Kaya',
        reportDate: '2024-01-13',
        responses: []
      }
    ];
  };

  const [tickets, setTickets] = useState<SupportTicket[]>(getInitialTickets);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'genel',
    priority: 'orta',
    location: ''
  });

  // Tickets değiştiğinde localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem('supportTickets', JSON.stringify(tickets));
    } catch (error) {
      console.error('SupportTickets localStorage\'a kaydedilemedi:', error);
    }
  }, [tickets]);

  const categoryIcons = {
    elektrik: <ElectricalServices />,
    internet: <Router />,
    yol_calismasi: <Construction />,
    bilgisayar: <Computer />,
    kantin: <LocalCafe />,
    guvenlik: <Security />,
    temizlik: <CleaningServices />,
    havalandirma: <Air />,
    telefon: <Phone />,
    genel: <Support />
  };

  const categoryLabels = {
    elektrik: 'Elektrik Arızası',
    internet: 'İnternet/WiFi',
    yol_calismasi: 'Yol Çalışması',
    bilgisayar: 'Bilgisayar/Teknik',
    kantin: 'Kantin/Kafeterya',
    guvenlik: 'Güvenlik',
    temizlik: 'Temizlik',
    havalandirma: 'Havalandırma/Isıtma',
    telefon: 'Telefon Sistemi',
    genel: 'Genel Sorunlar'
  };

  const priorityLabels = {
    dusuk: 'Düşük',
    orta: 'Orta',
    yuksek: 'Yüksek',
    acil: 'Acil'
  };

  const priorityColors = {
    dusuk: '#4caf50',
    orta: '#ff9800',
    yuksek: '#f44336',
    acil: '#d32f2f'
  };

  const statusLabels = {
    beklemede: 'Beklemede',
    inceleniyor: 'İnceleniyor',
    cozumde: 'Çözümde',
    tamamlandi: 'Tamamlandı',
    iptal: 'İptal Edildi'
  };

  const statusColors = {
    beklemede: '#757575',
    inceleniyor: '#2196f3',
    cozumde: '#ff9800',
    tamamlandi: '#4caf50',
    iptal: '#f44336'
  };

  const getStatusSteps = (status: string) => {
    const steps = ['beklemede', 'inceleniyor', 'cozumde', 'tamamlandi'];
    return steps.indexOf(status);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.location) {
      return;
    }

    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category as any,
      priority: formData.priority as any,
      status: 'beklemede',
      location: formData.location,
      reportedBy: `${user?.first_name} ${user?.last_name}`,
      reportDate: new Date().toISOString().split('T')[0],
      responses: []
    };

    setTickets(prev => [newTicket, ...prev]);
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      category: 'genel',
      priority: 'orta',
      location: ''
    });
  };

  const getTicketStats = () => {
    const total = tickets.length;
    const pending = tickets.filter(t => t.status === 'beklemede').length;
    const inProgress = tickets.filter(t => t.status === 'inceleniyor' || t.status === 'cozumde').length;
    const completed = tickets.filter(t => t.status === 'tamamlandi').length;
    
    return { total, pending, inProgress, completed };
  };

  const stats = getTicketStats();

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <Support sx={{ mr: 2 }} />
          Teknik Destek
        </Typography>
        
        <Alert severity="info" sx={{ maxWidth: 400 }}>
          Okul ile ilgili tüm sorunlarınızı buradan bildirebilirsiniz
        </Alert>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">{stats.total}</Typography>
            <Typography variant="body2">Toplam Talep</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">{stats.pending}</Typography>
            <Typography variant="body2">Bekleyen</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">{stats.inProgress}</Typography>
            <Typography variant="body2">İşlemde</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">{stats.completed}</Typography>
            <Typography variant="body2">Tamamlanan</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Sorun ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                startAdornment={<FilterList sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">Tüm Kategoriler</MenuItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
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
                startAdornment={<Assignment sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">Tüm Durumlar</MenuItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary" align="center">
              {filteredTickets.length} talep bulundu
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tickets List */}
      <Grid container spacing={2}>
        {filteredTickets.map((ticket) => (
          <Grid item xs={12} key={ticket.id}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {categoryIcons[ticket.category]}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6">{ticket.title}</Typography>
                      <Chip 
                        label={categoryLabels[ticket.category]}
                        size="small"
                        variant="outlined"
                      />
                      <Chip 
                        label={priorityLabels[ticket.priority]}
                        size="small"
                        sx={{ 
                          backgroundColor: priorityColors[ticket.priority],
                          color: 'white',
                          fontWeight: 500
                        }}
                      />
                      <Chip 
                        label={statusLabels[ticket.status]}
                        size="small"
                        sx={{ 
                          backgroundColor: statusColors[ticket.status],
                          color: 'white',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{ticket.location}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Person sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{ticket.reportedBy}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{ticket.reportDate}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {ticket.description}
                  </Typography>
                  
                  {ticket.assignedTo && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Atanan Ekip:</strong> {ticket.assignedTo}
                      </Typography>
                      {ticket.estimatedTime && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Tahmini Süre:</strong> {ticket.estimatedTime}
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {/* Progress Stepper */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>İşlem Durumu:</Typography>
                    <Stepper activeStep={getStatusSteps(ticket.status)} alternativeLabel>
                      <Step>
                        <StepLabel>Beklemede</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>İnceleniyor</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Çözümde</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Tamamlandı</StepLabel>
                      </Step>
                    </Stepper>
                  </Box>
                  
                  {/* Responses */}
                  {ticket.responses.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>Yanıtlar:</Typography>
                      {ticket.responses.map((response) => (
                        <Paper key={response.id} sx={{ p: 2, mb: 1, backgroundColor: response.isStaff ? '#e3f2fd' : '#f5f5f5' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" color={response.isStaff ? 'primary' : 'text.primary'}>
                              {response.author}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {response.date}
                            </Typography>
                          </Box>
                          <Typography variant="body2">{response.message}</Typography>
                        </Paper>
                      ))}
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      {filteredTickets.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Henüz destek talebi bulunamadı
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            İlk sorun bildiriminizi oluşturmak için + butonuna tıklayın
          </Typography>
        </Paper>
      )}

      {/* Add Support Ticket FAB */}
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

      {/* Add Ticket Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Support sx={{ mr: 2 }} />
            Sorun Bildir
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sorun Başlığı"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Örn: A205 Sınıfında Ampul Bozuk"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
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
                  label="Konum"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                  placeholder="Örn: A Blok 205 No'lu Sınıf, Merkez Kütüphane, Ana Giriş"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sorun Açıklaması"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={4}
                  required
                  placeholder="Sorunu detaylı olarak açıklayınız..."
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
            disabled={!formData.title || !formData.description || !formData.location}
          >
            Sorun Bildir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SupportPage; 