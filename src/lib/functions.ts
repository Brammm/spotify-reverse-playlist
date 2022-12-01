function dec2hex(dec: number) {
    return ('0' + dec.toString(16)).substring(-2);
}

function base64urlEncode(a: ArrayBuffer) {
    let str = '';
    const bytes = new Uint8Array(a);
    for (var i = 0; i < bytes.byteLength; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export function generateCodeVerifier() {
    var array = new Uint32Array(8);

    window.crypto.getRandomValues(array);
    return Array.from(array, dec2hex).join('');
}

function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

export async function generateCodeChallengeFromVerifier(v: string) {
    var hashed = await sha256(v);
    return base64urlEncode(hashed);
}
