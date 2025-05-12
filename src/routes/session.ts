import { Router, Request, Response } from 'express';
import { SoneiumService } from '../services/SoneiumService';

const router = Router();
const soneiumService = SoneiumService.getInstance();

/**
 * Get session status from on-chain storage
 */
router.get('/status/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!soneiumService.isInitialized) {
      res.status(503).json({
        error: 'Soneium service not initialized',
        onChain: false
      });

      return
    }
    
    if (!address) {
      res.status(400).json({ error: 'Address is required' });
      return
    }
    
    try {
      // Get session from on-chain storage
      const session = await soneiumService.getSession(address);
      
     res.json({
        address,
        onChain: true,
        session,
        contractAddress: process.env.SESSION_CONTRACT_ADDRESS,
        network: process.env.SONEIUM_CHAIN_NAME || 'Soneium Minato',
        chainId: process.env.SONEIUM_CHAIN_ID || '1946'
      });
      return
    } catch (error: any) {
      console.error('Failed to get session from on-chain storage:', error);
      
      res.status(500).json({
        error: 'Failed to get session from on-chain storage',
        message: error.message,
        onChain: false
      });
      return
    }
  } catch (error: any) {
    console.error('Error in session status route:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Verify session against on-chain storage
 */
router.post('/verify', async (req, res) => {
  try {
    const { address, tools } = req.body;
    
    if (!soneiumService.isInitialized) {
     res.status(503).json({
        error: 'Soneium service not initialized',
        onChain: false,
        verified: false
      });
      return
    }
    
    if (!address) {
      res.status(400).json({ error: 'Address is required' });
      return
    }
    
    if (!tools || !Array.isArray(tools)) {
      res.status(400).json({ error: 'Tools array is required' });
      return
    }
    
    try {
      // Verify session against on-chain storage
      const isValid = await soneiumService.verifySession(address, tools);
      
      res.json({
        address,
        onChain: true,
        verified: isValid,
        contractAddress: process.env.SESSION_CONTRACT_ADDRESS,
        network: process.env.SONEIUM_CHAIN_NAME || 'Soneium Minato',
        chainId: process.env.SONEIUM_CHAIN_ID || '1946'
      });
      return
    } catch (error: any) {
      console.error('Failed to verify session against on-chain storage:', error);
      
      res.status(500).json({
        error: 'Failed to verify session against on-chain storage',
        message: error.message,
        onChain: false,
        verified: false
      });
      return
    }
  } catch (error: any) {
    console.error('Error in session verify route:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Revoke session in on-chain storage
 */
router.post('/revoke', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!soneiumService.isInitialized) {
      res.status(503).json({
        error: 'Soneium service not initialized',
        onChain: false,
        revoked: false
      });
      return
    }
    
    if (!address) {
      res.status(400).json({ error: 'Address is required' });
      return
    }
    
    try {
      // Revoke session in on-chain storage
      const txHash = await soneiumService.revokeSession(address);
      
     res.json({
        address,
        onChain: true,
        revoked: true,
        txHash,
        contractAddress: process.env.SESSION_CONTRACT_ADDRESS,
        network: process.env.SONEIUM_CHAIN_NAME || 'Soneium Minato',
        chainId: process.env.SONEIUM_CHAIN_ID || '1946'
      });
      return
    } catch (error: any) {
      console.error('Failed to revoke session in on-chain storage:', error);
      
      res.status(500).json({
        error: 'Failed to revoke session in on-chain storage',
        message: error.message,
        onChain: false,
        revoked: false
      });
      return
    }
  } catch (error: any) {
    console.error('Error in session revoke route:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;