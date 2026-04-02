const SidebarButton = (props: any) => {
  return (
    <button
      onClick={props.onClick}
      style={{
        width: "100%",
        padding: "0.45rem 0.75rem",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        color: "rgba(255,255,255,0.75)",
        fontSize: "0.82rem",
        cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s, color 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.09)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        e.currentTarget.style.color = "rgba(255,255,255,0.75)";
      }}
    >
      {props.children}
    </button>
  );
};

export default SidebarButton;
