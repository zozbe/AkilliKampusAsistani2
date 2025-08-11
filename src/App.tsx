import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import Layout from './components/Layout/Layout';
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AnnouncementsPage from './pages/Announcements/AnnouncementsPage';
import EventsPage from './pages/Events/EventsPage';
import MenuPage from './pages/Menu/MenuPage';
import SchedulePage from './pages/Schedule/SchedulePage';
import TransportPage from './pages/Transport/TransportPage';
import MapPage from './pages/Map/MapPage';
import SupportPage from './pages/Support/SupportPage';
import FilesPage from './pages/Files/FilesPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import ProfilePage from './pages/Profile/ProfilePage';

import { RootState } from './store/store';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/*" 
          element={isAuthenticated ? <AuthenticatedRoutes /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Box>
  );
}

function AuthenticatedRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/transport" element={<TransportPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App; 