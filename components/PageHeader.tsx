import Link from 'next/link'


export function PageHeader({ title }: { title: string }) {

    return <header id="nav" className="notion" style={{ backgroundColor: 'white' }}>
        <div style={{
            maxWidth: 700,
            display: 'flex',
            margin: "auto",
            alignItems: 'center',
            paddingLeft: "calc(min(16px, 8vw))",
            paddingRight: "calc(min(16px, 8vw))",
            height: 64,
            fontWeight: 500
        }}>
            <Link href="/">camnewnham</Link>
        </div>
    </header>
}