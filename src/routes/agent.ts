import { Router } from 'express';
import { goatAgentController } from '../controllers/GoatAgentController';
import { verifyToolAuthorization } from '../middleware/toolVerificationMiddleware';

const router = Router();

router.post('/execute-tool', verifyToolAuthorization, goatAgentController.executeTool);
router.get('/tools-metadata', goatAgentController.getToolsMetadata);
router.get('/chain-info', goatAgentController.getChainInfo);

export default router;