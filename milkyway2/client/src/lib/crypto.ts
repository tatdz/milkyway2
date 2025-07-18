// Crypto utilities for validator messaging
// This is a simplified implementation for demonstration purposes
// In production, use proper cryptographic libraries

export interface CryptoKeys {
  symmetricKey: string;
  signingPrivateKey: string;
  signingPublicKey: string;
}

export async function generateKeys(): Promise<CryptoKeys> {
  // Generate 32-byte symmetric key for AES-256
  const symmetricKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Generate Ed25519 signing keys (simplified - would use actual crypto lib)
  const signingPrivateKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const signingPublicKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    symmetricKey,
    signingPrivateKey,
    signingPublicKey
  };
}

export async function encryptMessage(message: string, symmetricKey: string): Promise<string> {
  // Convert hex key to bytes
  const keyBytes = new Uint8Array(symmetricKey.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Import key for AES-GCM
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    'AES-GCM',
    false,
    ['encrypt']
  );
  
  // Encrypt the message
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoder.encode(message)
  );
  
  // Combine IV and ciphertext
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  // Return as hex string
  return Array.from(combined)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function decryptMessage(ciphertext: string, symmetricKey: string): Promise<string> {
  try {
    // Convert hex strings to bytes
    const keyBytes = new Uint8Array(symmetricKey.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    const ciphertextBytes = new Uint8Array(ciphertext.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    
    // Extract IV and encrypted data
    const iv = ciphertextBytes.slice(0, 12);
    const encrypted = ciphertextBytes.slice(12);
    
    // Import key for AES-GCM
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      'AES-GCM',
      false,
      ['decrypt']
    );
    
    // Decrypt the message
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );
    
    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '[Decryption failed]';
  }
}

export async function signMessage(message: string, privateKey: string): Promise<string> {
  // Simplified signing - in production use actual Ed25519 implementation
  // This creates a mock signature for demonstration
  const encoder = new TextEncoder();
  const messageBytes = encoder.encode(message + privateKey);
  const hash = await crypto.subtle.digest('SHA-256', messageBytes);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifySignature(message: string, signature: string, publicKey: string): Promise<boolean> {
  // Simplified verification - in production use actual Ed25519 implementation
  try {
    // This is a mock verification for demonstration
    return signature.length === 64 && publicKey.length === 64;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

export function exportKeys(keys: CryptoKeys): string {
  return JSON.stringify(keys, null, 2);
}

export function importKeys(keysJson: string): CryptoKeys {
  return JSON.parse(keysJson);
}