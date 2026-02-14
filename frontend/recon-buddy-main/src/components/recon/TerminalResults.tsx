import { AlertTriangle, CheckCircle2, Loader2, Terminal } from "lucide-react";
import type { ScanResult } from "@/pages/Recon";

interface TerminalResultsProps {
  result: ScanResult | null;
  isLoading: boolean;
}

const JsonLine = ({ keyName, value, indent = 0 }: { keyName: string; value: unknown; indent?: number }) => {
  const pad = "  ".repeat(indent);
  const valueColor =
    typeof value === "number"
      ? "text-cyber-amber"
      : typeof value === "boolean"
        ? "text-cyber-green"
        : "text-foreground";

  return (
    <div>
      <span className="text-muted-foreground">{pad}</span>
      <span className="text-primary">"{keyName}"</span>
      <span className="text-muted-foreground">: </span>
      <span className={valueColor}>
        {typeof value === "string" ? `"${value}"` : String(value)}
      </span>
    </div>
  );
};

const renderJson = (data: Record<string, unknown>, indent = 1): React.ReactNode[] => {
  return Object.entries(data).map(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return (
        <div key={key}>
          <span className="text-muted-foreground">{"  ".repeat(indent)}</span>
          <span className="text-primary">"{key}"</span>
          <span className="text-muted-foreground">{": {"}</span>
          {renderJson(value as Record<string, unknown>, indent + 1)}
          <span className="text-muted-foreground">{"  ".repeat(indent)}{"}"}</span>
        </div>
      );
    }
    if (Array.isArray(value)) {
      return (
        <div key={key}>
          <span className="text-muted-foreground">{"  ".repeat(indent)}</span>
          <span className="text-primary">"{key}"</span>
          <span className="text-muted-foreground">{": ["}</span>
          {value.map((item, i) => (
            <div key={i}>
              <span className="text-muted-foreground">{"  ".repeat(indent + 1)}</span>
              <span className="text-foreground">
                {typeof item === "string" ? `"${item}"` : String(item)}
              </span>
              {i < value.length - 1 && <span className="text-muted-foreground">,</span>}
            </div>
          ))}
          <span className="text-muted-foreground">{"  ".repeat(indent)}{"]"}</span>
        </div>
      );
    }
    return <JsonLine key={key} keyName={key} value={value} indent={indent} />;
  });
};

const TerminalResults = ({ result, isLoading }: TerminalResultsProps) => {
  if (!isLoading && !result) return null;

  return (
    <section className="bg-terminal-bg border border-border rounded-lg overflow-hidden border-glow">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/50">
        <div className="w-2.5 h-2.5 rounded-full bg-cyber-red" />
        <div className="w-2.5 h-2.5 rounded-full bg-cyber-amber" />
        <div className="w-2.5 h-2.5 rounded-full bg-cyber-green" />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs font-mono text-muted-foreground">
            {result?.domain ? `recon@${result.domain}` : "recon@terminal"}
          </span>
        </div>
        <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      {/* Terminal body */}
      <div className="p-5 font-mono text-xs leading-relaxed min-h-[200px] relative scanline">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <div className="space-y-1 text-center">
              <p className="text-primary animate-pulse-glow">[*] Scanning target...</p>
              <p className="text-muted-foreground">[*] Establishing connection</p>
              <p className="text-muted-foreground">[*] Awaiting response</p>
            </div>
          </div>
        )}

        {!isLoading && result?.error && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-semibold">[ERROR] Scan failed</span>
            </div>
            <div className="pl-6 space-y-1">
              <p className="text-destructive">&gt; {result.error}</p>
              <p className="text-muted-foreground">&gt; Domain: {result.domain}</p>
              <p className="text-muted-foreground">&gt; Type: {result.scanType.toUpperCase()}</p>
              <p className="text-muted-foreground">&gt; Time: {result.timestamp}</p>
            </div>
          </div>
        )}

        {!isLoading && result?.data && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyber-green">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-semibold">[SUCCESS] Scan complete</span>
            </div>
            <div className="pl-2 space-y-1">
              <p className="text-muted-foreground">
                <span className="text-cyber-green">$</span> recon --{result.scanType} {result.domain}
              </p>
              <p className="text-muted-foreground text-[10px]"># {result.timestamp}</p>
            </div>
            <div className="mt-4 bg-background/50 rounded-md p-4 border border-border overflow-x-auto">
              <div className="text-muted-foreground">{"{"}</div>
              {renderJson(result.data)}
              <div className="text-muted-foreground">{"}"}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TerminalResults;
