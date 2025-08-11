import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
  Divider,
  Link,
  Avatar
} from '@mui/material';
import {
  Person,
  School,
  Backpack,
  ArrowBack,
  Visibility,
  VisibilityOff,
  EmailOutlined,
  BadgeOutlined,
  LockOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';

type UserRole = 'academic' | 'student' | null;

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '', // e-posta veya öğrenci numarası
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setFormData({ identifier: '', password: '' }); // Formu temizle
  };

  const handleBack = () => {
    setSelectedRole(null);
    setFormData({ identifier: '', password: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(loginStart());
    
    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo kullanıcı verisi - role göre farklı
      const mockUser = {
        id: '1',
        email: selectedRole === 'academic' ? formData.identifier : `${formData.identifier}@iste.edu.tr`,
        first_name: selectedRole === 'academic' ? 'Dr. Ahmet' : 'Mehmet',
        last_name: selectedRole === 'academic' ? 'Yılmaz' : 'Öztürk',
        student_number: selectedRole === 'student' ? formData.identifier : undefined,
        employee_id: selectedRole === 'academic' ? formData.identifier : undefined,
        role: selectedRole === 'academic' ? 'staff' as const : 'student' as const,
        department: selectedRole === 'academic' ? 'Bilgisayar Mühendisliği' : undefined,
        faculty: selectedRole === 'academic' ? 'Mühendislik ve Doğa Bilimleri Fakültesi' : 'Mühendislik ve Doğa Bilimleri Fakültesi',
      };
      
      const mockTokens = {
        token: 'demo-jwt-token',
        refreshToken: 'demo-refresh-token',
      };
      
      dispatch(loginSuccess({
        user: mockUser,
        token: mockTokens.token,
        refreshToken: mockTokens.refreshToken,
      }));
      
      navigate('/dashboard');
    } catch (error) {
      dispatch(loginFailure('Giriş başarısız. Bilgilerinizi kontrol edin.'));
    }
  };

  // Rol seçim ekranı
  if (!selectedRole) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 4
        }}
      >
        <Container maxWidth="md">
          <Paper elevation={8} sx={{ p: 6, borderRadius: 3 }}>
            {/* Logo ve Başlık */}
            <Box textAlign="center" mb={4}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  margin: '0 auto 16px',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                }}
              >
                <School sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                İSTE Akıllı Kampüs
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                İskenderun Teknik Üniversitesi
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
                Lütfen giriş türünüzü seçin
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Size uygun olan giriş tipini seçerek devam edin
              </Typography>
            </Box>

            {/* Rol Seçim Kartları */}
            <Grid container spacing={4} justifyContent="center">
              {/* Akademisyen Girişi */}
              <Grid item xs={12} sm={6} md={5}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                      border: '2px solid',
                      borderColor: 'primary.main'
                    }
                  }}
                  onClick={() => handleRoleSelect('academic')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        margin: '0 auto 16px',
                        bgcolor: 'primary.main'
                      }}
                    >
                      <Person sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Akademisyen Girişi
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Öğretim üyeleri ve akademik personel için
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        • Kurum e-posta adresi ile giriş
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        • Ders yönetimi ve içerik paylaşımı
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        • Öğrenci takip sistemi
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Öğrenci Girişi */}
              <Grid item xs={12} sm={6} md={5}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                      border: '2px solid',
                      borderColor: 'secondary.main'
                    }
                  }}
                  onClick={() => handleRoleSelect('student')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        margin: '0 auto 16px',
                        bgcolor: 'secondary.main'
                      }}
                    >
                      <Backpack sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Öğrenci Girişi
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Kayıtlı öğrenciler için giriş sistemi
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        • Öğrenci numarası ile giriş
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        • Ders programı ve notlar
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        • Kampüs hizmetleri
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Alt Bilgi */}
            <Box textAlign="center" mt={4}>
              <Typography variant="body2" color="text.secondary">
                Giriş yaparak <Link href="#" underline="hover">Kullanım Şartlarını</Link> kabul etmiş olursunuz
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Giriş formu ekranı
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
          {/* Geri Dön Butonu */}
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Rol seçimine geri dön
            </Typography>
          </Box>

          {/* Form Başlığı */}
          <Box textAlign="center" mb={3}>
            <Avatar 
              sx={{ 
                width: 60, 
                height: 60, 
                margin: '0 auto 16px',
                bgcolor: selectedRole === 'academic' ? 'primary.main' : 'secondary.main'
              }}
            >
              {selectedRole === 'academic' ? <Person /> : <Backpack />}
            </Avatar>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              {selectedRole === 'academic' ? 'Akademisyen Girişi' : 'Öğrenci Girişi'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedRole === 'academic' 
                ? 'Kurum hesabınızla giriş yapın'
                : 'Öğrenci bilgilerinizle giriş yapın'
              }
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Kimlik Alanı */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="identifier"
              label={selectedRole === 'academic' ? 'E-posta Adresi' : 'Öğrenci Numarası'}
              name="identifier"
              autoComplete={selectedRole === 'academic' ? 'email' : 'username'}
              autoFocus
              value={formData.identifier}
              onChange={handleChange}
              disabled={loading}
              placeholder={selectedRole === 'academic' ? 'ornek@iste.edu.tr' : '202112345'}
              InputProps={{
                startAdornment: selectedRole === 'academic' ? <EmailOutlined sx={{ mr: 1, color: 'text.secondary' }} /> : <BadgeOutlined sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            
            {/* Şifre Alanı */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: <LockOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            
            {/* Şifremi Unuttum */}
            <Box textAlign="right" mt={1}>
              <Link href="#" variant="body2" underline="hover">
                Şifremi unuttum
              </Link>
            </Box>
            
            {/* Giriş Butonu */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>


          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage; 