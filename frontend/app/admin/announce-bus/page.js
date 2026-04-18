'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBus, FaCalendar, FaClock } from 'react-icons/fa';
import Layout from '@/components/Layout';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AnnounceBusPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    route: '',
    scheduledTime: '',
    ticketWindowOpen: '',
    ticketWindowClose: '',
    totalTickets: 50
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert dates to ISO format
      const bus_data = {
        route: formData.route,
        scheduledTime: new Date(formData.scheduledTime).toISOString(),
        ticketWindowOpen: new Date(formData.ticketWindowOpen).toISOString(),
        ticketWindowClose: new Date(formData.ticketWindowClose).toISOString(),
        totalTickets: parseInt(formData.totalTickets)
      };

      const result = await adminAPI.announceBus(bus_data);
      toast.success(result.message || 'Bus announced successfully!');
      setTimeout(() => {
        router.push('/admin/buses');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Failed to announce bus. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calculate default window times based on scheduled time
  const handleScheduledTimeChange = (e) => {
    const scheduledTime = new Date(e.target.value);
    const windowOpen = new Date(scheduledTime);
    windowOpen.setHours(windowOpen.getHours() - 4);
    const windowClose = new Date(scheduledTime);
    windowClose.setHours(windowClose.getHours() + 1);

    setFormData({
      ...formData,
      scheduledTime: e.target.value,
      ticketWindowOpen: windowOpen.toISOString().slice(0, 16),
      ticketWindowClose: windowClose.toISOString().slice(0, 16)
    });
  };

  return (
    <Layout userType="admin">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-10"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FaBus className="text-blue-600 text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Announce New Bus</h1>
            <p className="text-gray-600">Create a new bus schedule and ticket window</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaBus className="inline mr-2 text-blue-500" />
                Route
              </label>
              <input
                type="text"
                name="route"
                value={formData.route}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="e.g., Campus to City Center"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaCalendar className="inline mr-2 text-blue-500" />
                Scheduled Departure Time
              </label>
              <input
                type="datetime-local"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleScheduledTimeChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaClock className="inline mr-2 text-blue-500" />
                Ticket Window Open Time
              </label>
              <input
                type="datetime-local"
                name="ticketWindowOpen"
                value={formData.ticketWindowOpen}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Usually 4-6 hours before departure</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaClock className="inline mr-2 text-blue-500" />
                Ticket Window Close Time
              </label>
              <input
                type="datetime-local"
                name="ticketWindowClose"
                value={formData.ticketWindowClose}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Usually when bus departs or closes</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total Available Tickets
              </label>
              <input
                type="number"
                name="totalTickets"
                value={formData.totalTickets}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The ticket window will be announced to students. 
                Make sure the times are correct before submitting.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Announcing...' : 'Announce Bus'}
            </button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
