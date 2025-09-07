import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) console.error(error);
      else setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  if (!user) return <p>Please log in to view your profile.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Full Name: {profile?.full_name}</p>
      <p>Company: {profile?.company_name}</p>
      {/* Add fields and update form as needed */}
    </div>
  );
}
