import { useState } from "react";
import { Shield, ArrowLeft, Globe, Server, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import ScanInput from "../components/recon/ScanInput"; 
import TerminalResults from "../components/recon/TerminalResults"; 

const domainSchema = z
  .string()
  .trim()
  .min(1, "Domain is required")
  .max(253, "Domain too long")
  .regex(
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
    "Invalid domain format (e.g. example.com)"
  );

export type ScanType = "ip" | "dns" | "headers";

export interface ScanResult {
  data: Record<string, unknown> | null;
  error: string | null;
  scanType: ScanType;
  domain: string;
  timestamp: string;
}

const Recon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (domain: string, scanType: ScanType) => {
    const parsed = domainSchema.safeParse(domain);
    if (!parsed.success) {
      setResult({
        data: null,
        error: parsed.error.errors[0].message,
        scanType,
        domain,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const encodedDomain = encodeURIComponent(parsed.data);

      // 🔹 Minimal fix: use Flask routes directly without /api
      let url = "";
      if (scanType === "ip") url = `/ip/${encodedDomain}`;
      else if (scanType === "dns") url = `/dns/${encodedDomain}`;
      else if (scanType === "headers") url = `/headers/${encodedDomain}`;

      // Optional combined scan endpoint (if you create /recon?domain=...)
      // url = `/recon?domain=${encodedDomain}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult({
        data,
        error: null,
        scanType,
        domain: parsed.data,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setResult({
        data: null,
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        scanType,
        domain: parsed.data,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-mono text-sm font-bold tracking-wider text-primary">RECON//TOOL</span>
        </div>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
        >
          <ArrowLeft className="h-4 w-4" />
          HOME
        </Link>
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-10">
        {/* Tool Overview */}
        <section className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground font-mono">
            <span className="text-primary">&gt;</span> Web Reconnaissance Tool
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Web reconnaissance collects technical info about a domain to understand its infrastructure and security posture.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-2 bg-secondary/50 rounded-md px-3 py-2 border border-border">
              <Globe className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs font-mono text-muted-foreground">IP Resolution</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 rounded-md px-3 py-2 border border-border">
              <Server className="h-4 w-4 text-cyber-green shrink-0" />
              <span className="text-xs font-mono text-muted-foreground">DNS Records</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 rounded-md px-3 py-2 border border-border">
              <Eye className="h-4 w-4 text-cyber-amber shrink-0" />
              <span className="text-xs font-mono text-muted-foreground">Security Headers</span>
            </div>
          </div>
        </section>

        {/* Input & Scan Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground font-mono">
            <span className="text-primary">&gt;</span> Run a Scan
          </h2>
          <ScanInput onScan={handleScan} isLoading={isLoading} />
          <div className="bg-secondary/30 border border-border rounded-md p-4 space-y-2">
            <p className="text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">How it works</p>
            <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Enter a valid domain (e.g. <span className="text-primary">google.com</span>)</li>
              <li>Click <span className="text-primary font-semibold">Run Scan</span></li>
              <li>View results below</li>
            </ol>
          </div>
        </section>

        {/* Results Section */}
        <TerminalResults result={result} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Recon;