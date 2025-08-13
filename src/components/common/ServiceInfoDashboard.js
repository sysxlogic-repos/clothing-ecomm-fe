import React, { useState } from 'react';
import { useServiceInfo } from '../../contexts/ServiceInfoContext';
import { 
  Server, 
  Database, 
  Settings, 
  AlertCircle, 
  Clock, 
  BarChart3, 
  Trash2, 
  Eye, 
  EyeOff,
  RefreshCw,
  Info,
  X
} from 'lucide-react';

const ServiceInfoDashboard = ({ isOpen, onClose }) => {
  const {
    serviceHistory,
    autoShowModal,
    toggleAutoShow,
    clearHistory,
    getServiceStats,
    showServiceInfo
  } = useServiceInfo();

  const [selectedService, setSelectedService] = useState(null);
  const stats = getServiceStats();

  const getServiceIcon = (serviceName) => {
    if (serviceName.includes('Database') || serviceName.includes('Inventory')) {
      return <Database className="w-4 h-4 text-blue-500" />;
    } else if (serviceName.includes('Payment') || serviceName.includes('Order')) {
      return <Settings className="w-4 h-4 text-green-500" />;
    } else if (serviceName.includes('Auth') || serviceName.includes('User')) {
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    } else {
      return <Server className="w-4 h-4 text-purple-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getServiceColor = (serviceName) => {
    if (serviceName.includes('Database') || serviceName.includes('Inventory')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (serviceName.includes('Payment') || serviceName.includes('Order')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (serviceName.includes('Auth') || serviceName.includes('User')) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    } else {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Service Connection Dashboard
              </h2>
              <p className="text-sm text-gray-600">
                Monitor and manage backend service connections
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

        <div className="flex-1 overflow-y-auto">
          {/* Stats Overview */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Calls</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalCalls}</p>
                  </div>
                  <Server className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Services</p>
                    <p className="text-2xl font-bold text-green-900">{stats.uniqueServices}</p>
                  </div>
                  <Database className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Auto Show</p>
                    <p className="text-sm font-bold text-orange-900">
                      {autoShowModal ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  {autoShowModal ? (
                    <Eye className="w-8 h-8 text-orange-500" />
                  ) : (
                    <EyeOff className="w-8 h-8 text-orange-500" />
                  )}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Last Call</p>
                    <p className="text-xs font-medium text-purple-900">
                      {stats.lastCall ? formatTimestamp(stats.lastCall).split(' ')[1] : 'None'}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={toggleAutoShow}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  autoShowModal
                    ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {autoShowModal ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {autoShowModal ? 'Auto-show Enabled' : 'Auto-show Disabled'}
                </span>
              </button>
              <button
                onClick={clearHistory}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Clear History</span>
              </button>
            </div>
          </div>

          {/* Service History */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Service Calls</h3>
            {serviceHistory.length === 0 ? (
              <div className="text-center py-8">
                <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No service calls recorded yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Service information will appear here when API calls are made
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {serviceHistory.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getServiceIcon(service.serviceName)}
                      <div>
                        <h4 className="font-medium text-gray-900">{service.serviceName}</h4>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(service.timestamp)}
                          </span>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {service.endpoint}
                          </code>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${
                        getServiceColor(service.serviceName)
                      }`}>
                        {service.connectionSteps.length} steps
                      </span>
                      <button
                        onClick={() => showServiceInfo(service)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="View connection steps"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Service calls are automatically tracked when API requests fail</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors"
            >
              Close Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfoDashboard;