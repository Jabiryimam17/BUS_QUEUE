'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBus, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import BusCard from '@/components/BusCard';
import { studentAPI, authAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statusData, busesData] = await Promise.all([
        authAPI.getStatus(),
        studentAPI.getUpcomingBuses()
      ]);
      setStatus(statusData);
      setBuses(busesData);
    } catch (error) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Status</h2>
              <p className="text-gray-600">Your account approval status</p>
            </div>
            <div className="mt-4 md:mt-0">
              <StatusBadge status={status?.status || 'pending'} />
            </div>
          </div>

          {status?.status === 'rejected' && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm mb-3">
                Your registration was rejected. Please update your profile information and resubmit for review.
              </p>
              <Link 
                href="/profile/update"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Update Profile
              </Link>
            </div>
          )}

          {status?.status === 'pending' && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm mb-3">
                Your registration is pending approval. You'll be notified once it's reviewed.
                You can update your profile if needed.
              </p>
              <Link 
                href="/profile/update"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Update Profile
              </Link>
            </div>
          )}
        </motion.div>

        {/* Upcoming Buses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Buses</h2>
          {status?.status !== 'approved' ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FaBus className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">
                {status?.status === 'rejected' 
                  ? 'Your account must be approved to view and book buses.'
                  : 'Your account is pending approval. Buses will be available once approved.'}
              </p>
              {status?.status === 'rejected' && (
                <Link 
                  href="/profile/update"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-4"
                >
                  Update Profile & Resubmit
                </Link>
              )}
            </div>
          ) : buses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FaBus className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No upcoming buses scheduled</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buses.map((bus, index) => (
                <motion.div
                  key={bus.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BusCard bus={bus} showBookButton={false} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
