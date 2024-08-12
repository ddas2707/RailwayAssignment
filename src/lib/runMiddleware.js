// lib/runMiddleware.js
import { promisify } from 'util';

export function runMiddleware(req, res, fn) {
    return promisify(fn)(req, res);
}
