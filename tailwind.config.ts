import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors via CSS variables for theme switching
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          subtle: "var(--color-primary-subtle)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          raised: "var(--color-surface-raised)",
          overlay: "var(--color-surface-overlay)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          light: "var(--color-border-light)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
          inverse: "var(--color-text-inverse)",
        },
        bg: {
          DEFAULT: "var(--color-bg)",
          secondary: "var(--color-bg-secondary)",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#D1FAE5",
          dark: "#059669",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#FEE2E2",
          dark: "#DC2626",
        },
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        display: ["36px", { lineHeight: "1.1", fontWeight: "800" }],
        h1: ["28px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["22px", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["14px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.5", fontWeight: "500" }],
      },
      spacing: {
        "4.5": "18px",
        "13": "52px",
        "15": "60px",
        "18": "72px",
        "22": "88px",
        "26": "104px",
        "sidebar": "260px",
      },
      borderRadius: {
        "btn": "10px",
        "card": "12px",
        "panel": "16px",
        "pill": "9999px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        "panel": "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        "overlay": "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        "sidebar": "1px 0 0 0 var(--color-border)",
      },
      animation: {
        "fade-in": "fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up": "slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-left": "slideInLeft 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        "shimmer": "shimmer 2s infinite linear",
        "scale-in": "scaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      maxWidth: {
        "content": "1400px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'var(--color-text-primary)',
            '[class~="lead"]': {
              color: 'var(--color-text-secondary)',
            },
            a: {
              color: 'var(--color-primary)',
              '&:hover': {
                color: 'var(--color-primary-hover)',
              },
            },
            strong: {
              color: 'var(--color-text-primary)',
            },
            'h1, h2, h3, h4': {
              color: 'var(--color-text-primary)',
              fontWeight: '700',
            },
            code: {
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-primary-subtle)',
              borderRadius: '0.25rem',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            blockquote: {
              borderLeftColor: 'var(--color-primary)',
              color: 'var(--color-text-secondary)',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': 'var(--color-text-primary)',
            '--tw-prose-headings': 'var(--color-text-primary)',
            '--tw-prose-lead': 'var(--color-text-secondary)',
            '--tw-prose-links': 'var(--color-primary)',
            '--tw-prose-bold': 'var(--color-text-primary)',
            '--tw-prose-counters': 'var(--color-text-secondary)',
            '--tw-prose-bullets': 'var(--color-text-secondary)',
            '--tw-prose-hr': 'var(--color-border)',
            '--tw-prose-quotes': 'var(--color-text-primary)',
            '--tw-prose-quote-borders': 'var(--color-primary)',
            '--tw-prose-captions': 'var(--color-text-secondary)',
            '--tw-prose-code': 'var(--color-primary)',
            '--tw-prose-pre-code': 'var(--color-text-primary)',
            '--tw-prose-pre-bg': '#1e1e1e',
            '--tw-prose-th-borders': 'var(--color-border)',
            '--tw-prose-td-borders': 'var(--color-border)',
            
            color: 'var(--color-text-primary)',
            'h1, h2, h3, h4': {
              color: 'var(--color-text-primary)',
            },
            strong: {
              color: 'var(--color-text-primary)',
            },
            a: {
              color: 'var(--color-primary)',
              '&:hover': {
                color: 'var(--color-primary-hover)',
              },
            },
            blockquote: {
              borderLeftColor: 'var(--color-primary)',
              color: 'var(--color-text-primary)',
            },
            code: {
              color: 'var(--color-primary)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },

      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
