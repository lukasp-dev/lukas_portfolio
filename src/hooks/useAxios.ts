import { useState, useEffect } from "react";
import axios from "axios";

interface BlockResponse {
    data: any; 
}

export const useAxios = (pageId: string) => {
    const [data, setData] = useState<BlockResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const BASE_URL = "https://api.jewook.dev";

    useEffect(() => {
        axios.get(`${BASE_URL}/page/${pageId}/blocks`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [pageId]);

    return { data, loading, error };
};