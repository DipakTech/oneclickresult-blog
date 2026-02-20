import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'The Future of Investment: Trends to Watch in 2026';
  const description = searchParams.get('description') || 'Discover the latest strategies, market insights, and tools to maximize your portfolio growth this year.';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          backgroundColor: '#050505',
          fontFamily: '"Geist", "Inter", sans-serif',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Glowing Orbs for Mesh Gradient Effect */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '70%',
            height: '70%',
            backgroundImage: 'radial-gradient(ellipse at center, rgba(120, 119, 198, 0.5) 0%, rgba(5, 5, 5, 0) 65%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            right: '-10%',
            width: '70%',
            height: '70%',
            backgroundImage: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.45) 0%, rgba(5, 5, 5, 0) 65%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20%',
            right: '-15%',
            width: '50%',
            height: '50%',
            backgroundImage: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.4) 0%, rgba(5, 5, 5, 0) 65%)',
          }}
        />

        {/* Inner Glassmorphism Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '1060px',
            height: '510px',
            backgroundColor: 'rgba(20, 20, 20, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '32px',
            padding: '56px 64px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
            zIndex: 10,
          }}
        >
          {/* Header Section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            
            {/* Brand Logo & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  backgroundImage: 'linear-gradient(135deg, #FF3366 0%, #FF9933 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 16px rgba(255, 51, 102, 0.3)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span style={{ fontSize: '30px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
                oneclickresult
              </span>
            </div>
            
            {/* Category Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}>
              <span style={{ fontSize: '18px', fontWeight: 600, color: '#CBD5E1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Article
              </span>
            </div>
          </div>

          {/* Typography Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            <h1
              style={{
                fontSize: title.length > 60 ? '60px' : '72px',
                fontWeight: 800,
                color: '#F8FAFC',
                lineHeight: 1.15,
                letterSpacing: '-0.04em',
                margin: 0,
                maxWidth: '95%',
              }}
            >
              {title.length > 85 ? title.slice(0, 85) + '...' : title}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#94A3B8',
                lineHeight: 1.5,
                margin: 0,
                maxWidth: '90%',
                fontWeight: 400,
              }}
            >
              {description.length > 140 ? description.slice(0, 140) + '...' : description}
            </p>
          </div>

          {/* Footer Metadata */}
          <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span style={{ fontSize: '24px', color: '#E2E8F0', fontWeight: 500 }}>Editorial Team</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <span style={{ fontSize: '24px', fontWeight: 600, color: '#64748B' }}>
                blog.oneclickresult.com
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
