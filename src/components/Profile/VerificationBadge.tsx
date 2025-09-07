import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, ShieldX, Award } from "lucide-react";

interface VerificationBadgeProps {
  status: 'pending' | 'verified' | 'rejected';
  badgeLevel?: 'bronze' | 'silver' | 'gold' | 'platinum' | null;
}

const VerificationBadge = ({ status, badgeLevel }: VerificationBadgeProps) => {
  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'bg-amber-600';
      case 'silver': return 'bg-gray-400';
      case 'gold': return 'bg-yellow-500';
      case 'platinum': return 'bg-purple-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return <ShieldCheck className="h-4 w-4" />;
      case 'rejected':
        return <ShieldX className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="flex gap-2">
      <Badge className={`${getStatusColor()} border`}>
        {getStatusIcon()}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
      
      {status === 'verified' && badgeLevel && (
        <Badge className={`${getBadgeColor(badgeLevel)} text-white`}>
          <Award className="h-4 w-4 mr-1" />
          <span className="capitalize">{badgeLevel}</span>
        </Badge>
      )}
    </div>
  );
};

export default VerificationBadge;