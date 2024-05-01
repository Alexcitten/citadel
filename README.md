# Citadel Encryption

## Introduction
Citadel Encryption is a symmetric encryption algorithm designed to provide robust resistance against cryptanalysis. It leverages a combination of cryptographic techniques and diffusion mechanisms to ensure both the confidentiality and integrity of the encrypted data.

## Code Overview
### `CustomCipher` Class
The `CustomCipher` class serves as the backbone of the Citadel Encryption algorithm. It encompasses several crucial methods:

- `generateHash(key)`: Generates a hashed key by incorporating the provided key and a randomly generated salt.
- `generateSalt()`: Produces a random salt utilized in key derivation.
- `hashFunc(input)`: Applies a bespoke hash function to the input data.
- `encrypt(message)`: Encrypts a message utilizing the generated hashed key.
- `decrypt(encryptedMessage)`: Decrypts an encrypted message utilizing the generated hashed key.
- `transformBlock(block)`: Applies a diffusion mechanism to a block of data during encryption.
- `inverseTransformBlock(block)`: Reverses the diffusion mechanism applied during encryption.

### Encryption Process
1. **Key Derivation**: The provided key undergoes hashing alongside a randomly generated salt to yield a secure hashed key.
2. **Encryption**: The message undergoes conversion to a binary representation, and each bit is XORed with the corresponding bit from the hashed key to introduce diffusion.
3. **Diffusion Mechanism**: During encryption, each block of data is subjected to a diffusion mechanism based on adjacent key bits.
4. **Decryption**: The encrypted message is decrypted by XORing each bit with the corresponding bit from the hashed key.
5. **Inverse Diffusion Mechanism**: During decryption, the diffusion mechanism applied during encryption is reversed.

### Operations
- **Modular Exponentiation**: The `modularExponentiation()` function performs modular exponentiation, an essential operation for ensuring computational efficiency and preventing overflow during cryptographic operations.
- **Matrix Multiplication**: The `matrixMultiplication()` function is employed to perform matrix multiplication, facilitating certain diffusion mechanisms within the encryption process.

## Usage Example
```javascript
const cipher = new CustomCipher('SecretKey');
const message = 'Meow';
const encryptedMessage = cipher.encrypt(message);
console.log('Encrypted:', encryptedMessage);
console.log('Decrypted:', cipher.decrypt(encryptedMessage));
```

## Disclaimer
While Citadel Encryption endeavors to provide robust security assurances, it's essential to acknowledge that no encryption algorithm is entirely impervious to attacks. Stay informed about the latest cryptographic advancements and adhere to best practices to uphold the security of your encrypted data.

I'm not an expert in this, and I created this project just for the sake of practical experience. I understand that there may be better approaches to implementation, code improvements, other cryptographic principles that would be better, so I am completely open to constructive criticism.
