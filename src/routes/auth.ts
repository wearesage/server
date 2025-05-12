import { Router } from 'express';
import { verifySignature, getAddressFromMessage } from '@reown/appkit-siwe';
import { config } from 'dotenv';
import { GoatAgentService } from '../services/GoatAgentService';
import { extractToolsFromSiweMessage} from '../util/siwe';
import { SoneiumService } from '../services/SoneiumService';

config();

const router = Router();
const goatAgentService = GoatAgentService.getInstance();
const soneiumService = SoneiumService.getInstance();

// Initialize Soneium service with private key from environment variables
const initSoneium = async () => {
  try {
    let privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      console.error('PRIVATE_KEY not set in environment variables');
      return;
    }
    
    // Ensure the private key has the 0x prefix
    if (!privateKey.startsWith('0x')) {
      privateKey = `0x${privateKey}`;
    }
    
    await soneiumService.initialize(privateKey);
    
    // Use pre-deployed contract or deploy a new one
    try {
      const contractAddress = await soneiumService.deployContract();
      console.log(`Using session contract at ${contractAddress}`);
    } catch (error) {
      console.error('Failed to set up session contract:', error);
    }
  } catch (error) {
    console.error('Failed to initialize Soneium service:', error);
  }
};

// Initialize Soneium service on startup
initSoneium().catch(console.error);

router.post('/verify-siwe', async (req, res) => {
  try {
    const { message, signature } = req.body;
    const address = getAddressFromMessage(message);
    // Extract tools from the message
    const selectedTools = extractToolsFromSiweMessage(message).map(t => t.name)
    const fullTools = goatAgentService.getToolsMetadata().filter(v => selectedTools.indexOf(v.name) !== -1)
    console.log('Selected tools:', fullTools);
    const isValid = await verifySignature({
      address,
      message,
      signature,
      chainId: `${goatAgentService.getChainInfo().chainId}`,
      projectId: process.env.REOWN_PROJECT_ID as string
    });
    
    if (isValid) {
      const session: any= {
        address,
        tools: fullTools,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      // Store this session on-chain using Soneium
      try {
        if (soneiumService.isInitialized) {
          console.log(`Storing session for ${address} on-chain...`);
          
          // Register session on-chain
          const txHash = await soneiumService.registerSession(
            address,
            fullTools.map(tool => tool.name),
            24 * 60 * 60 // 24 hours in seconds
          );
          
          console.log(`Session stored on-chain. Transaction hash: ${txHash}`);
          
          // Add transaction hash to session
          session.txHash = txHash;
          
          // Add on-chain verification info to the session
          session.onChain = {
            contractAddress: process.env.SESSION_CONTRACT_ADDRESS || 'pending',
            network: process.env.SONEIUM_CHAIN_NAME || 'Soneium Minato',
            chainId: process.env.SONEIUM_CHAIN_ID || '1946'
          };
        } else {
          console.warn('Soneium service not initialized. Session not stored on-chain.');
        }
      } catch (error) {
        console.error('Failed to store session on-chain:', error);
        // Continue even if on-chain storage fails
      }
      
      res.json(session);
    } else {
      res.status(401).json({ error: 'Invalid signature' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router