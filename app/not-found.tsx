import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>გვერდი ვერ მოიძებნა</h2>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        სამწუხაროდ, თქვენ მიერ მოთხოვნილი გვერდი არ არსებობს.
      </p>
      <Link 
        href="/" 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#0070f3', 
          color: 'white', 
          borderRadius: '5px',
          textDecoration: 'none'
        }}
      >
        მთავარ გვერდზე დაბრუნება
      </Link>
    </div>
  );
}
