import jwtDecode from 'jwt-decode';

export const endpoint = 'http://localhost:8000/api/v1/';

export const api = key => `${endpoint}${key}/`;

export const toFaramError = (errors) => {
    const {
        nonFieldErrors = [],
        internalNonFieldErrors,
        ...formFieldErrors
    } = errors;

    console.error('SERVER ERROR:', internalNonFieldErrors);

    return Object.keys(formFieldErrors).reduce(
        (acc, key) => {
            const error = formFieldErrors[key];
            acc[key] = Array.isArray(error) ? error.join(' ') : error;
            return acc;
        },
        {
            $internal: nonFieldErrors,
        },
    );
};

export const decodeAccessToken = (access) => {
    const decodedToken = jwtDecode(access);
    try {
        return {
            userId: decodedToken.userId,
            exp: decodedToken.exp,
        };
    } catch (ex) {
        console.warn(ex);
        return {};
    }
};
