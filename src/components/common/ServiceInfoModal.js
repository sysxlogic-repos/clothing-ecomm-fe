import React, { useState, useEffect } from 'react';
import { X, Server, Database, Wifi, Settings, CheckCircle, AlertCircle } from 'lucide-react';

const ServiceInfoModal = ({ isOpen, onClose, serviceInfo }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (isOpen && serviceInfo) {
      // Simulate connection steps
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < serviceInfo.connectionSteps.length - 1) {
            setCompletedSteps(current => [...current, prev]);
            return prev + 1;
          } else {
            setCompletedSteps(current => [...current, prev]);
            clearInterval(timer);
            return prev;
          }
        });
      }, 1500);

      return () => clearInterval(timer);
    }
  }, [isOpen, serviceInfo]);

  const resetSteps = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  if (!isOpen || !serviceInfo) return null;

  const getStepIcon = (index) => {
    if (completedSteps.includes(index)) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (index === currentStep) {
      return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    } else {
      return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getServiceIcon = (serviceName) => {
    if (serviceName.includes('Database') || serviceName.includes('Inventory')) {
      return <Database className="w-6 h-6 text-blue-500" />;
    } else if (serviceName.includes('Payment') || serviceName.includes('Order')) {
      return <Settings className="w-6 h-6 text-green-500" />;
    } else if (serviceName.includes('Auth') || serviceName.includes('User')) {
      return <AlertCircle className="w-6 h-6 text-orange-500" />;
    } else {
      return <Server className="w-6 h-6 text-purple-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getServiceIcon(serviceInfo.serviceName)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {serviceInfo.serviceName}
              </h2>
              <p className="text-sm text-gray-600">
                {serviceInfo.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Service Details */}
        <div className="p-6">
          {/* Endpoint Information */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Wifi className="w-4 h-4 mr-2 text-blue-500" />
              Service Endpoint
            </h3>
            <code className="text-sm text-gray-700 bg-white px-2 py-1 rounded border">
              {serviceInfo.endpoint}
            </code>
            <p className="text-xs text-gray-500 mt-1">
              Last attempted: {new Date(serviceInfo.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Connection Steps */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Connection Setup Steps
            </h3>
            <div className="space-y-3">
              {serviceInfo.connectionSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                    completedSteps.includes(index)
                      ? 'bg-green-50 border border-green-200'
                      : index === currentStep
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStepIcon(index)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${
                      completedSteps.includes(index)
                        ? 'text-green-800'
                        : index === currentStep
                        ? 'text-blue-800'
                        : 'text-gray-700'
                    }`}>
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Details */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">
              Development Mode Notice
            </h4>
            <p className="text-sm text-yellow-700">
              This application is running in development mode. The backend services are not currently running, 
              so mock data is being displayed. Follow the connection steps above to set up the required services.
            </p>
          </div>

          {/* Original Error (for debugging) */}
          {serviceInfo.originalError && (
            <details className="mb-4">
              <summary className="text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-800">
                Technical Details (for developers)
              </summary>
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                <code className="text-xs text-red-700">
                  {serviceInfo.originalError}
                </code>
              </div>
            </details>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">
              {completedSteps.length === serviceInfo.connectionSteps.length
                ? 'All steps completed'
                : `Step ${currentStep + 1} of ${serviceInfo.connectionSteps.length}`
              }
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={resetSteps}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Restart Demo
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors"
            >
              Continue with Mock Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfoModal;