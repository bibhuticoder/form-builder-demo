/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#525df8',
                    hover: '#4147d1',
                },
                secondary: {
                    DEFAULT: '#F0750A', // cleave-orange
                },
            }
        },
    },
    plugins: [],
}
