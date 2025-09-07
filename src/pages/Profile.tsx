import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProfileFormData } from '@/types/profile';

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, error, createProfile, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  
  // Simple form state
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: profile?.full_name || '',
    company_name: profile?.company_name || '',
    registration_id: profile?.registration_id || '',
    experience_years: profile?.experience_years || 0,
    industry: profile?.industry || '',
    portfolio_links: profile?.portfolio_links || [''],
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-6">
          <p className="text-red-500">Error: {error}</p>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-6">
          <p>Please log in to view your profile.</p>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (profile) {
        await updateProfile(formData);
      } else {
        await createProfile(formData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  // Show profile view
  if (profile && !isEditing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                <p className="text-gray-600">{profile.company_name}</p>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  {profile.verification_status}
                </span>
              </div>
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p><strong>Registration ID:</strong> {profile.registration_id}</p>
                <p><strong>Experience:</strong> {profile.experience_years} years</p>
                <p><strong>Industry:</strong> {profile.industry}</p>
              </div>
              <div>
                {profile.portfolio_links.length > 0 && (
                  <div>
                    <strong>Portfolio Links:</strong>
                    <ul className="list-disc list-inside">
                      {profile.portfolio_links.map((link, index) => (
                        <li key={index}>
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show form (create or edit)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {profile ? 'Edit Profile' : 'Create Your Profile'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Company Name *</label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Registration ID *</label>
                <Input
                  value={formData.registration_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, registration_id: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Years of Experience *</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.experience_years}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Industry *</label>
                <Input
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., Construction, IT, Healthcare"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Portfolio Link</label>
                <Input
                  value={formData.portfolio_links[0] || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    portfolio_links: [e.target.value] 
                  }))}
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
              
              {profile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;