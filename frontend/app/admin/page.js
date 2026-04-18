'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBus, FaCheckCircle, FaClock } from 'react-icons/fa';
import Layout from '@/components/Layout';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingRegistrations: 0,
    activeBuses: 0,
    totalTickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [registrations, buses] = await Promise.all([
        adminAPI.getPendingRegistrations(),
        adminAPI.getBuses()
      ]);
      setStats({
        pendingRegistrations: registrations.length,
        activeBuses: buses.length,
        totalTickets: buses.reduce((sum, bus) => sum + bus.bookedTickets, 0)
      });
    } catch (error) {
      console.error('Failed to load stats');
    } finally {
      setLoading(false);
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
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage registrations and bus schedules</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
              <Link href="/admin/approvals" className="text-blue-600 hover:text-blue-700 font-semibold">
                View →
              </Link>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.pendingRegistrations}</div>
            <div className="text-gray-600">Pending Registrations</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaBus className="text-blue-600 text-2xl" />
              </div>
              <Link href="/admin/buses" className="text-blue-600 hover:text-blue-700 font-semibold">
                View →
              </Link>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.activeBuses}</div>
            <div className="text-gray-600">Active Buses</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalTickets}</div>
            <div className="text-gray-600">Total Booked Tickets</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/admin/approvals"
              className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <FaUsers className="text-blue-600 text-2xl" />
              <div>
                <div className="font-semibold text-gray-800">Review Registrations</div>
                <div className="text-sm text-gray-600">Approve or reject student registrations</div>
              </div>
            </Link>

            <Link
              href="/admin/announce-bus"
              className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <FaBus className="text-blue-600 text-2xl" />
              <div>
                <div className="font-semibold text-gray-800">Announce New Bus</div>
                <div className="text-sm text-gray-600">Create a new bus schedule</div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
