
export function isEmailValid(email: string) {
    const regexValidation = /\S+@\S+\.\S+/;
    return regexValidation.test(email);
}