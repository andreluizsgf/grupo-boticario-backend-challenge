import { OrderStatus } from "../entities/Order";
import { PaginationResponse } from "./Common";

interface BaseOrderRequest {
  code: string;
  valueInCents: number;
}

export interface CreateOrderRequest extends BaseOrderRequest {
  dealerCpf: string;
  date: string;
}

export interface ListOrdersRequest {
  currentPage: number;
  perPage: number;
  status?: string;
}

export interface ListOrdersResponse {
  pagination: PaginationResponse;
  data: OrderResponse[];
}

export interface OrderResponse extends BaseOrderRequest {
  status: OrderStatus;
  cashbackPercentage: number;
  cashbackValueInCents: number;
  date: Date;
}
