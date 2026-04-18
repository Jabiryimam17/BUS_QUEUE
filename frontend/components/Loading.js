'use client';

import { motion } from 'framer-motion';
import { FaBus } from 'react-icons/fa';

export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="text-blue-600"
      >
        <FaBus className="text-4xl" />
      </motion.div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
