export interface Pagination {
    total: number
    page: {
        current: string
        prev: string
        next: string
        first: string
        last: string
    }
}

export interface ListResponse {
    limit: number
    offset: number
    total: number
    pagination: Pagination
    data: any[]
}

export enum Operator {
    equals = 'equals',
    not_equals = 'not_equals',
    lt = 'lt',
    lte = 'lte',
    gt = 'gt',
    gte = 'gte',
    like = 'like',
    not_like = 'not_like',
    in = 'in',
    not_in = 'not_in',
    null = 'null',
    not_null = 'not_null',
    search = 'search'
}

export interface Filter {
    field: string
    operator: Operator
    value: string
}

export interface Column {
    field: string
    type: 'string' | 'number' | 'boolean' | 'date'
    nullable: boolean
    required: boolean
    primary_key: boolean
    unique_key: boolean
    foreign_key: boolean
    default: null | string
    extra: string
}

export interface Relation {
    table: string
    column: string
    org_table: string
    org_column: string
}

export interface Schema {
    table: string
    columns: Column[]
    primary_key: string
    relations: Relation[]
}