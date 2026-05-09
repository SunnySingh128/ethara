import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Calendar, User } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const ProjectBoard = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const statuses = ['Todo', 'In Progress', 'Done'];

  const fetchData = async () => {
    try {
      const [taskRes, projectRes] = await Promise.all([
        axios.get(`${API}/api/tasks/project/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        }),
        axios.get(`${API}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
      ]);
      setTasks(taskRes.data);
      setProject(projectRes.data);
      setAssignedTo(user._id);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [id, user]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/tasks`, {
        title,
        description,
        priority,
        dueDate,
        project: id,
        assignedTo: assignedTo || user._id
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      fetchData();
    } catch (err) {
      alert('Failed to create task: ' + (err.response?.data?.message || err.message));
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`${API}/api/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container" style={{ padding: '40px' }}>Loading tasks...</div>;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ marginBottom: '5px' }}>Project Board</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and track your project tasks</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass"
            style={{ padding: '40px', width: '100%', maxWidth: '500px' }}
          >
            <h2 style={{ marginBottom: '20px' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task details..."
                  required
                  style={{ width: '100%', height: '80px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', padding: '12px', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', outline: 'none' }}
                  >
                    <option value="Low" style={{ color: 'black' }}>Low</option>
                    <option value="Medium" style={{ color: 'black' }}>Medium</option>
                    <option value="High" style={{ color: 'black' }}>High</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Due Date</label>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Assign To</label>
                  <select 
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', outline: 'none' }}
                  >
                    <option value={project?.admin?._id} style={{ color: 'black' }}>{project?.admin?.name} (Admin)</option>
                    {project?.members?.map(m => (
                      <option key={m._id} value={m._id} style={{ color: 'black' }}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Task</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white' }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', alignItems: 'start' }}>
        {statuses.map((status) => (
          <div key={status} className="column">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: status === 'Done' ? 'var(--success)' : status === 'In Progress' ? 'var(--warning)' : 'var(--text-muted)' }}></span>
                {status}
              </h3>
              <span className="glass" style={{ padding: '2px 10px', fontSize: '0.8rem', borderRadius: '20px' }}>
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', minHeight: '200px' }}>
              <AnimatePresence>
                {tasks.filter(t => t.status === status).map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass"
                    style={{ padding: '20px', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        background: task.priority === 'High' ? '#f43f5e20' : task.priority === 'Medium' ? '#f59e0b20' : '#10b98120',
                        color: task.priority === 'High' ? 'var(--accent)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'
                      }}>
                        {task.priority}
                      </span>
                      <select 
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}
                      >
                        {statuses.map(s => <option key={s} value={s} style={{ color: 'black' }}>{s}</option>)}
                      </select>
                    </div>
                    <h4 style={{ marginBottom: '8px' }}>{task.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px' }}>{task.description}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Calendar size={14} />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                        {task.assignedTo?.name?.charAt(0) || 'U'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectBoard;
