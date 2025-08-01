import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDetails, setEditedDetails] = useState('');
  const [editedCompleted, setEditedCompleted] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const response = await axios.post(API_URL, { title: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditedTitle(task.title);
    setEditedDetails(task.details || '');
    setEditedCompleted(task.completed);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editedTitle.trim()) return;
    try {
      const response = await axios.put(`${API_URL}/${editingTask._id}`, { title: editedTitle, details: editedDetails, completed: editedCompleted });
      setTasks(tasks.map(task => (task._id === editingTask._id ? response.data : task)));
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const renderHomePage = () => (
    <div className="home-page-content">
      <h1 className="name-title">Rohith Sadanala</h1>
      <div className="project-info">
        <h2>Full-Stack Project</h2>
        <h3>CRUD Functions Implemented:</h3>
        <table className="crud-table">
          <thead>
            <tr>
              <th>Function</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Create</td>
              <td>Add new tasks via a form.</td>
            </tr>
            <tr>
              <td>Read</td>
              <td>Fetch and display all tasks from the database.</td>
            </tr>
            <tr>
              <td>Update</td>
              <td>Edit existing task text and toggle completion status.</td>
            </tr>
            <tr>
              <td>Delete</td>
              <td>Remove tasks from the database.</td>
            </tr>
          </tbody>
        </table>
        <div className="button-container">
          <button className="nav-button" onClick={() => setShowHomePage(false)}>
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
  
  const renderEditPage = () => (
    <div className="edit-page-container">
      <div className="button-container">
        <button className="nav-button" onClick={handleCancelEdit}>
          &larr; Go Back
        </button>
      </div>
      <h2>Edit Task</h2>
      <form onSubmit={handleSaveEdit}>
        <div className="form-group">
          <label htmlFor="task-title">Task Title:</label>
          <input
            id="task-title"
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-details">Task Details:</label>
          <textarea
            id="task-details"
            value={editedDetails}
            onChange={(e) => setEditedDetails(e.target.value)}
            placeholder="Write task details here..."
          ></textarea>
        </div>
        <div className="form-group checkbox-group">
          <label htmlFor="task-completed">Completed:</label>
          <input
            id="task-completed"
            type="checkbox"
            checked={editedCompleted}
            onChange={(e) => setEditedCompleted(e.target.checked)}
          />
        </div>
        <div className="button-group">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleCancelEdit}>Cancel</button>
        </div>
      </form>
    </div>
  );

  const renderTodoList = () => (
    <div className="todo-list-content">
      <h1>MERN To-Do List</h1>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? 'completed' : ''}>
            <span onClick={() => handleToggleComplete(task._id, task.completed)}>
              {task.title}
            </span>
            <div className="task-actions">
              <button onClick={() => handleEditClick(task)}>Edit</button>
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="button-container">
        <button className="nav-button" onClick={() => setShowHomePage(true)}>
          &larr; Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        {editingTask ? renderEditPage() : (showHomePage ? renderHomePage() : renderTodoList())}
      </header>
    </div>
  );
}

export default App;
