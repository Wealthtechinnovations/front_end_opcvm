// API and site URLs - use environment variables with fallback to localhost
const urlconstant = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
const urlstableconstant = process.env.NEXT_PUBLIC_STABLECOIN_API_URL || 'https://api.stablecoin.chainsolutions.fr';
const urlsite = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const urlconstantimage = process.env.NEXT_PUBLIC_API_IMAGE_URL || `${urlconstant}/uploads`;
const urlconstantpython = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000';

// API Keys should be in environment variables, not in source code
const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_STABLECOIN_API_KEY || '';

export { urlconstant, urlstableconstant, urlsite, urlconstantimage, API_KEY_STABLECOIN, urlconstantpython };
