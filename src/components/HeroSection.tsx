import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, TrendingUp, Shield } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-muted">
      <div className="container py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Win More{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Tenders
                </span>{" "}
                with AI
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Generate professional proposals instantly, find perfect tender matches, 
                and grow your business with our AI-powered marketplace.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-base">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-base">
                Browse Tenders
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="font-semibold text-sm">AI Proposals</div>
                  <div className="text-xs text-muted-foreground">Auto-generated</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Smart Matching</div>
                  <div className="text-xs text-muted-foreground">Vector-based</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Secure Payments</div>
                  <div className="text-xs text-muted-foreground">Stripe powered</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated">
              <img
                src={heroImage}
                alt="Professional tender marketplace"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 bg-gradient-primary rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-gradient-hero rounded-full opacity-10 animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;