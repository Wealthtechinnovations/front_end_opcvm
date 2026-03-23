export interface Fund {
  value: number;
  label: string;
  name: string;
  nom_fond: string;
  description: string;
  code_ISIN: string;
  nom: string;
  pays: string;
  slug: string;
}

export interface Pays {
  id: number;
  nom: string;
  value: string;
  slug?: string;
}

export interface Societe {
  id: number;
  nom: string;
  name: string;
  slug?: string;
}

export interface FundsResponse {
  code: number;
  data: {
    pays: any;
    funds: Fund[];
    paysOptions: Pays[];
    societes: Societe[];
  };
}

export interface PaysResponse {
  code: number;
  data: {
    paysOptions: Pays[];
  };
}

export interface SocieteResponse {
  code: number;
  data: {
    societes: Societe[];
  };
}
