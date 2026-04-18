'use client';

import { motion } from 'framer-motion';
import { FaBus, FaClock, FaTicketAlt, FaCheckCircle } from 'react-icons/fa';
import { formatTime, getTimeUntil, isWindowOpen } from '@/lib/utils';
import Link from 'next/link';

export default function BusCard({ bus, onBook, showBookButton = true }) {
  const windowOpen = isWindowOpen(bus.ticketWindowOpen, bus.ticketWindowClose);
  const isPast = new Date(bus.scheduledTime) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaBus className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{bus.route}</h3>
              <p className="text-sm text-gray-500">Bus #{bus.id}</p>
            </div>
          </div>
          {windowOpen && !isPast && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
              <FaCheckCircle />
              <span>Open</span>
            </span>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <FaClock className="text-blue-500" />
            <span className="text-sm">
              <span className="font-semibold">Departure:</span> {formatTime(bus.scheduledTime)}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <FaTicketAlt className="text-green-500" />
            <span className="text-sm">
              <span className="font-semibold">Tickets:</span> {bus.availableTickets || bus.bookedTickets} / {bus.totalTickets}
            </span>
          </div>

          {!windowOpen && !isPast && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Window opens:</span> {getTimeUntil(bus.ticketWindowOpen)}
              </p>
            </div>
          )}

          {windowOpen && !isPast && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Window closes:</span> {getTimeUntil(bus.ticketWindowClose)}
              </p>
            </div>
          )}
        </div>

        {showBookButton && windowOpen && !isPast && (
          <button
            onClick={() => onBook && onBook(bus.id)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Book Ticket Now
          </button>
        )}

        {showBookButton && !windowOpen && !isPast && (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
          >
            Window Not Open Yet
          </button>
        )}

        {isPast && (
          <div className="w-full bg-gray-200 text-gray-600 py-3 rounded-lg font-semibold text-center">
            Bus Departed
          </div>
        )}
      </div>
    </motion.div>
  );
}
