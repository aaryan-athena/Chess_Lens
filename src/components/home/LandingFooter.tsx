import { SocialIcon } from "react-social-icons/component";
import "react-social-icons/github";
import "react-social-icons/youtube";
import "react-social-icons/google_play";

const LandingFooter = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="landing-footer">
      <div className="footer-logo">
        <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#818cf8" strokeWidth="2.5"/>
          <circle cx="20" cy="20" r="11" stroke="#818cf8" strokeWidth="2"/>
          <circle cx="20" cy="20" r="4" fill="#818cf8"/>
          <line x1="20" y1="2" x2="20" y2="8" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="20" y1="32" x2="20" y2="38" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="2" y1="20" x2="8" y2="20" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="32" y1="20" x2="38" y2="20" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="15" y="6" width="10" height="4" rx="2" fill="#818cf8"/>
        </svg>
        <span>ChessLens</span>
      </div>

      <div className="footer-links">
        <a href="#features" onClick={e => { e.preventDefault(); scrollTo("features"); }}>Features</a>
        <a href="#how-it-works" onClick={e => { e.preventDefault(); scrollTo("how-it-works"); }}>How it works</a>
        <a href="#get-started" onClick={e => { e.preventDefault(); scrollTo("get-started"); }}>Get started</a>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <SocialIcon target="_blank" network="github"       url="https://github.com"                    bgColor="#1f1f2e" style={{ width: 36, height: 36 }} />
        <SocialIcon target="_blank" network="youtube"      url="https://www.youtube.com"               style={{ width: 36, height: 36 }} />
        <SocialIcon target="_blank" network="google_play"  url="https://play.google.com/store/apps"    style={{ width: 36, height: 36 }} />
      </div>

      <p className="footer-copy">© {new Date().getFullYear()} ChessLens. Built with ♟ and computer vision.</p>
    </footer>
  );
};

export default LandingFooter;
