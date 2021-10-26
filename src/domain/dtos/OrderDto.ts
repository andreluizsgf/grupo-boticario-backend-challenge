import { OrderStatus } from "../entities/Order";

interface BaseOrderRequest {
    code: string
    dealerCpf: string
    date: Date
    subtotal: number
}

export interface CreateOrderRequest extends BaseOrderRequest {}

export interface ListOrdersRequest {
    pagination: {
        currentPage: number,
        perPage: number
    },
    status?: OrderStatus,
    dealerCpf?: string,
    since?: Date,
    until?: Date
}

export interface OrderResponse extends BaseOrderRequest {
    id: string
    status: OrderStatus
    cashbackPercentage: number
    cashbackValueInCents: number
    createdAt: Date
    updatedAt: Date
}