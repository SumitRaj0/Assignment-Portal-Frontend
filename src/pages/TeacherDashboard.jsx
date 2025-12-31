import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [submissions, setSubmissions] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    fetchAssignments();
    fetchAnalytics();
  }, [statusFilter, currentPage]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      let url = `/assignments?page=${currentPage}&limit=10`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      const response = await api.get(url);
      setAssignments(response.data.assignments || response.data);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/assignments/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleCreate = () => {
    setEditingAssignment(null);
    setFormData({ title: '', description: '', dueDate: '' });
    setShowForm(true);
  };

  const handleEdit = (assignment) => {
    if (assignment.status !== 'Draft') {
      alert('Can only edit Draft assignments');
      return;
    }
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate.split('T')[0]
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await api.put(`/assignments/${editingAssignment._id}`, formData);
      } else {
        await api.post('/assignments', formData);
      }
      setShowForm(false);
      setEditingAssignment(null);
      fetchAssignments();
      fetchAnalytics();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving assignment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      await api.delete(`/assignments/${id}`);
      fetchAssignments();
      fetchAnalytics();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting assignment');
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.post(`/assignments/${id}/publish`);
      fetchAssignments();
      fetchAnalytics();
    } catch (error) {
      alert(error.response?.data?.message || 'Error publishing assignment');
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.post(`/assignments/${id}/complete`);
      fetchAssignments();
      fetchAnalytics();
    } catch (error) {
      alert(error.response?.data?.message || 'Error completing assignment');
    }
  };

  const handleViewSubmissions = async (id) => {
    try {
      const response = await api.get(`/assignments/${id}/submissions`);
      setSubmissions(response.data);
      setSelectedAssignment(assignments.find(a => a._id === id));
    } catch (error) {
      alert(error.response?.data?.message || 'Error fetching submissions');
    }
  };

  const handleMarkReviewed = async (submissionId) => {
    try {
      await api.post(`/assignments/submissions/${submissionId}/review`);
      if (selectedAssignment) {
        handleViewSubmissions(selectedAssignment._id);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error marking submission as reviewed');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Draft') return 'bg-gray-100 text-gray-800';
    if (status === 'Published') return 'bg-gray-100 text-gray-800';
    if (status === 'Completed') return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1 px-2 py-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Home</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold">Teacher Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {analytics && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Dashboard Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Total Assignments</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.summary.totalAssignments}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Published Assignments</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.summary.publishedAssignments}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.summary.totalSubmissions}</p>
              </div>
            </div>
            {analytics.assignments.length > 0 && (
              <div className="mt-5 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold mb-3 text-gray-700">Submissions per Assignment:</p>
                <div className="space-y-2.5">
                  {analytics.assignments.map((item) => (
                    <div key={item.assignmentId} className="flex justify-between items-center text-sm py-1.5">
                      <span className="text-gray-800 font-medium">{item.title}</span>
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-200 text-gray-800">
                        {item.submissionCount} submission{item.submissionCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">My Assignments</h2>
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors shadow-sm"
          >
            + Create Assignment
          </button>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAssignment(null);
                  }}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {submissions && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Submissions: {selectedAssignment?.title}
              </h3>
              <button
                onClick={() => {
                  setSubmissions(null);
                  setSelectedAssignment(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
            </div>
            {submissions.length === 0 ? (
              <p className="text-gray-500">No submissions yet</p>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission._id} className="border border-gray-200 rounded p-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">
                          {submission.studentId?.name || 'Unknown Student'}
                        </span>
                        {submission.reviewed && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded">
                            Reviewed
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{submission.answer}</p>
                    {!submission.reviewed && (
                      <button
                        onClick={() => handleMarkReviewed(submission._id)}
                        className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 mt-2"
                      >
                        ✓ Mark as Reviewed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {assignments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No assignments found. Create your first assignment!
          </div>
            ) : (
              <>
                <div className="grid gap-4">
                  {assignments.map((assignment) => (
                    <div key={assignment._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{assignment.title}</h3>
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium mt-2 ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{assignment.description}</p>
                      <div className="flex space-x-2">
                        {assignment.status === 'Draft' && (
                          <>
                            <button
                              onClick={() => handleEdit(assignment)}
                              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(assignment._id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handlePublish(assignment._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                            >
                              Publish
                            </button>
                          </>
                        )}
                        {assignment.status === 'Published' && (
                          <>
                            <button
                              onClick={() => handleViewSubmissions(assignment._id)}
                              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                            >
                              View Submissions
                            </button>
                            <button
                              onClick={() => handleComplete(assignment._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                            >
                              Mark Completed
                            </button>
                          </>
                        )}
                        {assignment.status === 'Completed' && (
                          <button
                            onClick={() => handleViewSubmissions(assignment._id)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                          >
                            View Submissions
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {pagination.totalPages > 1 && (
                  <div className="mt-6 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-gray-700">
                      Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total)
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={currentPage === pagination.totalPages}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
      </div>
    </div>
  );
};

export default TeacherDashboard;

