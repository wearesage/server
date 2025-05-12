import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { soneiumMinato } from "viem/chains";
import { http } from "viem";
import { viem } from "@goat-sdk/wallet-viem";
import {zodToJsonSchema} from 'zod-to-json-schema'
import { getTools } from '@goat-sdk/core';
import { bravePlugin } from '../brave';

export class GoatAgentService {
  private walletClient: any;
  private goatWallet: any;
  private plugins: any[];
  private tools: any[] = [];
  private static instance: GoatAgentService;

  constructor() {
    this.initializeWallet();
  }

  public static getInstance(): GoatAgentService {
    if (!GoatAgentService.instance) {
      GoatAgentService.instance = new GoatAgentService();
    }
    return GoatAgentService.instance;
  }

  private initializeWallet() {
    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

    this.walletClient = createWalletClient({
      account,
      transport: http(
        process.env.SONEIUM_TEST_HTTPS || "https://rpc.minato.soneium.org"
      ),
      chain: soneiumMinato,
    });

    this.goatWallet = viem(this.walletClient);
  }

  async initializePlugins() {
    console.log(
      `Initializing plugins for chain ${soneiumMinato.name} (ID: ${soneiumMinato.id})`
    );

    this.plugins = [
      bravePlugin()
      // soneiumPlugin()
    ];
    
    this.tools = await getTools({
      wallet: this.goatWallet,
      plugins: this.plugins
    })

    this.tools.forEach((tool: any) => {
      tool.params = (zodToJsonSchema as any)(tool.parameters).properties
      tool.required = (zodToJsonSchema as any)(tool.parameters).required
    })

    console.log(this.tools)
  }

  async executeTool(toolName: string, params: any) {
    return this.tools.find(t => t.name === toolName).execute(params);
  }

  getToolsMetadata() {
    return this.tools.map(v => ({ name: v.name, description: v.description, params: v.params, required: v.required } ))
  }

  getChainInfo() {
    return {
      chainId: soneiumMinato.id,
      name: soneiumMinato.name,
      rpcUrl:
        process.env.SONEIUM_TEST_HTTPS || "https://rpc.minato.soneium.org",
      agentAddress: this.walletClient.account.address,
    };
  }
}
