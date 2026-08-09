import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 text-center px-6 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-secondary/60 border border-border/50 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-muted-foreground/40" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          className="mt-5 bg-primary hover:bg-primary/90 rounded-xl h-8 px-4 text-xs font-medium"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}