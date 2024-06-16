export interface IEncrypt {
  encrypt(value: string, salt: number): string;
  compare(value: string, hash: string): boolean;
}
