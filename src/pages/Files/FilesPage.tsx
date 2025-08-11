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
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add,
  CloudUpload,
  Description,
  PictureAsPdf,
  VideoLibrary,
  Image,
  Archive,
  Download,
  Delete,
  Edit,
  Folder,
  School,
  Person,
  AccessTime,
  FilterList,
  Search
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface CourseFile {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'ppt' | 'doc' | 'image' | 'video' | 'archive';
  category: 'ders_notu' | 'slayt' | 'odev' | 'sinav' | 'lab' | 'proje';
  courseCode: string;
  courseName: string;
  uploadedBy: string;
  uploadDate: string;
  downloadCount: number;
  isVisible: boolean;
}

const FilesPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Başlangıç verilerini tanımla
  const getInitialFiles = (): CourseFile[] => {
    const savedFiles = localStorage.getItem('courseFiles');
    if (savedFiles) {
      try {
        return JSON.parse(savedFiles);
      } catch (error) {
        console.error('Kaydedilmiş dosya verileri okunamadı:', error);
      }
    }
    
    // Default veriler
    return [
      {
        id: '1',
        title: 'JavaScript Temelleri',
        description: 'JavaScript programlama dilinin temel konuları',
        fileName: 'javascript-temelleri.pdf',
        fileSize: '2.5 MB',
        fileType: 'pdf',
        category: 'ders_notu',
        courseCode: 'CSE101',
        courseName: 'Programlama Temelleri',
        uploadedBy: 'Dr. Ahmet Yılmaz',
        uploadDate: '2024-01-15',
        downloadCount: 45,
        isVisible: true
      },
      {
        id: '2',
        title: 'React Components Slaytları',
        description: 'React bileşenleri ve props konularının anlatımı',
        fileName: 'react-components.pptx',
        fileSize: '8.1 MB',
        fileType: 'ppt',
        category: 'slayt',
        courseCode: 'CSE301',
        courseName: 'Web Programlama',
        uploadedBy: 'Prof. Dr. Ayşe Demir',
        uploadDate: '2024-01-10',
        downloadCount: 32,
        isVisible: true
      }
    ];
  };

  const [files, setFiles] = useState<CourseFile[]>(getInitialFiles);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ders_notu',
    courseCode: '',
    courseName: ''
  });

  // Files değiştiğinde localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem('courseFiles', JSON.stringify(files));
    } catch (error) {
      console.error('CourseFiles localStorage\'a kaydedilemedi:', error);
    }
  }, [files]);

  const fileTypeIcons = {
    pdf: <PictureAsPdf sx={{ color: '#d32f2f' }} />,
    ppt: <Description sx={{ color: '#ff9800' }} />,
    doc: <Description sx={{ color: '#2196f3' }} />,
    image: <Image sx={{ color: '#4caf50' }} />,
    video: <VideoLibrary sx={{ color: '#9c27b0' }} />,
    archive: <Archive sx={{ color: '#607d8b' }} />
  };

  const categoryLabels = {
    ders_notu: 'Ders Notu',
    slayt: 'Slayt/Sunum',
    odev: 'Ödev',
    sinav: 'Sınav',
    lab: 'Laboratuvar',
    proje: 'Proje'
  };

  const categoryColors = {
    ders_notu: '#2196f3',
    slayt: '#ff9800',
    odev: '#4caf50',
    sinav: '#f44336',
    lab: '#9c27b0',
    proje: '#607d8b'
  };

  const isStaff = user?.role === 'staff' || user?.role === 'admin';

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || file.category === filterCategory;
    const matchesCourse = filterCourse === 'all' || file.courseCode === filterCourse;
    
    return matchesSearch && matchesCategory && matchesCourse;
  });

  const uniqueCourses = Array.from(new Set(files.map(file => file.courseCode)));

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, title: file.name.split('.')[0] }));
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || !formData.title || !formData.courseCode || !formData.courseName) {
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const fileType = selectedFile.name.split('.').pop()?.toLowerCase() as any;
          const newFile: CourseFile = {
            id: Date.now().toString(),
            title: formData.title,
            description: formData.description,
            fileName: selectedFile.name,
            fileSize: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
            fileType: fileType === 'pptx' || fileType === 'ppt' ? 'ppt' : 
                     fileType === 'docx' || fileType === 'doc' ? 'doc' :
                     fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg' ? 'image' :
                     fileType === 'mp4' || fileType === 'avi' ? 'video' :
                     fileType === 'zip' || fileType === 'rar' ? 'archive' : 'pdf',
            category: formData.category as any,
            courseCode: formData.courseCode,
            courseName: formData.courseName,
            uploadedBy: `${user?.first_name} ${user?.last_name}`,
            uploadDate: new Date().toISOString().split('T')[0],
            downloadCount: 0,
            isVisible: true
          };

          setFiles(prev => [newFile, ...prev]);
          setOpen(false);
          setSelectedFile(null);
          setFormData({
            title: '',
            description: '',
            category: 'ders_notu',
            courseCode: '',
            courseName: ''
          });
          setUploadProgress(0);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownload = (file: CourseFile) => {
    setFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, downloadCount: f.downloadCount + 1 } : f
    ));
  };

  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <Folder sx={{ mr: 2 }} />
          Dosya Paylaşımı
        </Typography>
        
        {!isStaff && (
          <Alert severity="info" sx={{ maxWidth: 400 }}>
            Sadece akademisyenler dosya yükleyebilir
          </Alert>
        )}
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Dosya ara..."
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
              <InputLabel>Ders</InputLabel>
              <Select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                startAdornment={<School sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">Tüm Dersler</MenuItem>
                {uniqueCourses.map(course => (
                  <MenuItem key={course} value={course}>{course}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary" align="center">
              {filteredFiles.length} dosya bulundu
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Files List */}
      <Grid container spacing={2}>
        {filteredFiles.map((file) => (
          <Grid item xs={12} key={file.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {fileTypeIcons[file.fileType]}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6">{file.title}</Typography>
                      <Chip 
                        label={categoryLabels[file.category]}
                        size="small"
                        sx={{ 
                          backgroundColor: categoryColors[file.category],
                          color: 'white',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {file.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <School sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          {file.courseCode} - {file.courseName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Person sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{file.uploadedBy}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{file.uploadDate}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {file.fileName} • {file.fileSize}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {file.downloadCount} indirme
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleDownload(file)}
                      title="İndir"
                    >
                      <Download />
                    </IconButton>
                    
                    {isStaff && file.uploadedBy.includes(user?.first_name || '') && (
                      <>
                        <IconButton color="secondary" title="Düzenle">
                          <Edit />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(file.id)}
                          title="Sil"
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredFiles.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Henüz dosya bulunamadı
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {isStaff ? 'İlk dosyayı yüklemek için + butonuna tıklayın' : 'Akademisyenler dosya paylaştığında burada görünecek'}
          </Typography>
        </Paper>
      )}

      {/* Upload FAB - Only for staff */}
      {isStaff && (
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

      {/* Upload Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CloudUpload sx={{ mr: 2 }} />
            Ders İçeriği Yükle
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ 
                    p: 3,
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    '&:hover': { borderStyle: 'dashed' }
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <CloudUpload sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h6">
                      {selectedFile ? selectedFile.name : 'Dosya Seç'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      PDF, PPT, DOC, görsel veya video dosyalarını yükleyebilirsiniz
                    </Typography>
                  </Box>
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.mp4,.avi,.zip,.rar"
                    onChange={handleFileSelect}
                  />
                </Button>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Başlık"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
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
                <TextField
                  fullWidth
                  label="Ders Kodu"
                  value={formData.courseCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
                  required
                  placeholder="Örn: CSE101"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ders Adı"
                  value={formData.courseName}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                  required
                  placeholder="Örn: Programlama Temelleri"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Açıklama"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={3}
                  placeholder="Dosya hakkında kısa bilgi..."
                />
              </Grid>
              
              {uploadProgress > 0 && (
                <Grid item xs={12}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    Yükleniyor... %{uploadProgress}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={!selectedFile || !formData.title || !formData.courseCode || !formData.courseName || uploadProgress > 0}
          >
            Yükle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FilesPage; 