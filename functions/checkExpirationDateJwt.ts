export default function checkExpirationDateJwt(token: string): boolean {

    if (!token) return true;

    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;

    if (typeof expiry !== 'number') return true;

    const expireDate = expiry * 1000;
    const currentDate = Date.now();

    // if the expiration date is less than the date now return true else false
    if ((currentDate - 1000 * 60 * 2 /* 2 minutes */) >= expireDate) return true;
    else return false;
}