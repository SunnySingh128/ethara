const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
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

module.exports = router;
