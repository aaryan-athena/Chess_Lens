const Header = () => {
  return (
    <div className="row m-2">
      <div className="h1 col-12 h-100 d-flex justify-content-center align-items-end m-0">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="2.5"/>
          <circle cx="20" cy="20" r="11" stroke="white" strokeWidth="2"/>
          <circle cx="20" cy="20" r="4" fill="white"/>
          <line x1="20" y1="2" x2="20" y2="8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="20" y1="32" x2="20" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="2" y1="20" x2="8" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="32" y1="20" x2="38" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="15" y="6" width="10" height="4" rx="2" fill="white"/>
        </svg>
        <>&nbsp;</>
        <div>ChessLens</div>
      </div>
    </div>
  );
}

export default Header;
