import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Diagram } from '../../types';
import { diagramApi } from '../../services/api';
import DiagramCard from './DiagramCard';
import { Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<'all' | 'javascript' | 'python'>('all');
  const [filterShared, setFilterShared] = useState<'all' | 'public' | 'private'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadDiagrams();
  }, []);

  const loadDiagrams = async () => {
    try {
      const response = await diagramApi.getAll();
      if (response.success) {
        setDiagrams(response.diagrams);
      } else {
        toast.error('Failed to load diagrams');
      }
    } catch (error) {
      toast.error('Failed to load diagrams');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this diagram?')) {
      try {
        await diagramApi.delete(id);
        setDiagrams(diagrams.filter(d => d._id !== id));
        toast.success('Diagram deleted successfully');
      } catch (error) {
        toast.error('Failed to delete diagram');
      }
    }
  };

  const handleToggleShare = async (id: string, shared: boolean) => {
    try {
      const response = await diagramApi.toggleShare(id, shared);
      if (response.success) {
        setDiagrams(diagrams.map(d => 
          d._id === id ? { ...d, shared } : d
        ));
        toast.success(`Diagram ${shared ? 'shared' : 'made private'} successfully`);
      }
    } catch (error) {
      toast.error('Failed to update sharing status');
    }
  };

  const handleView = (id: string) => {
    navigate(`/diagram/${id}`);
  };

  const filteredDiagrams = diagrams.filter(diagram => {
    const matchesSearch = diagram.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || diagram.language === filterLanguage;
    const matchesShared = filterShared === 'all' || 
      (filterShared === 'public' && diagram.shared) ||
      (filterShared === 'private' && !diagram.shared);

    return matchesSearch && matchesLanguage && matchesShared;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage your code diagrams and conversions</p>
          </div>
          <button
            onClick={() => navigate('/convert')}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            <span>New Diagram</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search diagrams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value as 'all' | 'javascript' | 'python')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Languages</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <select
              value={filterShared}
              onChange={(e) => setFilterShared(e.target.value as 'all' | 'public' | 'private')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      {filteredDiagrams.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-500">
            <div className="text-lg font-medium mb-2">
              {diagrams.length === 0 ? 'No diagrams yet' : 'No diagrams match your filters'}
            </div>
            <div className="text-sm">
              {diagrams.length === 0 
                ? 'Create your first diagram by converting some code'
                : 'Try adjusting your search or filter criteria'
              }
            </div>
          </div>
          {diagrams.length === 0 && (
            <button
              onClick={() => navigate('/convert')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiagrams.map(diagram => (
            <DiagramCard
              key={diagram._id}
              diagram={diagram}
              onDelete={handleDelete}
              onToggleShare={handleToggleShare}
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;