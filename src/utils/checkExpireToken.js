import { jwtDecode } from 'jwt-decode';

export default function tokenValid(token = {}) {
    const now = Date.now() / 1000;
    const expiry = jwtDecode(token)?.exp;
    return now < expiry;
}
