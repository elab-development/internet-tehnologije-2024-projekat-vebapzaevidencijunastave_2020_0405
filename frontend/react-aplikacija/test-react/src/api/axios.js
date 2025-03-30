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
            console.log('Dodat token u zahtev:', 'Bearer ' + token.substring(0, 10) + '...');
        } else {
            console.warn('Nema auth_token u localStorage. Zahtev se šalje bez autentikacije.');
        }
        
        // Automatski dodaj XSRF-TOKEN iz kolačića
        let xsrfToken = '';
        if (document.cookie && typeof document.cookie === 'string') {
            const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
            if (match) {
                xsrfToken = decodeURIComponent(match[1]);
                config.headers['X-XSRF-TOKEN'] = xsrfToken;
                console.log('Dodat XSRF token:', xsrfToken.substring(0, 10) + '...');
            } else {
                console.warn('Nije pronađen XSRF-TOKEN u kolačićima.');
            }
        }
        
        return config;
    },
    error => {
        console.error('Greška u axios interceptor-u:', error);
        return Promise.reject(error);
    }
);

// Dodaj interceptor za obradu odgovora
axios.interceptors.response.use(
    response => {
        console.log(`Uspešan odgovor sa ${response.config.url}:`, response.status);
        return response;
    },
    error => {
        if (error.response) {
            console.error(`Greška sa ${error.config?.url}:`, error.response.status, error.response.data);
            
            // Ako je 401 Unauthorized, verovatno je token istekao ili je neispravan
            if (error.response.status === 401) {
                console.error('401 Unauthorized - Token je istekao ili je neispravan.');
                // Mogli biste ovde implementirati automatski logout:
                // localStorage.removeItem('auth_token');
                // localStorage.removeItem('role');
                // window.location.href = '/login';
            }
        } else {
            console.error('Greška bez odgovora:', error);
        }
        return Promise.reject(error);
    }
);

export default axios;
