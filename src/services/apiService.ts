import axios from 'axios';

const API_URL = 'https://your-api-endpoint.com';

export const sendArrayToEndpoint = async (data: any[]): Promise<void> => {
    try {
        const response = await axios.post(`${API_URL}/your-endpoint`, data);
        console.log('Data sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending data:', error);
        throw error;
    }
};

export {};