import { BaseModel } from "../../entities/Base";

export interface PaginationResponse {
    currentPage: number,
    lastPage: number,
    perPage: number,
    total: number

}
export interface IBaseRepository<T extends BaseModel> {
    insert(item: T): Promise<T>
    get(id: string): Promise<T | undefined>
    findOneBy(item: Partial<T>): Promise<T | undefined>
    paginate(currentPage: number, perPage: number, condition: any): Promise<{ data: T[], pagination: PaginationResponse}>
}