import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">Assignment Portal</span>
            </div>
            <div>
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Assignment Workflow Portal
          </h1>
          <p className="text-gray-600">
            Manage assignments and track submissions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">For Teachers</h3>
            <p className="text-sm text-gray-600 mb-3">
              Create assignments and review student submissions.
            </p>
            <button
              onClick={handleLoginClick}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm"
            >
              Teacher Login
            </button>
          </div>

          <div className="bg-white rounded border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">For Students</h3>
            <p className="text-sm text-gray-600 mb-3">
              View assignments and submit your work.
            </p>
            <button
              onClick={handleLoginClick}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm"
            >
              Student Login
            </button>
          </div>
        </div>

        <div className="bg-white rounded border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Features</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Create and manage assignments</p>
            <p>• Track student submissions</p>
            <p>• View submission history</p>
            <p>• Dashboard analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
