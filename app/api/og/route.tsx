import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Blog Post';
  const description = searchParams.get('description') || 'Read our latest insights from OneClickResult.';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: '100% 100%',
          fontFamily: '"Geist", "Inter", sans-serif',
        }}
      >
        {/* Background Patterns */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)`,
            backgroundSize: '100px 100px',
            opacity: 0.5,
          }}
        />
        
        {/* Decorative Orbs */}
        <div style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            filter: 'blur(80px)',
        }} />
         <div style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255, 0, 150, 0.15)',
            filter: 'blur(80px)',
        }} />

        {/* Glassmorphism Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '85%',
            height: '80%',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            borderRadius: '24px',
            padding: '60px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            position: 'relative',
            zIndex: 10,
          }}
        >
            {/* Header / Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <span style={{ fontSize: '28px', fontWeight: 600, color: '#2D3748', letterSpacing: '-0.02em' }}>
                    oneclickresult
                </span>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: 800,
                    color: '#1A202C',
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    margin: 0,
                    textShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}>
                    {title.length > 60 ? title.slice(0, 60) + '...' : title}
                </h1>
                
                <p style={{
                    fontSize: '32px',
                    color: '#4A5568',
                    lineHeight: 1.5,
                    margin: 0,
                    maxWidth: '90%',
                    fontWeight: 500,
                }}>
                    {description.length > 120 ? description.slice(0, 120) + '...' : description}
                </p>
            </div>

            {/* Footer / Meta */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                width: '100%',
                borderTop: '2px solid rgba(0,0,0,0.05)',
                paddingTop: '24px'
            }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <span style={{ fontSize: '20px', fontWeight: 600, color: '#718096' }}>Read more at</span>
                     <span style={{ fontSize: '20px', fontWeight: 700, color: '#4A5568' }}>blog.oneclickresult.com</span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#48BB78' }}></div>
                     <span style={{ fontSize: '18px', fontWeight: 600, color: '#48BB78' }}>Latest Update</span>
                 </div>
            </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
