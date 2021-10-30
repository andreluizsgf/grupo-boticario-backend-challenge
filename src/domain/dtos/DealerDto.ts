interface BaseDealerRequest {
  name: string;
  cpf: string;
  email: string;
}

export interface CreateDealerRequest extends BaseDealerRequest {
  password: string;
}

export interface DealerResponse extends BaseDealerRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
