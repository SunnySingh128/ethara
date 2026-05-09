import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, BarChart3 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API}/api/tasks/stats`, {
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
    <div className="container" style={{ padding: '60px 0' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <header style={{ marginBottom: '60px', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass"
            style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '100px', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--primary)', border: '1px solid var(--primary)30' }}
          >
            👋 Welcome back, {user?.name}
          </motion.div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '15px', background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            System Overview
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Track your team's performance and project milestones in one centralized workspace.
          </p>
        </header>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' }}>
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass"
              style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: `${card.color}10`, borderRadius: '50%', filter: 'blur(40px)' }}></div>
              
              <div style={{ background: `${card.color}15`, width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                {card.icon}
              </div>
              
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.title}</p>
                <h3 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{card.value}</h3>
              </div>
              
              <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '70%' }}
                  transition={{ delay: 1, duration: 1 }}
                  style={{ height: '100%', background: card.color, borderRadius: '10px', boxShadow: `0 0 10px ${card.color}50` }}
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
