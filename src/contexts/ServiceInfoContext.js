import React, { createContext, useContext, useState, useEffect } from 'react';
import ServiceInfoModal from '../components/common/ServiceInfoModal';

const ServiceInfoContext = createContext();

export const useServiceInfo = () => {
  const context = useContext(ServiceInfoContext);
  if (!context) {
    throw new Error('useServiceInfo must be used within a ServiceInfoProvider');
  }
  return context;
};

export const ServiceInfoProvider = ({ children }) => {
  const [serviceInfo, setServiceInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [autoShowModal, setAutoShowModal] = useState(true);

  // Listen for service info from API interceptor
  useEffect(() => {
    const handleServiceInfo = (event) => {
      const { detail } = event;
      if (detail && detail.serviceInfo) {
        setServiceInfo(detail.serviceInfo);
        setServiceHistory(prev => [
          detail.serviceInfo,
          ...prev.slice(0, 9) // Keep last 10 service calls
        ]);
        
        if (autoShowModal) {
          setIsModalOpen(true);
        }
      }
    };

    // Create custom event listener for service info
    window.addEventListener('serviceInfo', handleServiceInfo);
    
    // Make service info available globally for API interceptor
    window.showServiceInfo = (serviceInfo) => {
      window.dispatchEvent(new CustomEvent('serviceInfo', {
        detail: { serviceInfo }
      }));
    };

    return () => {
      window.removeEventListener('serviceInfo', handleServiceInfo);
      delete window.showServiceInfo;
    };
  }, [autoShowModal]);

  const showServiceInfo = (info) => {
    setServiceInfo(info);
    setIsModalOpen(true);
  };

  const hideServiceInfo = () => {
    setIsModalOpen(false);
  };

  const toggleAutoShow = () => {
    setAutoShowModal(prev => !prev);
  };

  const clearHistory = () => {
    setServiceHistory([]);
  };

  const getServiceStats = () => {
    const stats = serviceHistory.reduce((acc, service) => {
      const serviceName = service.serviceName;
      acc[serviceName] = (acc[serviceName] || 0) + 1;
      return acc;
    }, {});

    return {
      totalCalls: serviceHistory.length,
      uniqueServices: Object.keys(stats).length,
      serviceBreakdown: stats,
      lastCall: serviceHistory[0]?.timestamp
    };
  };

  const value = {
    serviceInfo,
    isModalOpen,
    serviceHistory,
    autoShowModal,
    showServiceInfo,
    hideServiceInfo,
    toggleAutoShow,
    clearHistory,
    getServiceStats
  };

  return (
    <ServiceInfoContext.Provider value={value}>
      {children}
      <ServiceInfoModal
        isOpen={isModalOpen}
        onClose={hideServiceInfo}
        serviceInfo={serviceInfo}
      />
    </ServiceInfoContext.Provider>
  );
};

export default ServiceInfoContext;