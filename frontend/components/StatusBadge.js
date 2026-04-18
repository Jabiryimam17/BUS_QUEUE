'use client';

import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

export default function StatusBadge({ status }) {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      icon: FaClock,
      label: 'Pending Approval'
    },
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      icon: FaCheckCircle,
      label: 'Approved'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: FaTimesCircle,
      label: 'Rejected'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="text-sm" />
      <span className="text-sm font-semibold">{config.label}</span>
    </span>
  );
}
