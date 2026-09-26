import { Shield, Lock, FileCheck, Bell, Users, Database } from "lucide-react";
import securityIcon from "@/assets/security-icon.jpg";
import anonymousIcon from "@/assets/anonymous-icon.jpg";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Military-Grade Encryption",
      description: "All data is protected with AES-256 encryption, the same standard used by governments worldwide.",
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Architecture",
      description: "We never collect personal information. Your identity remains completely anonymous throughout the process.",
    },
    {
      icon: FileCheck,
      title: "Evidence Management",
      description: "Securely upload photos, documents, audio, and video files to support your corruption report.",
    },
    {
      icon: Bell,
      title: "Real-Time Updates",
      description: "Track your report's status in real-time with your anonymous tracking ID.",
    },
    {
      icon: Users,
      title: "Direct Agency Access",
      description: "Reports are forwarded directly to relevant law enforcement and government oversight bodies.",
    },
    {
      icon: Database,
      title: "Secure Storage",
      description: "All evidence and reports are stored in encrypted databases with strict access controls.",
    },
  ];

  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Built for <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Security</span> & <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Privacy</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            State-of-the-art technology to protect whistleblowers and ensure accountability
          </p>
        </div>

        {/* Feature Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <div className="relative group overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-button)] transition-all duration-300">
            <img
              src={securityIcon}
              alt="Security and encryption"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/95 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-xl font-bold text-card-foreground mb-1">
                  Bank-Level Security
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your data is protected with the highest security standards
                </p>
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-button)] transition-all duration-300">
            <img
              src={anonymousIcon}
              alt="Anonymous reporting"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/95 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-xl font-bold text-card-foreground mb-1">
                  Complete Anonymity
                </h3>
                <p className="text-sm text-muted-foreground">
                  No registration, no tracking, no personal information required
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-button)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
