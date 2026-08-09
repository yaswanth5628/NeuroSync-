import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO, isValid } from "date-fns";

export default function EditableField({
  icon: Icon,
  label,
  value,
  onChange,
  editMode,
  type = "text",
  placeholder,
  options,
  maxLength,
  multiline,
  suffix,
  plain,
}) {
  const displayValue = value || "";

  const formatDate = (val) => {
    if (!val) return "";
    try {
      const d = typeof val === "string" ? parseISO(val) : new Date(val);
      return isValid(d) ? format(d, "MMM d, yyyy") : val;
    } catch { return val; }
  };

  const selectValue = options
    ? options.find((opt) => opt.toLowerCase() === displayValue.toLowerCase()) || displayValue
    : displayValue;

  const humanDisplay = type === "date" ? formatDate(displayValue) : displayValue;

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      {editMode ? (
        multiline ? (
          <Textarea
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            maxLength={maxLength}
            className="rounded-xl text-sm resize-none bg-background/40"
            rows={3}
          />
        ) : options ? (
          <Select value={selectValue || undefined} onValueChange={onChange}>
            <SelectTrigger className="rounded-xl text-sm h-9 bg-background/40">
              <SelectValue placeholder={placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt} className="capitalize">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="relative">
            <Input
              type={type}
              value={displayValue}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              maxLength={maxLength}
              className="rounded-xl text-sm h-9 bg-background/40"
            />
            {suffix && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground pointer-events-none">
                {suffix}
              </span>
            )}
          </div>
        )
      ) : (
        <p className="text-sm font-medium text-foreground/90 min-h-[22px] flex items-center">
          {humanDisplay ? (
            <>
              <span className={plain ? "" : "capitalize"}>{humanDisplay}</span>
              {suffix && <span className="text-muted-foreground ml-1 lowercase">{suffix}</span>}
            </>
          ) : (
            <span className="text-muted-foreground/40 italic text-xs">Not provided</span>
          )}
        </p>
      )}
    </div>
  );
}