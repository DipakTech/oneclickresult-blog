import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Blog Post';
  const description = searchParams.get('description') || 'Read our latest insights.';
 
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          backgroundImage: 'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
          backgroundSize: '50px 50px',
        }}
      >
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '40px', 
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            maxWidth: '90%',
        }}>
             <h1 style={{ 
                 fontSize: 60, 
                 fontWeight: 'bold', 
                 color: '#1a202c', 
                 marginBottom: 20,
                 lineHeight: 1.2
            }}>
                {title.length > 50 ? title.slice(0, 50) + '...' : title}
            </h1>
             <p style={{ 
                 fontSize: 30, 
                 color: '#4a5568', 
                 maxWidth: '800px',
                 lineHeight: 1.4
            }}>
                {description.length > 100 ? description.slice(0, 100) + '...' : description}
            </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
