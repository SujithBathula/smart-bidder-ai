import TenderCard from "./TenderCard";
import TenderFilters from "./TenderFilters";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Sparkles } from "lucide-react";

const TenderMarketplace = () => {
  const tenders = [
    {
      title: "Website Development for Healthcare Platform",
      company: "MedTech Solutions",
      budget: "$25,000 - $50,000",
      deadline: "30 days",
      location: "San Francisco, CA",
      category: "IT & Software",
      description: "We need a comprehensive healthcare platform with patient management, appointment scheduling, and telemedicine capabilities. Must be HIPAA compliant.",
      isRecommended: true,
      verified: true,
    },
    {
      title: "Office Building Construction Project",
      company: "Urban Development Corp",
      budget: "$2M - $5M",
      deadline: "45 days",
      location: "Austin, TX",
      category: "Construction",
      description: "Large-scale office building construction project requiring experienced contractors with proven track record in commercial real estate.",
      verified: true,
    },
    {
      title: "Digital Marketing Campaign Management",
      company: "TechStart Inc",
      budget: "$10,000 - $25,000",
      deadline: "14 days",
      location: "Remote",
      category: "Marketing",
      description: "Comprehensive digital marketing strategy including social media, SEO, content marketing, and paid advertising for a B2B SaaS platform.",
      isRecommended: true,
    },
    {
      title: "Supply Chain Optimization Consulting",
      company: "Global Logistics Ltd",
      budget: "$50,000 - $100,000",
      deadline: "60 days",
      location: "Chicago, IL",
      category: "Consulting",
      description: "End-to-end supply chain analysis and optimization for international shipping operations. Requires expertise in logistics and data analytics.",
    },
    {
      title: "Mobile App Development",
      company: "RetailMax",
      budget: "$15,000 - $30,000",
      deadline: "21 days",
      location: "New York, NY",
      category: "IT & Software",
      description: "Native mobile app for iOS and Android with e-commerce functionality, real-time inventory, and customer management features.",
      verified: true,
    },
    {
      title: "Financial Audit Services",
      company: "GrowthCorp",
      budget: "$20,000 - $40,000",
      deadline: "90 days",
      location: "Boston, MA",
      category: "Finance",
      description: "Complete financial audit for mid-size corporation preparing for Series B funding round. CPA certification required.",
    },
  ];

  return (
    <section className="container py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80 shrink-0">
          <TenderFilters />
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Tender Marketplace</h2>
              <p className="text-muted-foreground">
                {tenders.length} tenders available • {tenders.filter(t => t.isRecommended).length} recommended for you
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Recommended Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Recommended for You</h3>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {tenders
                .filter(tender => tender.isRecommended)
                .map((tender, index) => (
                  <TenderCard key={`recommended-${index}`} {...tender} />
                ))}
            </div>
          </div>

          {/* All Tenders */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">All Tenders</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {tenders.map((tender, index) => (
                <TenderCard key={index} {...tender} />
              ))}
            </div>
          </div>

          {/* Load More */}
          <div className="text-center pt-8">
            <Button variant="outline" size="lg">
              Load More Tenders
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TenderMarketplace;