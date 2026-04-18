'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBus, FaEye, FaUsers } from 'react-icons/fa';
import Layout from '@/components/Layout';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate, formatTime } from '@/lib/utils';
import Link from 'next/link';

export default function BusesPage() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const data = await adminAPI.getBuses();
      setBuses(data);
    } catch (error) {
      toast.error(error.message || 'Failed to load buses');
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
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">All Buses</h1>
            <p className="text-gray-600">View and manage bus schedules</p>
          </div>
          <Link
            href="/admin/announce-bus"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            + Announce New Bus
          </Link>
        </motion.div>

        {buses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <FaBus className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Buses Scheduled</h3>
            <p className="text-gray-600 mb-6">Start by announcing a new bus schedule.</p>
            <Link
              href="/admin/announce-bus"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Announce Bus
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buses.map((bus, index) => (
              <motion.div
                key={bus.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FaBus className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{bus.route}</h3>
                        <p className="text-sm text-gray-500">Bus #{bus.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-700">Departure:</span>{' '}
                      <span className="text-gray-600">{formatTime(bus.scheduledTime)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-700">Date:</span>{' '}
                      <span className="text-gray-600">{formatDate(bus.scheduledTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaUsers className="text-green-500" />
                      <span className="font-semibold text-gray-700">Tickets:</span>{' '}
                      <span className="text-gray-600">
                        {bus.bookedTickets} / {bus.totalTickets}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/controller/${bus.id}`}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center space-x-2"
                  >
                    <FaEye />
                    <span>View Queue</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
