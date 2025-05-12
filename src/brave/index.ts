import { PluginBase, type WalletClientBase, type Chain } from "@goat-sdk/core";
import { BraveTools } from "./tools";

export class BravePlugin extends PluginBase<WalletClientBase> {
    constructor() {
      super("BravePlugin", [new BraveTools()]);
    }

    supportsChain = (chain: Chain) => true;
}

export const bravePlugin = () => new BravePlugin();