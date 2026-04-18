'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBus, FaUserGraduate, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [userType, setUserType] = useState(null);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setTimeout(() => {
      router.push('/login');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-full">
              <FaBus className="text-white text-6xl" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            BusQueue
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-2">
            Fair Bus Ticket System
          </p>
          <p className="text-lg text-blue-200">
            No more pushing, no more unfairness. Get your ticket online.
          </p>
        </motion.div>

        {!userType ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-white text-center mb-8">
              I am a...
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUserTypeSelect('student')}
                className="bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-blue-500 p-4 rounded-full group-hover:bg-blue-600 transition-colors">
                    <FaUserGraduate className="text-white text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Student</h3>
                  <p className="text-blue-100 text-center">
                    Register and book your bus tickets online
                  </p>
                  <div className="flex items-center space-x-2 text-white group-hover:translate-x-2 transition-transform">
                    <span className="font-semibold">Get Started</span>
                    <FaArrowRight />
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUserTypeSelect('admin')}
                className="bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-green-500 p-4 rounded-full group-hover:bg-green-600 transition-colors">
                    <FaShieldAlt className="text-white text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Administrator</h3>
                  <p className="text-blue-100 text-center">
                    Manage registrations and bus schedules
                  </p>
                  <div className="flex items-center space-x-2 text-white group-hover:translate-x-2 transition-transform">
                    <span className="font-semibold">Access Dashboard</span>
                    <FaArrowRight />
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Redirecting...</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-2">Fair Queue</h3>
              <p className="text-blue-100 text-sm">First come, first served system</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-2">Easy Booking</h3>
              <p className="text-blue-100 text-sm">Book your ticket in minutes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-2">Secure</h3>
              <p className="text-blue-100 text-sm">Verified with university ID</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
