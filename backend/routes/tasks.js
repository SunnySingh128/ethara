const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// @desc    Create a task
// @route   POST /api/tasks
router.post('/', protect, async (req, res) => {
  const { title, description, status, priority, dueDate, project, assignedTo } = req.body;

  const Project = require('../models/Project');
  const projectDoc = await Project.findById(project);
  
  if (!projectDoc) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (projectDoc.admin.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Only project admin can assign tasks' });
  }

  const task = new Task({
    title,
    description,
    status,
    priority,
    dueDate,
    project,
    assignedTo,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
});

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const Project = require('../models/Project');
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let query = { project: req.params.projectId };

    // If user is not the admin of this project, they only see tasks assigned to them
    if (project.admin.toString() !== req.user._id.toString()) {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update task status
// @route   PUT /api/tasks/:id
router.put('/:id', protect, async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    task.status = status || task.status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
router.get('/stats', protect, async (req, res) => {
  const totalTasks = await Task.countDocuments({ assignedTo: req.user._id });
  const completedTasks = await Task.countDocuments({ assignedTo: req.user._id, status: 'Done' });
  const pendingTasks = await Task.countDocuments({ assignedTo: req.user._id, status: { $ne: 'Done' } });
  const overdueTasks = await Task.countDocuments({ 
    assignedTo: req.user._id, 
    status: { $ne: 'Done' },
    dueDate: { $lt: new Date() }
  });

  res.json({ totalTasks, completedTasks, pendingTasks, overdueTasks });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const Project = require('../models/Project');
    const projectDoc = await Project.findById(task.project);
    
    if (projectDoc && projectDoc.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project admin can delete tasks' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
