interface BaseDealerDto {
    name: string
    cpf: string
    email: string
    password: string
}

export interface CreateDealerRequest extends BaseDealerDto {}

export interface DealerResponse extends BaseDealerDto {
    id: string
    createdAt: Date
    updatedAt: Date
}