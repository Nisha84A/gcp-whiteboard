import { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAppSelector } from '@/store';
import { darkTheme, lightTheme } from '@/theme';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import DemoHub from '@/pages/DemoHub';
import Dashboard from '@/pages/Dashboard';
import AgentsDemo from '@/pages/AgentsDemo';
import ConciergeDemo from '@/pages/ConciergeDemo';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  const mode = useAppSelector((state) => state.theme.mode);
  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DndProvider backend={HTML5Backend}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DemoHub />} />
                <Route path="/whiteboard" element={<Dashboard />} />
                <Route path="/agents" element={<AgentsDemo />} />
                <Route path="/concierge" element={<ConciergeDemo />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DndProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
