import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useSound } from "@/hooks/useSoundEffects";

interface NavigationButtonProps {
  label: string;
  icon?: LucideIcon;
  iconEmoji?: string;
  isActive?: boolean;
  disabled?: boolean;
  variant?: "default" | "glow" | "minimal";
  onClick?: () => void;
}

export const NavigationButton = ({
  label,
  icon: Icon,
  iconEmoji,
  isActive = false,
  disabled = false,
  variant = "default",
  onClick,
}: NavigationButtonProps) => {
  const { playSound } = useSound();

  const handleClick = () => {
    if (!disabled) {
      playSound("navigate");
      onClick?.();
    }
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      playSound("hover");
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300",
        "border",
        
        // Default state
        !isActive && !disabled && variant === "default" && [
          "bg-secondary/50 border-border/50",
          "hover:bg-secondary hover:border-primary/30",
          "hover:shadow-[0_0_15px_hsl(175,80%,50%,0.1)]",
        ],
        
        // Active state
        isActive && [
          "bg-primary/10 border-primary/50",
          "shadow-[0_0_20px_hsl(175,80%,50%,0.2)]",
        ],
        
        // Disabled state
        disabled && [
          "opacity-50 cursor-not-allowed",
          "bg-muted border-border/30",
        ],
        
        // Glow variant
        variant === "glow" && !disabled && [
          "glow-primary",
        ],
        
        // Minimal variant
        variant === "minimal" && [
          "border-transparent hover:border-border",
        ]
      )}
    >
      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center",
        "bg-background/50",
        isActive ? "text-primary" : "text-muted-foreground"
      )}>
        {Icon && <Icon className="w-6 h-6" />}
        {iconEmoji && <span className="text-2xl">{iconEmoji}</span>}
      </div>
      
      {/* Label */}
      <span className={cn(
        "text-xs font-medium",
        isActive ? "text-primary" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </button>
  );
};
