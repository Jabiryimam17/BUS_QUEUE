'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaUser, FaIdCard, FaClock, FaCamera } from 'react-icons/fa';
import Layout from '@/components/Layout';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function ApprovalsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const data = await adminAPI.getPendingRegistrations();
      setRegistrations(data);
    } catch (error) {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      const result = await adminAPI.approveRegistration(id);
      toast.success(result.message || 'Registration approved');
      setRegistrations(registrations.filter(reg => reg.id !== id));
    } catch (error) {
      toast.error(error.message || 'Failed to approve registration');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      const result = await adminAPI.rejectRegistration(id);
      toast.success(result.message || 'Registration rejected');
      setRegistrations(registrations.filter(reg => reg.id !== id));
    } catch (error) {
      toast.error(error.message || 'Failed to reject registration');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Layout userType="admin">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pending Registrations</h1>
          <p className="text-gray-600">Review and approve student registrations</p>
        </motion.div>

        {registrations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Registrations</h3>
            <p className="text-gray-600">All registrations have been reviewed.</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {registrations.map((registration, index) => (
                <motion.div
                  key={registration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{registration.name}</h3>
                      <div className="flex items-center justify-center space-x-2 text-gray-600 text-sm mb-4">
                        <FaIdCard className="text-blue-500" />
                        <span>{registration.universityId}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1 flex items-center space-x-1">
                          <FaUser className="text-blue-500" />
                          <span>Face Photo</span>
                        </div>
                        <img
                          src={registration.facePhoto || registration.photo || '/api/placeholder/200/200'}
                          alt="Face"
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1 flex items-center space-x-1">
                          <FaIdCard className="text-green-500" />
                          <span>ID Photo</span>
                        </div>
                        <img
                          src={registration.idPhoto || '/api/placeholder/200/200'}
                          alt="ID"
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaClock className="text-gray-400" />
                        <span>Submitted {formatDate(registration.submittedAt)}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(registration.id)}
                        disabled={processingId === registration.id}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {processingId === registration.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <FaCheck />
                            <span>Approve</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(registration.id)}
                        disabled={processingId === registration.id}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <FaTimes />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}
