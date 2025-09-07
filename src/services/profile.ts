import { supabase } from '@/lib/supabaseClient';
import { BidderProfile, ProfileFormData } from '@/types/profile';

export class ProfileService {
  static async createProfile(userId: string, data: ProfileFormData): Promise<BidderProfile> {
    const { data: profile, error } = await supabase
      .from('bidder_profiles')
      .insert({
        user_id: userId,
        ...data,
        verification_status: 'pending',
        badge_level: null,
      })
      .select()
      .single();

    if (error) throw error;
    return profile;
  }

  static async getProfile(userId: string): Promise<BidderProfile | null> {
    const { data, error } = await supabase
      .from('bidder_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateProfile(userId: string, data: Partial<ProfileFormData>): Promise<BidderProfile> {
    const { data: profile, error } = await supabase
      .from('bidder_profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return profile;
  }

  static async uploadDocument(file: File, userId: string, type: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${type}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  static async updateVerificationStatus(userId: string, status: 'pending' | 'verified' | 'rejected', badgeLevel?: string): Promise<void> {
    const { error } = await supabase
      .from('bidder_profiles')
      .update({
        verification_status: status,
        badge_level: badgeLevel || null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
  }
}