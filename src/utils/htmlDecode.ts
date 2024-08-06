export const htmlDecode = (input: string): string => {
    const e = document.createElement('textarea');
    e.innerHTML = input;
    return e.value;
};
