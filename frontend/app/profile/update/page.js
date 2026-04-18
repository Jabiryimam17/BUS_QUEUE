'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaIdCard, FaUser, FaCamera, FaEnvelope, FaGraduationCap } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';
import { userAPI } from '@/lib/api';
import { build_upload_url } from '@/lib/api_client';

export default function UpdateProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    universityId: '',
    name: '',
    email: '',
    department: '',
    facePhoto: null,
    idPhoto: null
  });
  const [facePhotoPreview, setFacePhotoPreview] = useState(null);
  const [idPhotoPreview, setIdPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await userAPI.getMyProfile();
      setFormData({
        universityId: profile.university_id || '',
        name: profile.name || '',
        email: profile.email || '',
        department: profile.department || '',
        facePhoto: null,
        idPhoto: null
      });
      
      // Set previews for existing photos
      if (profile.face_photo_path) {
        setFacePhotoPreview(build_upload_url(profile.face_photo_path));
      }
      if (profile.id_photo_path) {
        setIdPhotoPreview(build_upload_url(profile.id_photo_path));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load profile');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

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
    
    if (!formData.universityId || !formData.name || !formData.email || !formData.department) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!formData.facePhoto && !facePhotoPreview) {
      toast.error('Please upload a face photo');
      return;
    }

    if (!formData.idPhoto && !idPhotoPreview) {
      toast.error('Please upload an ID photo');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const form_data = new FormData();
      form_data.append('university_id', formData.universityId);
      form_data.append('name', formData.name);
      form_data.append('email', formData.email);
      form_data.append('department', formData.department);
      
      if (formData.facePhoto) {
        form_data.append('face_photo', formData.facePhoto);
      }
      if (formData.idPhoto) {
        form_data.append('id_photo', formData.idPhoto);
      }

      const result = await userAPI.updateMyProfile(form_data);
      toast.success(result.message || 'Profile updated successfully. Status reset to pending for review.');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Update Profile</h1>
            <p className="text-gray-600">Update your information and resubmit for approval</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaGraduationCap className="inline mr-2 text-blue-500" />
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
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50"
                placeholder="your.email@university.edu"
                required
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                <option value="">Select department</option>
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                {facePhotoPreview ? (
                  <div className="space-y-4">
                    <img
                      src={facePhotoPreview}
                      alt="Face preview"
                      className="mx-auto h-48 w-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFacePhotoPreview(null);
                        setFormData({ ...formData, facePhoto: null });
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFacePhotoChange}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <FaUpload className="text-4xl text-gray-400 mx-auto" />
                      <p className="text-gray-600">Click to upload face photo</p>
                      <p className="text-xs text-gray-500">Max 5MB</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaIdCard className="inline mr-2 text-blue-500" />
                ID Photo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                {idPhotoPreview ? (
                  <div className="space-y-4">
                    <img
                      src={idPhotoPreview}
                      alt="ID preview"
                      className="mx-auto h-48 w-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIdPhotoPreview(null);
                        setFormData({ ...formData, idPhoto: null });
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIdPhotoChange}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <FaUpload className="text-4xl text-gray-400 mx-auto" />
                      <p className="text-gray-600">Click to upload ID photo</p>
                      <p className="text-xs text-gray-500">Max 5MB</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> After updating your profile, your status will be reset to pending and you'll need to wait for administrator approval again.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Updating...' : 'Update Profile & Resubmit'}
            </button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
