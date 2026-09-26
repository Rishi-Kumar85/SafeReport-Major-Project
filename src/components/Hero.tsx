import { Button } from "@/components/ui/button";
import { Shield, Lock, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-governance.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Secure governance platform"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-accent-foreground">
              Secure • Anonymous • Confidential
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Report Corruption
            </span>
            <br />
            <span className="text-foreground">Safely & Anonymously</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your voice matters in the fight against corruption. Our secure platform ensures your identity remains protected while bringing transparency to government offices and public services.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/auth">
              <Button variant="hero" size="lg" className="min-w-[200px] group">
                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Get Started
              </Button>
            </Link>
            <Link to="/track">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                <Lock className="w-5 h-5" />
                Track Your Report
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-6 rounded-xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-button)] transition-shadow duration-300">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-card-foreground">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground text-center">
                Your data is encrypted and secure at every step
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 rounded-xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-button)] transition-shadow duration-300">
              <Lock className="w-8 h-8 text-secondary" />
              <h3 className="font-semibold text-card-foreground">Complete Anonymity</h3>
              <p className="text-sm text-muted-foreground text-center">
                No personal information required to submit reports
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 rounded-xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-button)] transition-shadow duration-300">
              <FileText className="w-8 h-8 text-primary-glow" />
              <h3 className="font-semibold text-card-foreground">Evidence Support</h3>
              <p className="text-sm text-muted-foreground text-center">
                Upload photos, documents, and videos securely
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
