import axios from 'axios';

const API_URL = 'https://your-api-endpoint.com';

export const getInitialData = async (data: any[]): Promise<void> => {
    try {
        const response = await axios.get(`${API_URL}/your-endpoint`);
        console.log('Data sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending data:', error);
        throw error;
    }
};

export {};