export class QueryMaterialDto {
    page?: number = 1;
    limit?: number = 10;
    search?: string;
    status?: string;
    loai_vt?: string;
    vt_ton_kho?: number;
}