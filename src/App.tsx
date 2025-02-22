import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import PackageDetails from './pages/PackageDetails';
import Packages from './pages/Packages';
import Login from './pages/members/Login';
import Register from './pages/members/Register';
import Dashboard from './pages/members/Dashboard';
import CategoryGallery from './pages/gallery/CategoryGallery';
import AlbumPage from './pages/gallery/AlbumPage';

function App() {
  return (
    <Router 
      future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}
    >
      <Layout>
        <div className="relative">
          <Toaster position="bottom-center" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:category" element={<CategoryGallery />} />
            <Route path="/gallery/album/:albumId" element={<AlbumPage />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:packageId" element={<PackageDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;