import { query } from "../server";

export const register = async (req, res) => {
    const { email, password, cpassword } = req.body;
    const userId = ((length, chars) => Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))(5, '0123456789');

    // Check if the email already exists in the database
    const existingUsers = await query({
        query: "SELECT * FROM signup WHERE email = ?",
        values: [email],
    });

    if (existingUsers.length > 0) {
        const responseData = {
            message: "email already exists",
            status: 400,
        };
        return new Response(JSON.stringify(responseData));
    }

    const updateUsers = await query({
        query: "INSERT INTO signup (userId, email, password, cpassword) VALUES (?, ?, ?, ?)",
        values: [userId, email, password, cpassword],
    });

    const result = updateUsers;
    let message = result ? "success" : "error";

    const responseData = {
        message: message,
        status: 200,
        users: { email: email },
    };

    res.status(200).json({
        success: true,
        responseData
    });
}


export const login = async (req, res) => {
    const url = new URL(req.url);
    const useremail = url.searchParams.get('email');

    if (!useremail) {
        res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }
    const users = await query({
        query: "SELECT userId, email, password FROM signup WHERE email = ?",
        values: [useremail],
    });

    if (users.length === 0) {
        res.status(400).json({
            success: false,
            message: "User not Found"
        });
    }
    const responseData = JSON.stringify(users);
    res.status(200).json({
        success: true,
        responseData
    });
}