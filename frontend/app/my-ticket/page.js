'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaBus, FaCalendar, FaCheckCircle } from 'react-icons/fa';
import Layout from '@/components/Layout';
import { studentAPI } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function MyTicketPage() {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTicket();
  }, []);

  const loadTicket = async () => {
    try {
      const data = await studentAPI.getMyTicket();
      setTicket(data);
    } catch (error) {
      // No ticket found or error
      setTicket(null);
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

  if (!ticket) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-12 text-center"
        >
          <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Ticket</h2>
          <p className="text-gray-600 mb-6">You don't have an active ticket at the moment.</p>
          <a
            href="/book-ticket"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Book a Ticket
          </a>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-white">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Your Ticket</h1>
                <p className="text-blue-100">Keep this ticket for boarding</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg p-4 rounded-full">
                <FaTicketAlt className="text-4xl" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2">#{ticket.ticketNumber}</div>
                <div className="text-blue-100">Ticket Number</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <FaBus className="text-2xl text-blue-200" />
                <div>
                  <div className="text-sm text-blue-100">Route</div>
                  <div className="text-lg font-semibold">{ticket.busRoute}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <FaCalendar className="text-2xl text-blue-200" />
                <div>
                  <div className="text-sm text-blue-100">Departure Time</div>
                  <div className="text-lg font-semibold">{formatTime(ticket.scheduledTime)}</div>
                  <div className="text-xs text-blue-200">{formatDate(ticket.scheduledTime)}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <FaCheckCircle className="text-2xl text-blue-200" />
                <div>
                  <div className="text-sm text-blue-100">Position in Queue</div>
                  <div className="text-lg font-semibold">#{ticket.position}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please arrive on time. Your position in the queue is #{ticket.position}. 
                If you arrive late, you may lose your spot.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
