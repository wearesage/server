declare module 'sage-soneium' {
  export class SoneiumClient {
    constructor(network: string, options?: { timeout?: number; enableLogging?: boolean });
    connectWallet(privateKey: string): string;
    sendTransaction(params: { to: string; data: string }): Promise<string>;
    call(params: { to: string; data: string }): Promise<any>;
  }
}