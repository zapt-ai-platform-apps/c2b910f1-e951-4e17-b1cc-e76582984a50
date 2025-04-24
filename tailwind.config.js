export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#FFF7ED',
                    100: '#FFEDD5',
                    200: '#FED7AA',
                    300: '#FDBA74',
                    400: '#FB923C',
                    500: '#F97316',
                    600: '#EA580C',
                    700: '#C2410C',
                    800: '#9A3412',
                    900: '#7C2D12',
                },
                secondary: {
                    500: '#FACC15',
                    600: '#EAB308',
                    700: '#CA8A04',
                }
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            boxShadow: {
                card: '0 0 25px rgba(0, 0, 0, 0.05)',
                'card-hover': '0 0 35px rgba(0, 0, 0, 0.12)',
            }
        },
    },
    plugins: [],
};