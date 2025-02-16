import './App.css';
import Login from './Pages/Login.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './Pages/Root.jsx';
import MainLayout from './Pages/Main.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Payout from './Pages/Payout.jsx';
import Analytics from './Pages/Analytics.jsx';
import { AppProvider } from './store/AppContext.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    id: 'root',
    element: <RootLayout />,
    children: [
      { index: true, element: <Login /> },
      {
        path: '/', element: <MainLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/payout', element: <Payout /> },
          { path: '/analytics', element: <Analytics /> }
        ]
      }
    ]
  }
])

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
