import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  variant: "success" | "warning" | "danger";
  className?: string;
}

const MetricCard = ({ title, value, variant, className }: MetricCardProps) => {
  const variantStyles = {
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground", 
    danger: "bg-danger text-danger-foreground"
  };

  return (
    <Card className={cn(
      "p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg",
      variantStyles[variant],
      className
    )}>
      <div className="space-y-2">
        <h3 className="text-3xl font-bold">{value}</h3>
        <p className="text-sm font-medium uppercase tracking-wide">{title}</p>
      </div>
    </Card>
  );
};

export default MetricCard;