import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.GRAPHURL;

const api = axios.create({
    baseURL: endpoint
})

export {
    api
}