import axios from "axios";
import dotenv from 'dotenv';
import { api } from "../api.js";

dotenv.config();
/** 
 * Adicionar tratativa para gerar o token 
 *   - No contexto atual, possuo outro endpoint que gera esse token
*/

const cache = new Map();

const cacheExpirationTime = 20 * 60 * 1000; // 20 minutes

const endpointToken = process.env.TOKENURL;

function getCachedData(key) {
    const cachedData = cache.get(key);
    if (cachedData && cachedData.expires > Date.now()) {
      // Data is still valid, return the cached data
      return cachedData.data;
    } else {
      // Data has expired, remove it from the cache
      cache.delete(key);
      return null;
    }
}

async function middleware(req, res, next) {
    if(!endpointToken) {
        return res.status(400).send('Endpoint não definido');
    }

    let token = getCachedData("token");
    
    if (!token) {
        try {
            const response = await axios.get(endpointToken);
            const tokenAux = response.data;

            if (tokenAux) {
                cache.set("token", { data: tokenAux, expires: Date.now() + cacheExpirationTime });
                token = tokenAux;
            }
        } catch (error) {
            console.error('Erro ao buscar o token:', error);
            
            return res.status(500).send('Erro ao autenticar');
        }
    }    

    api.interceptors.request.use(function (config) {
        config.headers.Authorization =  token;
         
        return config;
    });

    next();
}

export {
    middleware
}