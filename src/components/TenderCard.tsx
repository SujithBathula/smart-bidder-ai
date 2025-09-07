import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, DollarSign, MapPin, Building, Sparkles } from "lucide-react";

interface TenderCardProps {
  title: string;
  company: string;
  budget: string;
  deadline: string;
  location: string;
  category: string;
  description: string;
  isRecommended?: boolean;
  verified?: boolean;
}

const TenderCard = ({
  title,
  company,
  budget,
  deadline,
  location,
  category,
  description,
  isRecommended = false,
  verified = false,
}: TenderCardProps) => {
  return (
    <Card className={`p-6 hover:shadow-elevated transition-all duration-300 border-2 ${
      isRecommended ? 'border-primary/30 bg-gradient-card' : 'border-border hover:border-primary/20'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg leading-tight">{title}</h3>
            {isRecommended && (
              <Sparkles className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{company}</span>
            {verified && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-success/10 text-success border-success/20">
                Verified
              </Badge>
            )}
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {category}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {description}
      </p>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-success" />
          <span className="font-medium">{budget}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-warning" />
          <span>{deadline}</span>
        </div>
        <div className="flex items-center gap-2 text-sm col-span-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{location}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          variant={isRecommended ? "hero" : "default"} 
          size="sm" 
          className="flex-1"
        >
          Generate Proposal
        </Button>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </div>

      {isRecommended && (
        <div className="mt-3 text-xs text-primary/80 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Recommended for you
        </div>
      )}
    </Card>
  );
};

export default TenderCard;