const Footer = () => {
  return (
    <footer className="bg-card border-t border-line mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <h3 className="font-display font-semibold text-ink mb-3">Services</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li className="hover:text-accent transition-colors cursor-pointer">Branches</li>
            <li className="hover:text-accent transition-colors cursor-pointer">Common Questions</li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-semibold text-ink mb-3">The Company</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li className="hover:text-accent transition-colors cursor-pointer">Who we are?</li>
            <li className="hover:text-accent transition-colors cursor-pointer">Our Products</li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-semibold text-ink mb-3">Policies</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li className="hover:text-accent transition-colors cursor-pointer">Policy Conditions</li>
            <li className="hover:text-accent transition-colors cursor-pointer">Terms of Use</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} MyStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;