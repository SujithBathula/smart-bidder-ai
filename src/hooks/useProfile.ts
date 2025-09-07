import { useState, useEffect } from 'react';
import { BidderProfile, ProfileFormData } from '@/types/profile';
import { ProfileService } from '@/services/profile';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<BidderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const profileData = await ProfileService.getProfile(user.id);
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (data: ProfileFormData) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setError(null);
      const newProfile = await ProfileService.createProfile(user.id, data);
      setProfile(newProfile);
      return newProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      throw err;
    }
  };

  const updateProfile = async (data: Partial<ProfileFormData>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setError(null);
      const updatedProfile = await ProfileService.updateProfile(user.id, data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    refetch: loadProfile,
  };
};