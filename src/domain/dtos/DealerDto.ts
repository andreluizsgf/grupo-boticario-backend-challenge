interface BaseDealerRequest {
    name: string
    cpf: string
    email: string
    password: string
}

export interface CreateDealerRequest extends BaseDealerRequest {}

export interface DealerResponse extends BaseDealerRequest {
    id: string
    createdAt: Date
    updatedAt: Date
}