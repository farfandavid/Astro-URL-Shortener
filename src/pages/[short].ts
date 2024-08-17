import type { APIRoute } from "astro";
import { pool } from "../config/db";

export const GET: APIRoute = async ({ params, redirect }) => {
    const { short } = params;
    try {
        const [rows] = await pool.query("SELECT original_url FROM urls WHERE short_code = ?", [short]);
        if ([rows].length === 0) {
            return new Response("Not found", { status: 404 });
        }
        const originalUrl = (rows as any)[0].original_url;
        return redirect(originalUrl);
    } catch (error) {
        return new Response("Not found", { status: 404 });

    }
}