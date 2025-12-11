import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Wiki } from './pages/Wiki';
import { Tech } from './pages/Tech';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="wiki" element={<Wiki />} />
        <Route path="tech" element={<Tech />} />
      </Route>
    </Routes>
  );
}

export default App;
