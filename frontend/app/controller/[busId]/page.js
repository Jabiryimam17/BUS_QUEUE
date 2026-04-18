'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBus, FaUser, FaIdCard, FaTicketAlt, FaExclamationTriangle, FaRedo, FaBan } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate, formatTime } from '@/lib/utils';

export default function ControllerPage() {
  const params = useParams();
  const busId = params.busId;
  const [queue, setQueue] = useState([]);
  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [penalizingTicket, setPenalizingTicket] = useState(null);
  const [currentQueuePosition, setCurrentQueuePosition] = useState('');
  const [rearranging, setRearranging] = useState(false);

  useEffect(() => {
    loadQueue();
  }, [busId]);

  const loadQueue = async () => {
    try {
      const [queueData, busesData] = await Promise.all([
        adminAPI.getBusQueue(busId),
        adminAPI.getBuses()
      ]);
      setQueue(queueData);
      const bus = busesData.find(b => b.id.toString() === busId.toString());
      setBusInfo(bus);
    } catch (error) {
      toast.error(error.message || 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  const handlePenalize = async (ticketId) => {
    if (!currentQueuePosition || currentQueuePosition < 1) {
      toast.error('Please enter a valid current queue position');
      return;
    }

    try {
      const result = await adminAPI.penalizeTicket(ticketId, parseInt(currentQueuePosition));
      toast.success(result.message || `Penalty of ${result.calculated_penalty} applied. Total: ${result.new_total_penalty}`);
      setPenalizingTicket(null);
      setCurrentQueuePosition('');
      await loadQueue();
    } catch (error) {
      toast.error(error.message || 'Failed to apply penalty');
    }
  };

  const handleMarkLate = async (ticketId) => {
    if (!confirm('Mark this student as late arrival? They will be moved to the end of the queue.')) {
      return;
    }

    try {
      const result = await adminAPI.markLateArrival(ticketId);
      toast.success(result.message || 'Student marked as late arrival');
      await loadQueue();
    } catch (error) {
      toast.error(error.message || 'Failed to mark as late arrival');
    }
  };

  const handleRearrange = async () => {
    setRearranging(true);
    try {
      const result = await adminAPI.rearrangeQueue(busId);
      toast.success(result.message || 'Queue rearranged successfully');
      await loadQueue();
    } catch (error) {
      toast.error(error.message || 'Failed to rearrange queue');
    } finally {
      setRearranging(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <FaBus className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{busInfo?.route || 'Bus Queue'}</h1>
                  {busInfo && (
                    <p className="text-gray-600">
                      Departure: {formatTime(busInfo.scheduledTime)} - {formatDate(busInfo.scheduledTime)}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total in Queue</div>
                <div className="text-3xl font-bold text-blue-600">{queue.length}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm mb-2">
            <strong>Instructions:</strong> Board students in order. If someone arrives out of order, 
            use the Penalize button to apply a penalty. Use "Put at End" for liars.
          </p>
          <button
            onClick={handleRearrange}
            disabled={rearranging || queue.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FaRedo className={rearranging ? 'animate-spin' : ''} />
            <span>{rearranging ? 'Rearranging...' : 'Rearrange Queue'}</span>
          </button>
        </div>

        {queue.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Students in Queue</h3>
            <p className="text-gray-600">No tickets have been booked for this bus yet.</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queue.map((student, index) => (
              <motion.div
                key={student.ticketId || student.ticketNumber}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl shadow-lg hover:shadow-xl transition-all border-2 overflow-hidden ${
                  student.isLateArrival 
                    ? 'bg-red-50 border-red-400' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
                      student.isLateArrival 
                        ? 'bg-red-600 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      #{student.displayPosition || student.ticketNumber}
                    </div>
                    <div className="flex items-center space-x-2">
                      {student.isLateArrival && (
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <FaExclamationTriangle />
                          <span>Late Arrival</span>
                        </div>
                      )}
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.isLateArrival 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        Position {index + 1}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={student.photo || '/api/placeholder/200/200'}
                        alt={student.name}
                        className="w-24 h-24 object-cover rounded-full border-4 border-blue-100"
                      />
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{student.name}</h3>
                    <div className="flex items-center justify-center space-x-2 text-gray-600 text-sm">
                      <FaIdCard className="text-blue-500" />
                      <span>{student.universityId}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 text-center mb-4">
                    <div className="text-xs text-gray-500 mb-1">Original Ticket</div>
                    <div className="flex items-center justify-center space-x-2">
                      <FaTicketAlt className="text-blue-500" />
                      <span className="font-semibold text-gray-800">#{student.ticketNumber}</span>
                    </div>
                    {student.penalty > 0 && (
                      <div className="text-xs text-orange-600 mt-1">
                        Penalty: +{student.penalty}
                      </div>
                    )}
                  </div>

                  {student.isLateArrival ? (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-center">
                      <p className="text-red-800 text-sm font-semibold flex items-center justify-center space-x-2">
                        <FaBan />
                        <span>Must board at end</span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => setPenalizingTicket(student.ticketId)}
                        className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm"
                      >
                        Penalize
                      </button>
                      <button
                        onClick={() => handleMarkLate(student.ticketId)}
                        className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
                      >
                        Put at End
                      </button>
                    </div>
                  )}

                  {penalizingTicket === student.ticketId && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Queue Position:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={currentQueuePosition}
                        onChange={(e) => setCurrentQueuePosition(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                        placeholder="Enter position (e.g., 23)"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePenalize(student.ticketId)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                        >
                          Apply Penalty
                        </button>
                        <button
                          onClick={() => {
                            setPenalizingTicket(null);
                            setCurrentQueuePosition('');
                          }}
                          className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
