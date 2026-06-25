import { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAppSelector } from '@/shared/store';
import { darkTheme, lightTheme } from '@/shared/theme';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import DemoHub from '@/pages/DemoHub';
import WhiteboardPage from '@/modules/whiteboard/pages/WhiteboardPage';
import AgentsPage from '@/modules/agents/pages/AgentsPage';
import ConciergePage from '@/modules/concierge/pages/ConciergePage';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

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
                <Route path="/whiteboard" element={<WhiteboardPage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/concierge" element={<ConciergePage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DndProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
