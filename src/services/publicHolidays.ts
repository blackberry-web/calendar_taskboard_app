import axios from 'axios';
import { Holiday } from '../types/types';

export const getPublicHolidays = async (year: number, countryCode: string): Promise<Holiday[]> => {
    const response = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)
        .then((response) => response.data)
        .then((data) => data.map((el: Holiday) => ({date: el.date, name: el.name})))
        .catch((error) => {
            throw new Error(error);
        })
    
    return response;
}