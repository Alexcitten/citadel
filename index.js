function CustomCipher(key) {
    if (typeof key !== 'string' || key.length === 0) {
        throw new Error('Invalid key. Key must be a non-empty string.');
    }

    this.key = key;
    this.saltSize = 16;
    this.iterations = 20000;
    this.hashedKey = this.generateHash(key);
}

CustomCipher.prototype.generateHash = function (key) {
    const salt = this.generateSalt();
    const hashSize = 128;

    let hashedKey = key + salt;

    for (let i = 0; i < this.iterations; i++) {
        hashedKey = this.hashFunc(hashedKey);
    }

    hashedKey = String(hashedKey);

    return hashedKey.slice(0, hashSize);
};

CustomCipher.prototype.generateSalt = function () {
    let salt = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < this.saltSize; i++) {
        salt += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return salt;
};

CustomCipher.prototype.hashFunc = function (input) {
    input = input.toString();

    const prime1 = 9941;
    const prime2 = 9967; 
    const prime3 = 9973;

    let result = 0;
    for (let i = 0; i < input.length; i++) {
        result = (result * 37 + input.charCodeAt(i)) % (prime1 * prime2 * prime3);
    }

    result = modularExponentiation(result, prime1, prime2 * prime3);

    result ^= prime1 ^ prime2 ^ prime3; // XOR

    const matrix = [
        [2, 3, 5], 
        [7, 11, 13],
        [17, 19, 23]
    ];
    const matrixResult = matrixMultiplication(matrix, [result]);

    return matrixResult;
};

CustomCipher.prototype.encrypt = function (message) {
    const binaryMessage = stringToBinary(message);
    let encryptedMessage = '';

    for (let i = 0; i < binaryMessage.length; i++) {
        const bit = parseInt(binaryMessage[i]);
        const keyBit = parseInt(this.hashedKey.charCodeAt(i % this.hashedKey.length)).toString(2).padStart(8, '0');

        // Introduce diffusion by XORing each bit with the corresponding key bit
        const diffusedBit = (bit ^ parseInt(keyBit, 2)) % 2;

        encryptedMessage += diffusedBit;
    }

    return encryptedMessage;
};

CustomCipher.prototype.decrypt = function (encryptedMessage) {
    let decryptedMessage = '';

    for (let i = 0; i < encryptedMessage.length; i++) {
        const bit = parseInt(encryptedMessage[i]);
        const keyBit = parseInt(this.hashedKey.charCodeAt(i % this.hashedKey.length)).toString(2).padStart(8, '0');

        const diffusedBit = (bit ^ parseInt(keyBit, 2)) % 2;

        decryptedMessage += diffusedBit;
    }

    return binaryToString(decryptedMessage);
};

function stringToBinary(str) {
    return str.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
}

function binaryToString(binary) {
    return binary.match(/.{8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
}

CustomCipher.prototype.transformBlock = function (block) {
    let transformedBlock = '';

    for (let i = 0; i < block.length; i++) {
        const blockBit = parseInt(block[i]);
        const keyCharCode = this.hashedKey.charCodeAt(i % this.hashedKey.length);
        const keyBit = keyCharCode.toString(2).padStart(8, '0');

        // Introduce diffusion by XORing each block bit with the adjacent bits in the key
        const adjacentKeyBits = keyBit.charAt((i === 0 ? keyBit.length - 1 : i - 1) % keyBit.length) +
                                keyBit.charAt(i) +
                                keyBit.charAt((i + 1) % keyBit.length);
        const diffusedBit = (blockBit ^ parseInt(adjacentKeyBits, 2)) % 2; // Use XOR (^) instead of addition

        transformedBlock += diffusedBit;
    }

    return transformedBlock;
};

CustomCipher.prototype.inverseTransformBlock = function (block) {
    let transformedBlock = '';

    for (let i = 0; i < block.length; i++) {
        const blockBit = parseInt(block[i]);
        const keyCharCode = this.hashedKey.charCodeAt(i % this.hashedKey.length);
        const keyBit = keyCharCode.toString(2).padStart(8, '0');

        const adjacentKeyBits = keyBit.charAt((i === 0 ? keyBit.length - 1 : i - 1) % keyBit.length) +
                                keyBit.charAt(i) +
                                keyBit.charAt((i + 1) % keyBit.length);

        // Reverse the diffusion process by XORing
        const diffusedBit = (blockBit ^ parseInt(adjacentKeyBits, 2)) % 2; // Use XOR (^) instead of subtraction

        transformedBlock += diffusedBit;
    }

    return transformedBlock;
};


// Modular exponentiation function
function modularExponentiation(base, exponent, modulus) {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = exponent >> 1;
        base = (base * base) % modulus;
    }
    return result;
}

// Matrix multiplication function
function matrixMultiplication(matrix, value) {
    const result = [];
    for (let i = 0; i < matrix.length; i++) {
        let rowSum = 0;
        for (let j = 0; j < matrix[i].length; j++) {
            rowSum += matrix[i][j] * value[j];
        }
        result.push(rowSum);
    }
    return result;
}

const cipher = new CustomCipher('SecretKey');
const message = 'Hello World!';
const encryptedMessage = cipher.encrypt(message);
console.log('Encrypted:', encryptedMessage);
console.log('Decrypted:', cipher.decrypt(encryptedMessage));
