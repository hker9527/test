export interface Json {
    ts: number;
    results: Result[];
}

export interface Result {
    ip: string;
    umamusume: number;
    worldflipper: number;
    kancolle: number;
    konosuba: number;

    _cellVariants?: Partial<Record<Exclude<keyof Result, "_cellVariants">, "danger" | "warning">>
}
