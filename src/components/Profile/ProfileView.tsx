import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BidderProfile } from '@/types/profile';
import VerificationBadge from './VerificationBadge';
import { Building2, Calendar, ExternalLink, FileText, MapPin, User } from 'lucide-react';

interface ProfileViewProps {
  profile: BidderProfile;
  onEdit: () => void;
  isOwnProfile?: boolean;
}

const ProfileView = ({ profile, onEdit, isOwnProfile = false }: ProfileViewProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              <p className="text-gray-600">{profile.company_name}</p>
              <VerificationBadge 
                status={profile.verification_status}
                badgeLevel={profile.badge_level}
              />
            </div>
          </div>
          
          {isOwnProfile && (
            <Button onClick={onEdit} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Registration ID</p>
                <p className="font-medium">{profile.registration_id}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium">{profile.experience_years} years</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-medium">{profile.industry}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {profile.portfolio_links.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Portfolio Links</p>
                <div className="space-y-2">
                  {profile.portfolio_links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-sm truncate">{link}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {profile.documents.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Documents</p>
                <div className="space-y-2">
                  {profile.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{doc.name}</span>
                      <span className="text-xs text-gray-500 capitalize">
                        ({doc.type})
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileView;