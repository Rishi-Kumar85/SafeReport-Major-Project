import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Report = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    category: "",
    department: "",
    location: "",
    incidentDate: "",
    description: "",
  });

  const categories = [
    { value: "bribery", label: "Bribery & Extortion" },
    { value: "misuse_of_power", label: "Misuse of Public Funds" },
    { value: "nepotism", label: "Nepotism & Favoritism" },
    { value: "financial_fraud", label: "Embezzlement" },
    { value: "conflict_of_interest", label: "Abuse of Power" },
    { value: "other", label: "Other" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const generateTrackingId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) id += "-";
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const newTrackingId = generateTrackingId();

      const reportData = {
        tracking_id: newTrackingId,
        user_id: user?.id || null,
        category: formData.category as any,
        department: formData.department,
        location: formData.location,
        incident_date: formData.incidentDate,
        description: formData.description,
      };

      const { error } = await supabase.from("reports").insert(reportData);

      if (error) throw error;

      setTrackingId(newTrackingId);
      toast({
        title: "Report Submitted Successfully",
        description: "Your report has been securely submitted. Save your tracking ID.",
      });
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (trackingId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <Card className="max-w-2xl w-full shadow-[var(--shadow-card)]">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-3xl">Report Submitted Successfully</CardTitle>
              <CardDescription className="text-base mt-2">
                Your report has been encrypted and securely forwarded to the relevant authorities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-xl bg-accent border-2 border-primary/20">
                <Label className="text-sm font-medium mb-2 block">Your Anonymous Tracking ID</Label>
                <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-background">
                  <code className="text-2xl font-mono font-bold text-primary tracking-wider">
                    {trackingId}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(trackingId);
                      toast({ title: "Copied!", description: "Tracking ID copied to clipboard" });
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  <strong>Important:</strong> Save this ID securely. You'll need it to track your report's status. We cannot recover lost IDs.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  What Happens Next?
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Your report is forwarded to the appropriate law enforcement agency</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Investigation begins within 48-72 hours</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Track status updates using your tracking ID</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Your identity remains completely anonymous throughout</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1"
                  onClick={() => {
                    window.location.href = "/track";
                  }}
                >
                  Track This Report
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setTrackingId(null);
                    setSelectedFiles([]);
                  }}
                >
                  Submit Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                File Anonymous Report
              </span>
            </h1>
            <p className="text-muted-foreground">
              All information is encrypted and your identity is protected
            </p>
          </div>

          {/* Security Notice */}
          <Card className="mb-8 border-primary/20 bg-accent/50">
            <CardContent className="flex gap-4 items-start p-6">
              <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="font-semibold text-card-foreground">Your Security is Our Priority</p>
                <p className="text-sm text-muted-foreground">
                  This form does not collect any personal information. All data is encrypted end-to-end. 
                  You will receive an anonymous tracking ID to monitor your report.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Report Form */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>
                Provide as much detail as possible to help investigators understand the situation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Type of Corruption <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    required 
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Government Department/Office</Label>
                    <Input
                      id="department"
                      placeholder="e.g., Ministry of Health"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location/City</Label>
                    <Input
                      id="location"
                      placeholder="e.g., New Delhi"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                {/* Incident Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">When did this occur?</Label>
                  <Input
                    id="date"
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    required
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Detailed Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what happened, who was involved, and any relevant details..."
                    className="min-h-[200px] resize-none"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include names, dates, amounts, and any other relevant information
                  </p>
                </div>

                {/* Evidence Upload */}
                <div className="space-y-2">
                  <Label htmlFor="evidence">Evidence (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <Input
                      id="evidence"
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Label htmlFor="evidence" className="cursor-pointer">
                      <span className="text-primary font-medium">Click to upload</span>
                      <span className="text-muted-foreground"> or drag and drop</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">
                      Photos, videos, documents, or audio recordings (Max 10 files, 50MB each)
                    </p>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Selected files:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedFiles.map((file, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-secondary" />
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Warning */}
                <div className="flex gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    False reporting is a serious offense. Please ensure all information provided is accurate and truthful.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Encrypting & Submitting...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Submit Secure Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Report;
