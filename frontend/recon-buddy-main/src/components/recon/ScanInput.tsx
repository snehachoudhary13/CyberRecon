import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import type { ScanType } from "@/pages/Recon";

interface ScanInputProps {
  onScan: (domain: string, scanType: ScanType) => void;
  isLoading: boolean;
}

const scanTypes: { value: ScanType; label: string; description: string }[] = [
  { value: "ip", label: "IP Lookup", description: "Resolve domain to IP address" },
  { value: "dns", label: "DNS Records", description: "Query DNS record entries" },
  { value: "headers", label: "Security Headers", description: "Inspect HTTP security headers" },
];

const ScanInput = ({ onScan, isLoading }: ScanInputProps) => {
  const [domain, setDomain] = useState("");
  const [scanType, setScanType] = useState<ScanType>("ip");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScan(domain, scanType);
  };

  return (
    <section className="bg-card border border-border rounded-lg p-6 space-y-5 border-glow">
      {/* Scan type tabs */}
      <div className="flex gap-2">
        {scanTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setScanType(type.value)}
            className={`px-4 py-2 rounded-md text-xs font-mono font-medium transition-colors ${
              scanType === type.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground font-mono">
        {scanTypes.find((t) => t.value === scanType)?.description}
      </p>

      {/* Domain input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            maxLength={253}
            className="w-full bg-input border border-border rounded-md px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !domain.trim()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          RUN SCAN
        </button>
      </form>
    </section>
  );
};

export default ScanInput;
