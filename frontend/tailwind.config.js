/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}', // <--- 這行很重要
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
