/// <reference types="node" />
export declare function encode(input: Buffer | number[] | Uint8Array): String;
export declare function decode(input: String): Buffer;
export declare function isChecksum(input: String): Boolean;

export declare class InvalidCharacterError extends Error {
    code: String
}

export declare class InvalidChecksum extends Error {
    code: String
}
