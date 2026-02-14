import { Link } from "react-router-dom";
import { Shield, Terminal, Search, Lock, Wifi, Globe, ChevronRight, Database, Server, Eye } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <span className="font-mono text-sm font-bold tracking-wider text-primary">RECON//TOOL</span>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-secondary/60 border border-border rounded-full px-4 py-1.5 text-xs font-mono text-muted-foreground">
            <Wifi className="h-3 w-3 text-primary" />
            <span>CYBERSECURITY RECONNAISSANCE PLATFORM</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Uncover the Digital
            <br />
            <span className="text-primary text-glow">Footprint</span> of Any Domain
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Analyze any domain to extract IP addresses, DNS records, and security headers. 
            Professional-grade reconnaissance powered by automated intelligence gathering.
          </p>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground font-mono">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <span>IP Resolution</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-cyber-green" />
              <span>DNS Enumeration</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyber-amber" />
              <span>Header Analysis</span>
            </div>
          </div>

          {/* Terminal preview */}
          <div className="mt-8 bg-terminal-bg border border-border rounded-lg p-4 text-left font-mono text-xs text-muted-foreground border-glow max-w-lg mx-auto">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
              <div className="w-2.5 h-2.5 rounded-full bg-cyber-red" />
              <div className="w-2.5 h-2.5 rounded-full bg-cyber-amber" />
              <div className="w-2.5 h-2.5 rounded-full bg-cyber-green" />
              <span className="ml-2 text-muted-foreground/60">recon@terminal</span>
            </div>
            <p><span className="text-cyber-green">$</span> recon --scan example.com</p>
            <p className="text-primary">[+] Resolving target...</p>
            <p className="text-primary">[+] IP: 93.184.216.34</p>
            <p className="text-primary">[+] DNS: 5 records found</p>
            <p className="text-primary">[+] Headers: 8 security headers analyzed</p>
            <p className="text-cyber-green">[✓] Reconnaissance complete.</p>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="border-t border-border bg-card/30 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground font-mono">
              <span className="text-primary">&gt;</span> Web Reconnaissance Tool
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Enter any domain name and perform comprehensive reconnaissance analysis. 
              Our automated tool gathers critical intelligence about your target's 
              digital infrastructure in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border rounded-lg p-6 space-y-3 border-glow">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-mono font-semibold text-foreground text-sm">IP Address Lookup</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Resolve domain names to their underlying IP addresses. Identify hosting providers 
                and geographic locations of target servers.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3 border-glow">
              <div className="w-10 h-10 rounded-md bg-cyber-green/10 flex items-center justify-center">
                <Server className="h-5 w-5 text-cyber-green" />
              </div>
              <h3 className="font-mono font-semibold text-foreground text-sm">DNS Record Enumeration</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Query and enumerate DNS records including A, MX, NS, and more. Map the complete 
                DNS infrastructure of any domain.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3 border-glow">
              <div className="w-10 h-10 rounded-md bg-cyber-amber/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-cyber-amber" />
              </div>
              <h3 className="font-mono font-semibold text-foreground text-sm">Security Header Analysis</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Inspect HTTP security headers to evaluate the target's security posture. 
                Detect missing or misconfigured protections.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/web-recon"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono font-semibold px-10 py-3.5 rounded-md hover:opacity-90 transition-opacity text-sm tracking-wider border-glow"
            >
              <Terminal className="h-4 w-4" />
              START WEB RECON
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
