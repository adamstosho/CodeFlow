import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Code, ArrowRight, Zap, Share2, Download, Eye } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-20 pb-16 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-center mb-8">
              <Code className="h-16 w-16 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Transform Code into
              <span className="block text-indigo-600">Visual Diagrams</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Convert your JavaScript and Python code into beautiful flowcharts using Mermaid.js.
              Visualize your logic, share with your team, and make debugging easier.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              {user ? (
                <Link
                  to="/convert"
                  className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <span>Start Converting</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose CodeFlow?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade code visualization with powerful features for developers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Instant Conversion
              </h3>
              <p className="text-gray-600">
                Convert your code to flowcharts in seconds with our advanced parsing engine
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-lg mb-4">
                <Share2 className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Sharing
              </h3>
              <p className="text-gray-600">
                Share your diagrams with public links or keep them private for your team
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-4">
                <Download className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Export Options
              </h3>
              <p className="text-gray-600">
                Download your diagrams as SVG files for presentations and documentation
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Visual Clarity
              </h3>
              <p className="text-gray-600">
                Clean, professional diagrams that make complex code easy to understand
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                <Code className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Multi-Language
              </h3>
              <p className="text-gray-600">
                Support for JavaScript with Python support coming soon
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg mb-4">
                <ArrowRight className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                History Tracking
              </h3>
              <p className="text-gray-600">
                Keep track of all your conversions with our comprehensive dashboard
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="py-16 text-center">
            <div className="bg-indigo-600 rounded-2xl p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to visualize your code?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Join thousands of developers who trust CodeFlow for their code visualization needs
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
              >
                <span>Start Free Today</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;