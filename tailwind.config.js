/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        userBg: "var(--userBg)",
        Primary: "var(--Primary)",
        Secondary: "var(--Secondary)",
        Secondary2: "var(--Secondary2)",
        Secondary3: "var(--Secondary3)",
        ButtonBg: 'var(--ButtonBg)',
        gradient: "var(--gradient)",
        gradient2: "var(--gradient2)",
        textBoxBg: "var(--textBoxBg)",
        textBoxBg2: "var(--textBoxBg2)",
        background: "var-(--background)",
        background2: 'var(--background2)',
        background3: 'var(--background3)',
        background4: 'var(--background4)',
        background5: 'var(--background5)',
        background6: 'var(--background6)',
        background7: 'var(--background7)',
        background8: 'var(--background8)',
        background9: 'var(--background9)',
        background10: 'var(--background10)',
        accentColor: "var(--accent-Color)",
        borderColor: "var(--border-Color)",
        borderColor2: "var(--border-Color2)",
        borderColor3: "var(--border-Color3)",
        borderColor4: "var(--border-Color4)",
        borderColor5: "var(--border-Color5)",
        borderColor6: "var(--border-Color6)",
        borderColor7: "var(--border-Color7)",
        TextColorbackground: "var(--TextColorbackground)",
      },
      borderColor: {
        custom: "var(--border-Color)", // Extend Tailwind border color
        custom: "var(--border-Color2)", // Extend Tailwind border color
        custom: "var(--border-Color3)", // Extend Tailwind border color
        custom: "var(--border-Color4)",
        custom: "var(--border-Color5)",
        custom: "var(--border-Color6)",
        custom: "var(--border-Color7)",
      },
      backgroundImage: {
        'userBg': 'var(--userBg)',
        'ButtonBg': 'var(--ButtonBg)',
        'gradient': 'var(--gradient)',
        'gradient2': 'var(--gradient2)',
        'textBoxBg': 'var(--textBoxBg)',
        'textBoxBg2': 'var(--textBoxBg2)',
        'background2': 'var(--background2)',
        'background3': 'var(--background3)',
        'background4': 'var(--background4)',
        'background5': 'var(--background5)',
        'background6': 'var(--background6)',
        'background7': 'var(--background7)',
        'background8': 'var(--background8)',
        'background9': 'var(--background9)',
        'background10': 'var(--background10)',
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.accent-color': {
          'accent-color': 'var(--accent-Color)',
        }
      });
    }
  ],
}