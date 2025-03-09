import axios from 'axios';

// Postavi osnovni URL za Laravel backend
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true; // Omogućava slanje kolačića za CSRF zaštitu

// Dodaj interceptor za dodavanje tokena
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Funkcija za dobijanje CSRF kolačića
export const getCsrfToken = async () => {
    await axios.get('/sanctum/csrf-cookie');
};

export default axios;
