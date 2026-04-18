'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaSpinner } from 'react-icons/fa';
import Layout from '@/components/Layout';
import BusCard from '@/components/BusCard';
import { studentAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function BookTicketPage() {
  const router = useRouter();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingBusId, setBookingBusId] = useState(null);

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const data = await studentAPI.getUpcomingBuses();
      setBuses(data);
    } catch (error) {
      toast.error('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTicket = async (busId) => {
    setBookingBusId(busId);
    try {
      const result = await studentAPI.bookTicket(busId);
      toast.success(`Ticket booked! Your ticket number is #${result.ticketNumber}`);
      setTimeout(() => {
        router.push('/my-ticket');
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Failed to book ticket. Please try again.');
    } finally {
      setBookingBusId(null);
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

  const availableBuses = buses.filter(bus => {
    const now = new Date();
    const windowOpen = new Date(bus.ticketWindowOpen);
    const windowClose = new Date(bus.ticketWindowClose);
    return now >= windowOpen && now <= windowClose;
  });

  return (
    <Layout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FaTicketAlt className="text-green-600 text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Book Your Ticket</h1>
          <p className="text-gray-600">Select a bus and book your ticket (First come, first served)</p>
        </motion.div>

        {availableBuses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tickets Available</h3>
            <p className="text-gray-600">
              There are no buses with open ticket windows at the moment. Check back later!
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBuses.map((bus, index) => (
              <motion.div
                key={bus.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BusCard
                  bus={bus}
                  onBook={handleBookTicket}
                  showBookButton={true}
                />
                {bookingBusId === bus.id && (
                  <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
                    <FaSpinner className="animate-spin" />
                    <span>Booking your ticket...</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {buses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6"
          >
            <h3 className="font-semibold text-blue-900 mb-2">Upcoming Windows</h3>
            <div className="space-y-2">
              {buses
                .filter(bus => new Date(bus.ticketWindowOpen) > new Date())
                .map(bus => (
                  <div key={bus.id} className="text-sm text-blue-800">
                    <span className="font-semibold">{bus.route}:</span> Window opens in{' '}
                    {new Date(bus.ticketWindowOpen).toLocaleString()}
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
