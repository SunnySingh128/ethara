import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, Folder, Users, ChevronRight } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const { user } = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/projects', 
        { name: newName, description: newDesc },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNewName('');
      setNewDesc('');
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      alert('Failed to create project: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1>My Projects</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your team projects and workspaces</p>
        </div>
        {user?.role === 'Admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Create Project
          </button>
        )}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass"
            style={{ padding: '40px', width: '100%', maxWidth: '500px' }}
          >
            <h2 style={{ marginBottom: '20px' }}>New Project</h2>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Project Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Website Redesign"
                  required
                />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief overview of the project..."
                  required
                  style={{ width: '100%', height: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', padding: '12px', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white' }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="glass"
            style={{ padding: '25px', position: 'relative' }}
          >
            <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', background: 'var(--primary)20', borderRadius: '12px', height: 'fit-content' }}>
                  <Folder color="var(--primary)" size={24} />
                </div>
                <div>
                  <h3 style={{ marginBottom: '5px' }}>{project.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{project.description}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <Users size={16} />
                  <span>{project.members?.length + 1} members</span>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
