import { useState, useEffect } from "react";
import axios from "axios";

interface BlockResponse {
    data: any; 
}

export const useAxios = (pageId: string) => {
    const [data, setData] = useState<BlockResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // const BASE_URL = "http://localhost:5001";
    const BASE_URL = "https://notion-server.jewook.com";
    

    useEffect(() => {
        axios.get(`${BASE_URL}/page/${pageId}/blocks`)
            .then((response) => {
                console.log('=== Raw API Response ===');
                console.log('Response status:', response.status);
                console.log('Response data:', JSON.stringify(response.data, null, 2));
                console.log('Response data type:', typeof response.data);
                console.log('Is array?', Array.isArray(response.data));
                if (Array.isArray(response.data) && response.data.length > 0) {
                    console.log('First block structure:', JSON.stringify(response.data[0], null, 2));
                }
                console.log('=======================');
                setData(response.data);
            })
            .catch((error) => {
                console.error('API Error:', error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [pageId]);

    return { data, loading, error };
};