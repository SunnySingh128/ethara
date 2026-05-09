import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/tasks/stats', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchStats();
  }, [user]);

  if (!stats) return <div style={{ padding: '40px' }}>Loading...</div>;

  const cards = [
    { title: 'Total Tasks', value: stats.totalTasks, icon: <BarChart3 color="#6366f1" />, color: '#6366f1' },
    { title: 'Completed', value: stats.completedTasks, icon: <CheckCircle2 color="#10b981" />, color: '#10b981' },
    { title: 'Pending', value: stats.pendingTasks, icon: <Clock color="#f59e0b" />, color: '#f59e0b' },
    { title: 'Overdue', value: stats.overdueTasks, icon: <AlertCircle color="#f43f5e" />, color: '#f43f5e' },
  ];

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 style={{ marginBottom: '10px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Quick overview of your team's progress</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass"
              style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>{card.title}</p>
                <h3 style={{ fontSize: '2rem' }}>{card.value}</h3>
              </div>
              <div style={{ background: `${card.color}20`, padding: '15px', borderRadius: '12px' }}>
                {card.icon}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
