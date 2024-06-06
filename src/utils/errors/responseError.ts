import { Response } from "express";

interface ErrorWithCode {
    code?: number;
    message?: string;
    errors?: string;
    meta?: {
        target?: Record<string, string>;
    };
}

const errorResponse = (res: Response, error: ErrorWithCode) => {
    if (error.hasOwnProperty("code") || error.hasOwnProperty("errors")) {

        if (error.code === 401) {
            return res.status(401).json({
                ok: false,
                errors: [{ message: error.message || error.errors }],
            });
        }
        if (error.code === 403) {
            return res.status(403).json({
                ok: false,
                errors: [{ message: error.message || error.errors }],
            });
        }

        if (error.code === 404) {
            return res.status(404).json({
                ok: false,
                errors: [{ message: error.message || error.errors }],
            });
        }

        return res.status(400).json({
            ok: false,
            errors: [{ message: error.message || error.errors }],
        });
    }
    return res.status(500).json({
        ok: false,
        errors: [{ message: error.message || error }],
    });
};

export default errorResponse;