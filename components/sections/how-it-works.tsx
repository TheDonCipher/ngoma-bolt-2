import { Wallet, Music, Badge, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your Web3 wallet to start collecting and trading music NFTs"
  },
  {
    icon: Music,
    title: "Discover Music",
    description: "Browse exclusive tracks and albums from African artists"
  },
  {
    icon: Badge,
    title: "Collect NFTs",
    description: "Own unique music pieces and unlock exclusive benefits"
  },
  {
    icon: Calendar,
    title: "Join Events",
    description: "Participate in virtual concerts and meet your favorite artists"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join the Web3 music revolution in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 bg-card hover:bg-muted/50 transition-colors">
              <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
