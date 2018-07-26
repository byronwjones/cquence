interface IConductor {
    lets: NormalMap;
    error(exception?: string | Error): void;
    [key: string]: any;
}