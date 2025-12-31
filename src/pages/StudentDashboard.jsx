import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [viewingSubmission, setViewingSubmission] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAssignments();
  }, [currentPage]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/submissions/assignments?page=${currentPage}&limit=10`);
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

  const handleSubmit = async (assignmentId) => {
    if (!submissionText.trim()) {
      alert('Please enter your answer');
      return;
    }

    try {
      await api.post('/submissions', {
        assignmentId,
        answer: submissionText
      });
      setSubmittingAssignment(null);
      setSubmissionText('');
      fetchAssignments();
      alert('Submission successful!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error submitting assignment';
      alert(errorMessage);
    }
  };

  const handleViewSubmission = async (assignmentId) => {
    try {
      const response = await api.get(`/submissions/assignment/${assignmentId}`);
      setViewingSubmission(response.data);
      setSelectedAssignment(assignments.find(a => a._id === assignmentId));
    } catch (error) {
      alert(error.response?.data?.message || 'Error fetching submission');
    }
  };

  const isPastDueDate = (dueDate) => {
    return new Date() > new Date(dueDate);
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
              <h1 className="text-xl font-semibold">Student Dashboard</h1>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Available Assignments</h2>

        {submittingAssignment && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Submit: {submittingAssignment.title}
              </h3>
              <button
                onClick={() => {
                  setSubmittingAssignment(null);
                  setSubmissionText('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>
            </div>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              rows="6"
              placeholder="Enter your answer here..."
            />
            <button
              onClick={() => handleSubmit(submittingAssignment._id)}
              className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              Submit Answer
            </button>
          </div>
        )}

        {viewingSubmission && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Your Submission: {selectedAssignment?.title}
              </h3>
              <button
                onClick={() => {
                  setViewingSubmission(null);
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
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Submitted on: {new Date(viewingSubmission.submittedAt).toLocaleString()}
              </p>
              <div className="border border-gray-200 rounded p-4 bg-gray-50">
                <p className="text-gray-700 whitespace-pre-wrap">{viewingSubmission.answer}</p>
              </div>
            </div>
          </div>
        )}

        {assignments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No published assignments available.
          </div>
        ) : (
          <div className="grid gap-4">
            {assignments.map((assignment) => {
              const isPastDue = isPastDueDate(assignment.dueDate);
              const canSubmit = !assignment.isSubmitted && !isPastDue;

              return (
                <div key={assignment._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{assignment.title}</h3>
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium mt-2 bg-gray-100 text-gray-800">
                        Published
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      {isPastDue && (
                        <span className="block text-red-600 font-semibold">Past Due</span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{assignment.description}</p>
                  
                  <div className="flex items-center space-x-4">
                    {assignment.isSubmitted ? (
                      <>
                        <span className="text-green-600 font-semibold">
                          ✓ Submitted on {new Date(assignment.submittedAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleViewSubmission(assignment._id)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                        >
                          View My Submission
                        </button>
                      </>
                    ) : isPastDue ? (
                      <span className="text-red-600 font-semibold">
                        Submission deadline has passed
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSubmittingAssignment(assignment);
                          setSubmissionText('');
                        }}
                        className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium shadow-sm"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
      </div>
    </div>
  );
};

export default StudentDashboard;

