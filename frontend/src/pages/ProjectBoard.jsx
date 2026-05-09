import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Calendar, User } from 'lucide-react';

const ProjectBoard = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const statuses = ['Todo', 'In Progress', 'Done'];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/tasks/project/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setTasks(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchTasks();
  }, [id, user]);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus }, {
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
        <h1>Project Board</h1>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> New Task
        </button>
      </div>

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                        background: task.priority === 'High' ? '#f43f5e20' : '#6366f120',
                        color: task.priority === 'High' ? 'var(--accent)' : 'var(--primary)'
                      }}>
                        {task.priority}
                      </span>
                      <MoreVertical size={16} color="var(--text-muted)" />
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
