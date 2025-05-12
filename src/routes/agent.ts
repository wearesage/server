import { Router } from 'express';
import { goatAgentController } from '../controllers/GoatAgentController';
import { verifyToolAuthorization } from '../middleware/toolVerificationMiddleware';

const router = Router();

// Execute tool route with on-chain verification middleware
router.post('/execute-tool', verifyToolAuthorization, goatAgentController.executeTool);

// Get tools metadata route
router.get('/tools-metadata', goatAgentController.getToolsMetadata);

// Get chain info route
router.get('/chain-info', goatAgentController.getChainInfo);

export default router;