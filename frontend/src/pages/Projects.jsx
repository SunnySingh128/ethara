import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, Folder, Users, ChevronRight } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
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
    if (user) fetchProjects();
  }, [user]);

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1>My Projects</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your team projects and workspaces</p>
        </div>
        {user?.role === 'Admin' && (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Create Project
          </button>
        )}
      </div>

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
