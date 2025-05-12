import { Router } from 'express';
import { akashController } from '../controllers/AkashController';

const router = Router();

// Provider routes
router.get('/providers', akashController.getProviders);
router.get('/providers/:address', akashController.getProvider);
router.get('/providers/:provider/deployments', akashController.getProviderDeployments);

// Network capacity route
router.get('/network-capacity', akashController.getNetworkCapacity);

// Address deployments route
router.get('/addresses/:address/deployments', akashController.getAddressDeployments);

// Template routes
router.get('/templates', akashController.getTemplates);
router.get('/templates/:id', akashController.getTemplate);

// GPU routes
router.get('/gpu-prices', akashController.getGpuPrices);

// Price estimation route
router.post('/pricing', akashController.estimatePrice);

export default router;