import * as crypto from 'crypto';

export class HashUtil {
  static hashSensitiveData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
