import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  variant: "success" | "warning" | "danger";
  className?: string;
  onClick?: () => void;
}

const MetricCard = ({ title, value, variant, className, onClick }: MetricCardProps) => {
  const variantStyles = {
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground", 
    danger: "bg-danger text-danger-foreground"
  };

  return (
    <Card 
      className={cn(
        "p-6 text-center transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl rounded-xl border-0",
        onClick && "cursor-pointer hover:shadow-2xl",
        variantStyles[variant],
        className
      )}
      onClick={onClick}
      style={{
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
    >
      <div className="space-y-3">
        <h3 className="text-4xl font-bold">{value}</h3>
        <p className="text-sm font-medium uppercase tracking-wide opacity-90">{title}</p>
      </div>
    </Card>
  );
};

export default MetricCard;