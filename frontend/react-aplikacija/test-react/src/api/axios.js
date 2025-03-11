import axios from 'axios';

// Postavi osnovni URL za Laravel backend
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true; // Omogućava slanje kolačića za CSRF zaštitu
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Funkcija za dobijanje CSRF kolačića
export const getCsrfToken = async () => {
    try {
        await axios.get('/sanctum/csrf-cookie');
        console.log('CSRF token dobijen uspešno');
    } catch (error) {
        console.error('Greška pri dobijanju CSRF tokena:', error);
        throw error;
    }
};

// Dodaj interceptor za dodavanje tokena autentikacije
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Automatski dodaj XSRF-TOKEN iz kolačića
        let xsrfToken = '';
        if (document.cookie && typeof document.cookie === 'string') {
            const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
            if (match) {
                xsrfToken = decodeURIComponent(match[1]);
                config.headers['X-XSRF-TOKEN'] = xsrfToken;
            }
        }
        
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axios;
