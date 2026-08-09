import { motion } from "framer-motion";

export default function SectionCard({ title, icon: Icon, children, delay = 0, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-premium rounded-2xl border border-border overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 bg-secondary/20">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          <h3 className="text-sm font-bold">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}