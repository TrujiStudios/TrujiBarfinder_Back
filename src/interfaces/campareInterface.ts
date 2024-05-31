

export interface ComparePasswordFunction {
    (password: string, hash: string): Promise<boolean>;
}