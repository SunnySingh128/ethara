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
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
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

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/users');
      setAllUsers(data.filter(u => u._id !== user._id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchUsers();
    }
  }, [user]);

  const toggleMember = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(m => m !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/projects', 
        { name: newName, description: newDesc, members: selectedMembers },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNewName('');
      setNewDesc('');
      setSelectedMembers([]);
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
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Assign Members</label>
                <div style={{ maxHeight: '120px', overflowY: 'auto', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px', border: '1px solid var(--border)' }}>
                  {allUsers.map(u => (
                    <div 
                      key={u._id} 
                      onClick={() => toggleMember(u._id)}
                      style={{ 
                        padding: '8px', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        background: selectedMembers.includes(u._id) ? 'var(--primary)40' : 'transparent',
                        borderRadius: '4px',
                        marginBottom: '4px'
                      }}
                    >
                      <span>{u.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.role}</span>
                    </div>
                  ))}
                  {allUsers.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No other users found</p>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white' }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="glass"
            style={{ padding: '30px', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  background: 'linear-gradient(135deg, var(--primary)20, var(--primary)40)', 
                  borderRadius: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }}>
                  <Folder color="var(--primary)" size={32} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px' }}>{project.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></div>
                    Active Project
                  </div>
                </div>
              </div>
              
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '30px', flex: 1 }}>
                {project.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {[...Array(Math.min(3, project.members?.length + 1))].map((_, i) => (
                    <div key={i} style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: 'var(--primary)', 
                      border: '2px solid var(--bg-dark)',
                      marginLeft: i === 0 ? 0 : '-12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: '700'
                    }}>
                      {i === 0 ? project.admin?.name?.charAt(0) : 'U'}
                    </div>
                  ))}
                  {project.members?.length > 2 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      +{project.members.length - 2}
                    </span>
                  )}
                </div>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)' }}>
                  <ChevronRight size={18} color="var(--primary)" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
