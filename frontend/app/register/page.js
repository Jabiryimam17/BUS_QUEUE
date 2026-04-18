'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaIdCard, FaUser, FaCamera, FaEnvelope, FaLock, FaGraduationCap } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';
import { authAPI } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    universityId: '',
    name: '',
    email: '',
    password: '',
    department: '',
    facePhoto: null,
    idPhoto: null
  });
  const [facePhotoPreview, setFacePhotoPreview] = useState(null);
  const [idPhotoPreview, setIdPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Medicine',
    'Nursing',
    'Pharmacy',
    'Dentistry',
    'Public Health',
    'Medical Laboratory',
    'Physiotherapy',
    'Other Health'
  ];

  const handleFacePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, facePhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setFacePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, idPhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.universityId || !formData.name || !formData.email || !formData.password || !formData.department || !formData.facePhoto || !formData.idPhoto) {
      toast.error('Please fill all fields');
      return;
    }

    // Validate password
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const form_data = new FormData();
      form_data.append('university_id', formData.universityId);
      form_data.append('name', formData.name);
      form_data.append('email', formData.email);
      form_data.append('password', formData.password);
      form_data.append('department', formData.department);
      form_data.append('face_photo', formData.facePhoto);
      form_data.append('id_photo', formData.idPhoto);

      const result = await authAPI.register(form_data);
      toast.success(result.message || 'Registration submitted successfully. Waiting for approval.');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-10"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FaUser className="text-blue-600 text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Registration</h1>
            <p className="text-gray-600">Register with your university credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaIdCard className="inline mr-2 text-blue-500" />
                University ID
              </label>
              <input
                type="text"
                value={formData.universityId}
                onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Enter your university ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaUser className="inline mr-2 text-blue-500" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-blue-500" />
                University Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="your.email@university.edu"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaLock className="inline mr-2 text-blue-500" />
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Enter your password (min 6 characters)"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaGraduationCap className="inline mr-2 text-blue-500" />
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              >
                <option value="">Select your department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaCamera className="inline mr-2 text-blue-500" />
                Face Photo
              </label>
              <div className="space-y-4">
                {facePhotoPreview ? (
                  <div className="relative">
                    <img
                      src={facePhotoPreview}
                      alt="Face Preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFacePhotoPreview(null);
                        setFormData({ ...formData, facePhoto: null });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaUpload className="text-4xl text-gray-400 mb-4" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> your face photo
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFacePhotoChange}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaIdCard className="inline mr-2 text-blue-500" />
                University ID Photo
              </label>
              <div className="space-y-4">
                {idPhotoPreview ? (
                  <div className="relative">
                    <img
                      src={idPhotoPreview}
                      alt="ID Preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIdPhotoPreview(null);
                        setFormData({ ...formData, idPhoto: null });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaUpload className="text-4xl text-gray-400 mb-4" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> your ID photo
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIdPhotoChange}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your registration will be reviewed by administrators. 
                You'll be notified once your account is approved. After approval, you can log in with your email and password.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
