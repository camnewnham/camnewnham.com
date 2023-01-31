import Link from "next/link";
import { Header } from "react-notion-x";

export function PageHeader({}: {}) {
  return (
    <header id="nav" className="notion" style={{ backgroundColor: "white" }}>
      <div
        style={{
          maxWidth: 700,
          display: "flex",
          margin: "auto",
          alignItems: "center",
          paddingLeft: "calc(min(16px, 8vw))",
          paddingRight: "calc(min(16px, 8vw))",
          height: 64,
          fontWeight: 500,
        }}
      >
        <Link href="/">camnewnham</Link>
      </div>
    </header>
  );
}
