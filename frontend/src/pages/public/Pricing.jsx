import React, { useState } from "react";
import {
  CheckCircle2,
  Mail,
  Rocket,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Lock,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

const Pricing = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNotifyMe = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      toast.success(
        "You're on the list! We'll notify you when pricing is announced.",
      );
      setEmail("");
      setIsSubmitting(false);
    }, 1500);
  };

  const features = [
    {
      title: "Secure Authentication",
      description:
        "Enterprise-grade auth with MFA, social logins, and passwordless options",
      icon: Shield,
    },
    {
      title: "Real-time Analytics",
      description:
        "Track user growth, session trends, and authentication success rates",
      icon: BarChart3,
    },
    {
      title: "Global Infrastructure",
      description:
        "Low-latency edge deployment for lightning-fast auth worldwide",
      icon: Globe,
    },
    {
      title: "Advanced Security",
      description:
        "Anomaly detection, rate limiting, and brute-force protection built-in",
      icon: Lock,
    },
    {
      title: "Developer First",
      description:
        "Powerful SDKs, clear documentation, and a first-class CLI experience",
      icon: Zap,
    },
    {
      title: "Seamless Integrations",
      description: "Connect with your favorite tools and platforms in minutes",
      icon: Rocket,
    },
  ];

  const faqs = [
    {
      question: "When will pricing be available?",
      answer:
        "We are currently in the final stages of defining our pricing model. We expect to announce official plans within the next few weeks.",
    },
    {
      question: "Will there be a free tier?",
      answer:
        "Yes! We are committed to supporting the developer community. AuthSphere will always have a robust free tier for hobby projects and early-stage startups.",
    },
    {
      question: "Will early users get benefits?",
      answer:
        "Absolutely. Users who join our early access list will be eligible for special pricing and exclusive benefits.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center text-balance">
      <div className="w-full max-w-6xl px-6 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="gap-1.5">
            <Info className="h-3 w-3" />
            Pricing Coming Soon
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Simple pricing, <span className="text-primary">launching soon</span>
          </h1>

          <p className="text-lg text-muted-foreground">
            We're perfecting our pricing model based on feedback from early beta
            users. Our goal is transparent, scale-with-you pricing for teams of
            all sizes.
          </p>

          <form
            onSubmit={handleNotifyMe}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto mt-8"
          >
            <div className="relative w-full">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Wait-listing..." : "Notify Me"}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Join 2,000+ developers on the waitlist</span>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything you need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Core features that deliver a premium authentication experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="mt-24">
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Need a custom plan early?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                Enterprise or high-growth startup? Let's discuss your specific
                requirements.
              </p>
              <Button variant="outline">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
