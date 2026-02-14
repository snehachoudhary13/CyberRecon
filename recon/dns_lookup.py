import dns.resolver

def get_dns_records(domain):
    records = {}   # ✅ THIS WAS MISSING

    try:
        # A record
        a_records = dns.resolver.resolve(domain, 'A')
        records['A'] = [ip.to_text() for ip in a_records]

        # MX record
        mx_records = dns.resolver.resolve(domain, 'MX')
        records['MX'] = [str(mx.exchange) for mx in mx_records]

        # NS record
        ns_records = dns.resolver.resolve(domain, 'NS')
        records['NS'] = [str(ns.target) for ns in ns_records]

    except Exception as e:
        records['error'] = str(e)

    return records