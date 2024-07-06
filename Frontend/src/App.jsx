import Signup from './pages/auth/signup/Signup';
import Login from './pages/auth/Login/Login';
import Home from './pages/Home/Home';
import Notification from './pages/Notification/Notification';
import Profile from './pages/Profile/ProfilePage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPael';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authuser'],
    queryFn: async () => {
      const res = await fetch('/api/user/me');
      const data = await res.json();
      if (data.status === 'fail') return null;
      return data.user;
    },
    retry: false,
  });

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <>
      <ReactQueryDevtools />
      <BrowserRouter>
        <div className="flex max-w-6xl mx-auto">
          {authUser && <Sidebar />}
          <Routes>
            <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
            <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
            <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
            <Route
              path="/notifications"
              element={authUser ? <Notification /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile/:username"
              element={authUser ? <Profile /> : <Navigate to="/login" />}
            />
          </Routes>
          {authUser && <RightPanel />}
        </div>
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
