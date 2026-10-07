import { urlconstant } from './constants';

export const ALLOCATION_CONTRACT_VERSION = '2.0.0' as const;

export type AllocationStrategy =
  | 'EQUAL_WEIGHT'
  | 'INVERSE_VOLATILITY'
  | 'GLOBAL_MINIMUM_VARIANCE'
  | 'EQUAL_RISK_CONTRIBUTION'
  | 'RISK_BUDGETING'
  | 'MAXIMUM_DIVERSIFICATION'
  | 'MAXIMUM_SHARPE'
  | 'MEAN_VARIANCE'
  | 'MINIMUM_CORRELATION'
  | 'MINIMUM_TRACKING_ERROR';

export type AllocationHorizon = '1Y' | '3Y' | '5Y' | 'MAX' | 'CUSTOM';
export type AllocationFrequency = 'AUTO' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type AllocationReturnMethod = 'TOTAL_RETURN' | 'NAV';

export interface AllocationRange {
  min?: number | null;
  max?: number | null;
}

export interface AllocationRequestV2Input {
  schema_version?: typeof ALLOCATION_CONTRACT_VERSION;
  universe: {
    fund_ids: number[];
    base_currency?: string;
  };
  data?: {
    horizon?: AllocationHorizon;
    frequency?: AllocationFrequency;
    return_method?: AllocationReturnMethod;
    date_from?: string | null;
    date_to?: string | null;
  };
  objective?: {
    strategy?: AllocationStrategy;
  };
  targets?: {
    min_return?: number | null;
    max_return?: number | null;
    min_volatility?: number | null;
    max_volatility?: number | null;
  };
  constraints?: {
    fund_count?: AllocationRange | null;
    fund_weight?: AllocationRange | null;
    categories?: Record<string, AllocationRange>;
    srri?: AllocationRange | null;
    currencies?: Record<string, AllocationRange>;
  };
  output?: {
    frontier_points?: number;
  };
  simulation_id?: number | null;
}

export interface AllocationNormalizedRequestV2 {
  schema_version: typeof ALLOCATION_CONTRACT_VERSION;
  units: {
    return: 'DECIMAL';
    volatility: 'DECIMAL';
    weight: 'DECIMAL';
  };
  universe: {
    fund_ids: number[];
    base_currency: string;
  };
  data: {
    horizon: AllocationHorizon;
    frequency: AllocationFrequency;
    return_method: AllocationReturnMethod;
    date_from: string | null;
    date_to: string | null;
  };
  objective: {
    strategy: AllocationStrategy;
  };
  targets: {
    min_return: number | null;
    max_return: number | null;
    min_volatility: number | null;
    max_volatility: number | null;
  };
  constraints: {
    fund_count: AllocationRange | null;
    fund_weight: AllocationRange | null;
    categories: Record<string, AllocationRange>;
    srri: AllocationRange | null;
    currencies: Record<string, AllocationRange>;
  };
  output: {
    frontier_points: number;
  };
  simulation_id: number | null;
}

export interface AllocationContractWarning {
  code: string;
  message: string;
}

export interface AllocationCapabilities {
  schema_version: typeof ALLOCATION_CONTRACT_VERSION;
  optimization_enabled: boolean;
  status: string;
  units: {
    return: 'DECIMAL';
    volatility: 'DECIMAL';
    weight: 'DECIMAL';
  };
  strategies: AllocationStrategy[];
  horizons: AllocationHorizon[];
  frequencies: AllocationFrequency[];
  return_methods: AllocationReturnMethod[];
  ownership: 'JWT_USER_ID_ONLY';
  legacy_payload_adapter: boolean;
}

export interface AllocationValidationData {
  owner_user_id: number;
  source_format: 'CANONICAL_V2' | 'LEGACY_FRONTEND';
  warnings: AllocationContractWarning[];
  request: AllocationNormalizedRequestV2;
}

export interface AllocationSimulation {
  id: number;
  nom: string;
  description: string | null;
}

export interface AllocationSimulationPortfolio {
  id?: number;
  nom?: string;
  fond_ids?: string | number[];
  poids?: string;
  weights?: number[];
  portefeuille_id?: number | null;
  simulation_id?: number;
}

export interface AllocationPortfolioCreateInput {
  name: string;
  fund_ids: number[];
  weights: number[];
}

interface ApiEnvelope<T> {
  code: number;
  data: T;
}

export class AllocationApiError extends Error {
  status: number;
  code: string | null;
  details: unknown;

  constructor(message: string, status: number, code: string | null, details?: unknown) {
    super(message);
    this.name = 'AllocationApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function getAllocationToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('tokenEnCours');
}

async function allocationFetch<T>(
  path: string,
  init: RequestInit = {},
  options: { authenticated?: boolean } = {}
): Promise<T> {
  const authenticated = options.authenticated !== false;
  const headers = new Headers(init.headers || {});

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (authenticated) {
    const token = getAllocationToken();
    if (!token) {
      throw new AllocationApiError(
        'Authentification requise pour cette operation allocation.',
        401,
        'AUTHENTICATION_REQUIRED'
      );
    }
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${urlconstant}${path}`, {
    ...init,
    headers,
  });

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new AllocationApiError(
      payload?.message || payload?.error || `Erreur allocation HTTP ${response.status}`,
      response.status,
      payload?.error || null,
      payload?.details
    );
  }

  return payload as T;
}

export async function getAllocationCapabilities(): Promise<AllocationCapabilities> {
  const response = await allocationFetch<ApiEnvelope<AllocationCapabilities>>(
    '/api/allocation/capabilities',
    { method: 'GET' },
    { authenticated: false }
  );
  return response.data;
}

export async function validateAllocationRequest(
  request: AllocationRequestV2Input
): Promise<AllocationValidationData> {
  const response = await allocationFetch<ApiEnvelope<AllocationValidationData>>(
    '/api/allocation/validate',
    {
      method: 'POST',
      body: JSON.stringify({
        ...request,
        schema_version: ALLOCATION_CONTRACT_VERSION,
      }),
    }
  );
  return response.data;
}

export async function listAllocationSimulations(): Promise<AllocationSimulation[]> {
  const response = await allocationFetch<ApiEnvelope<{ simulations: AllocationSimulation[] }>>(
    '/api/allocation/simulations',
    { method: 'GET' }
  );
  return response.data.simulations;
}

export async function createAllocationSimulation(input: {
  name: string;
  description?: string | null;
}): Promise<AllocationSimulation> {
  const response = await allocationFetch<ApiEnvelope<{ simulation: AllocationSimulation }>>(
    '/api/allocation/simulations',
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  );
  return response.data.simulation;
}

export async function listAllocationSimulationPortfolios(
  simulationId: number
): Promise<AllocationSimulationPortfolio[]> {
  const response = await allocationFetch<ApiEnvelope<{ portfolios: AllocationSimulationPortfolio[] }>>(
    `/api/allocation/simulations/${simulationId}/portfolios`,
    { method: 'GET' }
  );
  return response.data.portfolios;
}

export async function createAllocationSimulationPortfolio(
  simulationId: number,
  input: AllocationPortfolioCreateInput
): Promise<AllocationSimulationPortfolio> {
  const response = await allocationFetch<ApiEnvelope<{ portfolio: AllocationSimulationPortfolio }>>(
    `/api/allocation/simulations/${simulationId}/portfolios`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  );
  return response.data.portfolio;
}
