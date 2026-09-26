import { FileText, Upload, Eye, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      title: "Submit Your Report",
      description: "Fill out our secure anonymous form with details of the corruption or unethical practice you've witnessed.",
      color: "text-primary",
    },
    {
      icon: Upload,
      title: "Upload Evidence",
      description: "Attach supporting documents, photos, or videos to strengthen your case. All files are encrypted.",
      color: "text-secondary",
    },
    {
      icon: Eye,
      title: "Get Tracking ID",
      description: "Receive a unique anonymous ID to track your report's progress without revealing your identity.",
      color: "text-primary-glow",
    },
    {
      icon: CheckCircle,
      title: "Agency Review",
      description: "Your report is securely forwarded to relevant authorities for investigation and action.",
      color: "text-secondary",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            How It <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to report corruption safely and anonymously
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent" />
                )}
                
                <div className="relative p-6 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-button)] transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 mt-2">
                    <div className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
