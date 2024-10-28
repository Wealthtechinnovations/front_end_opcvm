export interface Fund {
  value: any;
  name: any;
  nom_fond: any;
  description: any;
  code_ISIN: any;
  nom: any;
  pays: any;
}

export interface Pays {
  id: number;
  nom: string;
  value: string;
}

export interface Societe {
  id: number;
  nom: string;
  name:string;
}

export interface FundsResponse {
  code: number;
  data: {
    pays: any;
    funds: Fund[];
    paysOptions: any;
    societes: any;
  };
}

export interface PaysResponse {
  code: number;
    data: {
      paysOptions: any;
  
  };
}

export interface SocieteResponse {
  code: number;
 
    data: {
      societes: any;
    
  };
}
