const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect, admin } = require('../middleware/auth');

// @desc    Create a new project
// @route   POST /api/projects
router.post('/', protect, admin, async (req, res) => {
  const { name, description, members } = req.body;

  const project = new Project({
    name,
    description,
    admin: req.user._id,
    members: members || [],
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Get all projects (Admin sees all, Member sees assigned)
// @route   GET /api/projects
router.get('/', protect, async (req, res) => {
  let projects;
  if (req.user.role === 'Admin') {
    projects = await Project.find({}).populate('admin', 'name email');
  } else {
    projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }],
    }).populate('admin', 'name email');
  }
  res.json(projects);
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
router.get('/:id', protect, async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('admin', 'name email')
    .populate('members', 'name email');

  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

// @desc    Delete a project and its tasks
// @route   DELETE /api/projects/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify the user is the admin of the project
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });

    // Delete the project itself
    await Project.deleteOne({ _id: req.params.id });

    res.json({ message: 'Project and associated tasks removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
