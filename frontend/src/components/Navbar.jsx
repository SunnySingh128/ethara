import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FolderKanban } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="glass" style={{ 
      margin: '20px auto', 
      maxWidth: '1200px',
      padding: '10px 30px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: '20px',
      zIndex: 100,
      borderRadius: '20px',
      border: '1px solid rgba(139, 92, 246, 0.2)'
    }}>
      <Link to="/" style={{ 
        fontSize: '1.8rem', 
        fontWeight: '900', 
        background: 'linear-gradient(to right, var(--primary), #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textDecoration: 'none',
        letterSpacing: '-1px'
      }}>
        TaskNova
      </Link>
      
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/projects" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
              <FolderKanban size={18} /> Projects
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingLeft: '20px', borderLeft: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '-2px' }}>{user.name}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role}</p>
              </div>
              <button onClick={logout} className="btn-primary" style={{ padding: '10px', borderRadius: '12px', background: 'var(--accent)' }}>
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
