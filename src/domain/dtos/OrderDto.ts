import { PaginationResponse } from "../database/repositories/IBaseRepository";
import { OrderStatus } from "../entities/Order";

interface BaseOrderRequest {
    code: string
    dealerCpf: string
    date: Date
    subtotal: number
}

export interface CreateOrderRequest extends BaseOrderRequest {}

export interface ListOrdersRequest {
    currentPage: string,
    perPage: string
    status?: string,
}

export interface ListOrdersResponse {
    pagination: PaginationResponse,
    data: OrderResponse[]
}

export interface OrderResponse extends BaseOrderRequest {
    id: string
    status: OrderStatus
    cashbackPercentage: number
    cashbackValueInCents: number
    createdAt: Date
    updatedAt: Date
}