export interface Result {
    ip: string;
    uma: number;
    wf: number;
    kc: number;
    knsb: number;
    krr: number;

    _cellVariants?: Partial<Record<Exclude<keyof Result, "_cellVariants">, "danger" | "warning">>
}
