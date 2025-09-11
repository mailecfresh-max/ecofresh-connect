import { Gift, Star } from "lucide-react";

interface LoyaltyProgressProps {
  earnedCredits: number;
  targetAmount: number;
}

export default function LoyaltyProgress({ earnedCredits = 450, targetAmount = 3000 }: LoyaltyProgressProps) {
  const progress = Math.min((earnedCredits / targetAmount) * 100, 100);
  const remainingToUnlock = Math.max(targetAmount - earnedCredits, 0);

  return (
    <div className="card-fresh p-6 bg-gradient-to-r from-brand-green/5 to-brand-lime/5 border border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-poppins font-semibold text-lg">
            ecfresh Credits
          </h3>
          <p className="text-muted-foreground text-sm">
            ₹{earnedCredits} / ₹300
          </p>
        </div>
      </div>
    </div>
  );
}