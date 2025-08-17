import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Mail,
  Send,
  Users,
  FileText,
  Calendar,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Target,
  BarChart3
} from 'lucide-react';
import { emailAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const EmailManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalSent: 0,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0
  });

  const campaignStatuses = [
    { value: 'draft', label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100' },
    { value: 'scheduled', label: 'Scheduled', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { value: 'sending', label: 'Sending', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'sent', label: 'Sent', color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'paused', label: 'Paused', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { value: 'failed', label: 'Failed', color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  const campaignTypes = [
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'transactional', label: 'Transactional' },
    { value: 'welcome', label: 'Welcome Series' },
    { value: 'abandoned_cart', label: 'Abandoned Cart' },
    { value: 'product_update', label: 'Product Update' }
  ];

  useEffect(() => {
    if (activeTab === 'campaigns') {
      fetchCampaigns();
    } else {
      fetchTemplates();
    }
    fetchStats();
  }, [activeTab, currentPage, searchTerm, selectedStatus, selectedType, sortBy, sortOrder]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: selectedStatus,
        type: selectedType,
        sortBy,
        sortOrder
      };
      
      const response = await emailAPI.getCampaigns(params);
      setCampaigns(response.data.campaigns);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to load campaigns.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        type: selectedType,
        sortBy,
        sortOrder
      };
      
      const response = await emailAPI.getTemplates(params);
      setTemplates(response.data.templates);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await emailAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Mock stats
      setStats({
        totalCampaigns: 127,
        activeCampaigns: 8,
        totalSent: 245680,
        openRate: 24.5,
        clickRate: 3.8,
        bounceRate: 2.1
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    const items = activeTab === 'campaigns' ? campaigns : templates;
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item._id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      toast.error('Please select items first');
      return;
    }

    try {
      switch (action) {
        case 'delete':
          if (window.confirm('Are you sure you want to delete selected items?')) {
            if (activeTab === 'campaigns') {
              await emailAPI.bulkDeleteCampaigns(selectedItems);
            } else {
              await emailAPI.bulkDeleteTemplates(selectedItems);
            }
            toast.success(`${selectedItems.length} items deleted`);
          }
          break;
        case 'duplicate':
          if (activeTab === 'campaigns') {
            await emailAPI.bulkDuplicateCampaigns(selectedItems);
          } else {
            await emailAPI.bulkDuplicateTemplates(selectedItems);
          }
          toast.success(`${selectedItems.length} items duplicated`);
          break;
        case 'export':
          if (activeTab === 'campaigns') {
            await emailAPI.exportCampaigns(selectedItems);
          } else {
            await emailAPI.exportTemplates(selectedItems);
          }
          toast.success(`${selectedItems.length} items exported`);
          break;
        default:
          break;
      }
      setSelectedItems([]);
      if (activeTab === 'campaigns') {
        fetchCampaigns();
      } else {
        fetchTemplates();
      }
      fetchStats();
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4" />;
      case 'sending': return <Clock className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'paused': return <AlertCircle className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    const statusOption = campaignStatuses.find(option => option.value === status);
    return statusOption ? { color: statusOption.color, bgColor: statusOption.bgColor } : { color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <>
      <Helmet>
        <title>Email Management | Admin Dashboard</title>
        <meta name="description" content="Manage email campaigns, templates, and analytics." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Email Management</h1>
            <p className="text-gray-600 mt-1">Manage email campaigns and templates</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowTemplateModal(true)}
              className="btn-outline flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>New Template</span>
            </button>
            <button 
              onClick={() => setShowCampaignModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Campaign</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Send className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold text-purple-600">{formatNumber(stats.totalSent)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-orange-600">{stats.openRate}%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.clickRate}%</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-red-600">{stats.bounceRate}%</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => {
                  setActiveTab('campaigns');
                  setCurrentPage(1);
                  setSelectedItems([]);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'campaigns'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Campaigns</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('templates');
                  setCurrentPage(1);
                  setSelectedItems([]);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'templates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Templates</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Filters and Search */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="input-field pl-10"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                
                {selectedItems.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {selectedItems.length} selected
                    </span>
                    <select
                      onChange={(e) => handleBulkAction(e.target.value)}
                      className="text-sm border border-gray-300 rounded-md px-3 py-1"
                      defaultValue=""
                    >
                      <option value="" disabled>Bulk Actions</option>
                      <option value="duplicate">Duplicate</option>
                      <option value="delete">Delete</option>
                      <option value="export">Export</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeTab === 'campaigns' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => {
                          setSelectedStatus(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="input-field"
                      >
                        <option value="">All Status</option>
                        {campaignStatuses.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => {
                        setSelectedType(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="input-field"
                    >
                      <option value="">All Types</option>
                      {campaignTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field);
                        setSortOrder(order);
                        setCurrentPage(1);
                      }}
                      className="input-field"
                    >
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      {activeTab === 'campaigns' && (
                        <>
                          <option value="sentAt-desc">Recently Sent</option>
                          <option value="openRate-desc">Highest Open Rate</option>
                          <option value="clickRate-desc">Highest Click Rate</option>
                        </>
                      )}
                      {activeTab === 'templates' && (
                        <>
                          <option value="usageCount-desc">Most Used</option>
                          <option value="lastUsed-desc">Recently Used</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'campaigns' ? (
                campaigns.length === 0 ? (
                  <div className="p-8 text-center">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
                    <p className="text-gray-600">Create your first email campaign to get started.</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedItems.length === campaigns.length}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('name')}
                        >
                          Campaign
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Recipients
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('scheduledAt')}
                        >
                          Schedule
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {campaigns.map((campaign) => {
                        const statusColors = getStatusColor(campaign.status);
                        return (
                          <tr key={campaign._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(campaign._id)}
                                onChange={() => handleSelectItem(campaign._id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                                <p className="text-sm text-gray-500 truncate max-w-xs">{campaign.subject}</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                                  {campaignTypes.find(t => t.value === campaign.type)?.label}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors.bgColor} ${statusColors.color}`}>
                                {getStatusIcon(campaign.status)}
                                <span className="ml-1">{campaignStatuses.find(s => s.value === campaign.status)?.label}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <p className="text-sm text-gray-900">{formatNumber(campaign.recipients)} total</p>
                                <p className="text-sm text-gray-500">{formatNumber(campaign.sent)} sent</p>
                                <p className="text-xs text-gray-500">{campaign.segmentName}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-900">{campaign.openRate}%</span>
                                  <span className="text-xs text-gray-500">open</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-900">{campaign.clickRate}%</span>
                                  <span className="text-xs text-gray-500">click</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-900">{campaign.bounceRate}%</span>
                                  <span className="text-xs text-gray-500">bounce</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <p className="text-sm text-gray-900">{formatDate(campaign.scheduledAt)}</p>
                                {campaign.sentAt && (
                                  <p className="text-xs text-gray-500">Sent: {formatDate(campaign.sentAt)}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => {
                                    setSelectedCampaign(campaign);
                                    setShowCampaignModal(true);
                                  }}
                                  className="p-2 text-gray-400 hover:text-blue-600"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-green-600">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )
              ) : (
                templates.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                    <p className="text-gray-600">Create your first email template to get started.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {templates.map((template) => (
                      <div key={template._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative">
                          <img
                            src={template.thumbnail}
                            alt={template.name}
                            className="w-full h-32 object-cover bg-gray-100"
                          />
                          <div className="absolute top-2 left-2">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(template._id)}
                              onChange={() => handleSelectItem(template._id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
                              {campaignTypes.find(t => t.value === template.type)?.label}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <span>Used {template.usageCount} times</span>
                            <span>Last: {formatDate(template.lastUsed)}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {template.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-green-600">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <button className="btn-primary text-sm py-1 px-3">
                              Use Template
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmailManagement;