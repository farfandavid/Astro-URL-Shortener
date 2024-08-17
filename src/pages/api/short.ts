import type { APIRoute } from "astro";
import { nanoid } from "../../utils/shortCode";
import { z } from "astro/zod";
import { pool } from "../../config/db";

export const POST: APIRoute = async ({ request }) => {
    const body = await request.formData();
    const schemas = z.object({
        "original-url": z.string().url(),
        username: z.string().regex(/^[a-zA-Z0-9_]+$/, { message: "Username must be alphanumeric" }),
        password: z.string().regex(/^[a-zA-Z0-9!@#$%^&*]+$/, { message: "Password must be alphanumeric with special characters !@#$%^&*" }),
    })
    const validated = schemas.safeParse({
        "original-url": body.get("original-url"),
        username: body.get("username"),
        password: body.get("password"),
    });
    if (!validated.success) {
        return new Response(JSON.stringify(validated.error.flatten().fieldErrors), {
            status: 400,
            headers: {
                "content-type": "application/json",
            },
        });
    }
    try {
        const shortCode = nanoid();
        const row = await pool.query("INSERT INTO urls (short_code, original_url) VALUES (?, ?)", [shortCode, validated.data["original-url"]]);
        console.log(row);
        return new Response(JSON.stringify({ shortCode }), {
            status: 201,
            headers: {
                "content-type": "application/json",
            },
        });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                "content-type": "application/json",
            },
        });
    }
}

// GET ALL SHORT URLS
export const GET: APIRoute = async ({ }) => {
    try {
        const [rows] = await pool.query("SELECT * FROM urls");
        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: {
                "content-type": "application/json",
            },
        });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                "content-type": "application/json",
            },
        });
    }
}