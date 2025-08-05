import crypto from "crypto";
import { z } from "zod";

// PII Encryption Service
// Production-ready encryption for sensitive data using AES-256-GCM
// Implements key rotation, secure key derivation, and tamper detection

interface EncryptionOptions {
  keyId?: string;
  additionalData?: string;
}

interface EncryptedData {
  keyId: string;
  iv: string;
  authTag: string;
  encryptedData: string;
  additionalData?: string;
}

interface EncryptionKey {
  id: string;
  key: Buffer;
  created: Date;
  active: boolean;
}

class PIIEncryptionService {
  private keys: Map<string, EncryptionKey> = new Map();
  private activeKeyId: string | null = null;

  constructor() {
    this.initializeKeys();
  }

  private initializeKeys(): void {
    // Get master key from environment or generate for development
    const masterKey = this.getMasterKey();

    // Create initial encryption key
    const keyId = this.generateKeyId();
    const key = this.deriveKey(masterKey, keyId);

    this.keys.set(keyId, {
      id: keyId,
      key: key,
      created: new Date(),
      active: true,
    });

    this.activeKeyId = keyId;
  }

  private getMasterKey(): Buffer {
    const masterKeyHex = process.env.ENCRYPTION_MASTER_KEY;

    if (!masterKeyHex) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("ENCRYPTION_MASTER_KEY must be set in production");
      }

      // Generate a random key for development
      console.warn(
        "🚨 Using generated encryption key for development - DO NOT USE IN PRODUCTION",
      );
      return crypto.randomBytes(32);
    }

    return Buffer.from(masterKeyHex, "hex");
  }

  private generateKeyId(): string {
    return crypto.randomUUID();
  }

  private deriveKey(masterKey: Buffer, keyId: string): Buffer {
    // Use PBKDF2 to derive encryption key from master key + keyId
    return crypto.pbkdf2Sync(masterKey, keyId, 100000, 32, "sha256");
  }

  /**
   * Encrypt sensitive PII data
   */
  public encrypt(plaintext: string, options: EncryptionOptions = {}): string {
    if (!plaintext) {
      throw new Error("Cannot encrypt empty data");
    }

    const keyId = options.keyId || this.activeKeyId;
    if (!keyId) {
      throw new Error("No active encryption key available");
    }

    const key = this.keys.get(keyId);
    if (!key) {
      throw new Error(`Encryption key ${keyId} not found`);
    }

    const iv = crypto.randomBytes(12); // 96-bit IV for GCM
    const cipher = crypto.createCipherGCM("aes-256-gcm", key.key);
    cipher.setIVNoLengthCheck(iv);

    // Add additional authenticated data if provided
    if (options.additionalData) {
      cipher.setAAD(Buffer.from(options.additionalData, "utf8"));
    }

    let encrypted = cipher.update(plaintext, "utf8", "base64");
    encrypted += cipher.final("base64");

    const authTag = cipher.getAuthTag();

    const encryptedData: EncryptedData = {
      keyId: keyId,
      iv: iv.toString("base64"),
      authTag: authTag.toString("base64"),
      encryptedData: encrypted,
      additionalData: options.additionalData,
    };

    return Buffer.from(JSON.stringify(encryptedData)).toString("base64");
  }

  /**
   * Decrypt sensitive PII data
   */
  public decrypt(encryptedPayload: string): string {
    if (!encryptedPayload) {
      throw new Error("Cannot decrypt empty data");
    }

    let encryptedData: EncryptedData;
    try {
      const jsonString = Buffer.from(encryptedPayload, "base64").toString(
        "utf8",
      );
      encryptedData = JSON.parse(jsonString);
    } catch (error) {
      throw new Error("Invalid encrypted data format");
    }

    const key = this.keys.get(encryptedData.keyId);
    if (!key) {
      throw new Error(`Decryption key ${encryptedData.keyId} not found`);
    }

    const iv = Buffer.from(encryptedData.iv, "base64");
    const authTag = Buffer.from(encryptedData.authTag, "base64");

    const decipher = crypto.createDecipherGCM("aes-256-gcm", key.key);
    decipher.setIVNoLengthCheck(iv);
    decipher.setAuthTag(authTag);

    // Set additional authenticated data if it was used during encryption
    if (encryptedData.additionalData) {
      decipher.setAAD(Buffer.from(encryptedData.additionalData, "utf8"));
    }

    try {
      let decrypted = decipher.update(
        encryptedData.encryptedData,
        "base64",
        "utf8",
      );
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch (error) {
      throw new Error(
        "Failed to decrypt data - data may be corrupted or tampered with",
      );
    }
  }

  /**
   * Generate a new encryption key and rotate keys
   */
  public rotateKeys(): string {
    const masterKey = this.getMasterKey();
    const newKeyId = this.generateKeyId();
    const newKey = this.deriveKey(masterKey, newKeyId);

    // Mark old keys as inactive
    this.keys.forEach((key) => {
      key.active = false;
    });

    // Add new active key
    this.keys.set(newKeyId, {
      id: newKeyId,
      key: newKey,
      created: new Date(),
      active: true,
    });

    this.activeKeyId = newKeyId;

    console.log(`🔑 Encryption key rotated to ${newKeyId}`);
    return newKeyId;
  }

  /**
   * Get list of all encryption keys (for key management)
   */
  public getKeyInfo(): Array<{ id: string; created: Date; active: boolean }> {
    return Array.from(this.keys.values()).map((key) => ({
      id: key.id,
      created: key.created,
      active: key.active,
    }));
  }

  /**
   * Hash sensitive data for searching (one-way)
   */
  public hash(data: string, salt?: string): string {
    const saltBuffer = salt
      ? Buffer.from(salt, "utf8")
      : crypto.randomBytes(16);
    const hash = crypto.pbkdf2Sync(data, saltBuffer, 10000, 32, "sha256");
    return salt
      ? hash.toString("hex")
      : saltBuffer.toString("hex") + ":" + hash.toString("hex");
  }

  /**
   * Verify hashed data
   */
  public verifyHash(data: string, hashedData: string): boolean {
    const [salt, hash] = hashedData.split(":");
    if (!salt || !hash) {
      return false;
    }

    const computedHash = this.hash(data, salt);
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(computedHash, "hex"),
    );
  }
}

// PII Data Schemas for validation
export const PIISchemas = {
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format"),
  ssn: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, "Invalid SSN format"),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  address: z.object({
    street: z.string().min(1, "Street address required"),
    city: z.string().min(1, "City required"),
    state: z.string().length(2, "State must be 2 characters"),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  }),
};

// Masked Display Functions
export class PIIMasking {
  /**
   * Mask phone number: (555) 123-4567 -> (***) ***-4567
   */
  static phoneNumber(phone: string): string {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(***) ***-${cleaned.slice(-4)}`;
    } else if (cleaned.length === 11) {
      return `+* (***) ***-${cleaned.slice(-4)}`;
    }
    return `***-***-${cleaned.slice(-4)}`;
  }

  /**
   * Mask SSN: 123-45-6789 -> ***-**-6789
   */
  static ssn(ssn: string): string {
    if (!ssn) return "";
    const cleaned = ssn.replace(/\D/g, "");
    if (cleaned.length === 9) {
      return `***-**-${cleaned.slice(-4)}`;
    }
    return "***-**-****";
  }

  /**
   * Mask email: john.doe@example.com -> j***e@example.com
   */
  static email(email: string): string {
    if (!email || !email.includes("@")) return "";
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
      return `${localPart}****@${domain}`;
    }
    return `${localPart[0]}***${localPart.slice(-1)}@${domain}`;
  }

  /**
   * Mask address: 123 Main St -> *** Main St
   */
  static address(address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }): {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  } {
    return {
      street: address.street
        ? `*** ${address.street.split(" ").slice(1).join(" ")}`
        : "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode ? `***${address.zipCode.slice(-2)}` : "",
    };
  }

  /**
   * Mask date of birth: 1990-05-15 -> ****-**-15
   */
  static dateOfBirth(dob: string): string {
    if (!dob) return "";
    const parts = dob.split("-");
    if (parts.length === 3) {
      return `****-**-${parts[2]}`;
    }
    return "****-**-**";
  }

  /**
   * Mask account number: 1234567890 -> ******7890
   */
  static accountNumber(accountNumber: string): string {
    if (!accountNumber) return "";
    if (accountNumber.length <= 4) {
      return accountNumber;
    }
    return "*".repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  }

  /**
   * Mask card number: 4111111111111111 -> ****-****-****-1111
   */
  static cardNumber(cardNumber: string): string {
    if (!cardNumber) return "";
    const cleaned = cardNumber.replace(/\D/g, "");
    if (cleaned.length === 16) {
      return `****-****-****-${cleaned.slice(-4)}`;
    } else if (cleaned.length === 15) {
      return `****-******-*${cleaned.slice(-4)}`;
    }
    return `****-****-****-${cleaned.slice(-4)}`;
  }
}

// Singleton instance
let encryptionService: PIIEncryptionService | null = null;

export function getEncryptionService(): PIIEncryptionService {
  if (!encryptionService) {
    encryptionService = new PIIEncryptionService();
  }
  return encryptionService;
}

export { PIIEncryptionService };
