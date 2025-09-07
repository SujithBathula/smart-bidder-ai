import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProfileFormData } from '@/types/profile';
import { Plus, X } from 'lucide-react';

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  loading?: boolean;
}

// Add this type for form errors
type ProfileFormErrors = {
  [K in keyof ProfileFormData]?: string;
};

const INDUSTRIES = [
  'Construction', 'IT & Software', 'Healthcare', 'Education', 
  'Manufacturing', 'Consulting', 'Finance', 'Real Estate', 'Other'
];

const ProfileForm = ({ initialData, onSubmit, loading = false }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: initialData?.full_name || '',
    company_name: initialData?.company_name || '',
    registration_id: initialData?.registration_id || '',
    experience_years: initialData?.experience_years || 0,
    industry: initialData?.industry || '',
    portfolio_links: initialData?.portfolio_links || [''],
  });

  // Change this line to use the new error type
  const [errors, setErrors] = useState<ProfileFormErrors>({});

  const validateForm = (): boolean => {
    // Change this line to use the new error type
    const newErrors: ProfileFormErrors = {};

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
    if (!formData.registration_id.trim()) newErrors.registration_id = 'Registration ID is required';
    if (formData.experience_years < 0) newErrors.experience_years = 'Experience must be positive';
    if (!formData.industry) newErrors.industry = 'Industry is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ...rest of your component remains the same
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const cleanedData = {
      ...formData,
      portfolio_links: formData.portfolio_links.filter(link => link.trim() !== ''),
    };

    await onSubmit(cleanedData);
  };

  const addPortfolioLink = () => {
    setFormData(prev => ({
      ...prev,
      portfolio_links: [...prev.portfolio_links, ''],
    }));
  };

  const removePortfolioLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio_links: prev.portfolio_links.filter((_, i) => i !== index),
    }));
  };

  const updatePortfolioLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      portfolio_links: prev.portfolio_links.map((link, i) => i === index ? value : link),
    }));
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium">Full Name *</label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className={errors.full_name ? 'border-red-500' : ''}
            />
            {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="company_name" className="text-sm font-medium">Company Name *</label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              className={errors.company_name ? 'border-red-500' : ''}
            />
            {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="registration_id" className="text-sm font-medium">Registration ID *</label>
            <Input
              id="registration_id"
              value={formData.registration_id}
              onChange={(e) => setFormData(prev => ({ ...prev, registration_id: e.target.value }))}
              className={errors.registration_id ? 'border-red-500' : ''}
            />
            {errors.registration_id && <p className="text-sm text-red-500">{errors.registration_id}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="experience_years" className="text-sm font-medium">Years of Experience *</label>
            <Input
              id="experience_years"
              type="number"
              min="0"
              value={formData.experience_years}
              onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
              className={errors.experience_years ? 'border-red-500' : ''}
            />
            {errors.experience_years && <p className="text-sm text-red-500">{errors.experience_years}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="industry" className="text-sm font-medium">Industry *</label>
          <select
            id="industry"
            value={formData.industry}
            onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            className={`w-full h-10 px-3 py-2 text-sm border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.industry ? 'border-red-500' : ''}`}
          >
            <option value="" disabled>Select your industry</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Portfolio Links</label>
            <Button type="button" variant="outline" size="sm" onClick={addPortfolioLink}>
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
          
          {formData.portfolio_links.map((link, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="https://your-portfolio-link.com"
                value={link}
                onChange={(e) => updatePortfolioLink(index, e.target.value)}
              />
              {formData.portfolio_links.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removePortfolioLink(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </Card>
  );
};

export default ProfileForm;