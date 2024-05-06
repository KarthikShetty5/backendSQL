import { query } from "../server";

export const cartAdder = async (req, res) => {
    const { id, userId, count } = req.body;

    // Check if the item already exists in the cart
    const existingCartItem = await query({
        query: "SELECT * FROM Cart WHERE id = ? AND userId = ?",
        values: [id, userId],
    });

    if (existingCartItem.length > 0) {
        // If the item exists, increment its count
        const updatedCount = existingCartItem[0].count + 1;
        await query({
            query: "UPDATE Cart SET count = ? WHERE id = ? AND userId = ?",
            values: [updatedCount, id, userId],
        });

        res.status(200).json({
            success: true,
            message: "Cart item count incremented successfully",
        });
    } else {
        // If the item doesn't exist, insert it into the cart
        const order = await query({
            query: "INSERT INTO Cart (id, userId, count) VALUES (?, ?, ?)",
            values: [id, userId, count],
        });

        if (order) {
            res.status(200).json({
                success: true,
                message: "Item added to cart successfully",
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Error adding item to cart",
            });
        }
    }
}


export const cartFetcher = async (req, res) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const id = url.searchParams.get('id');
        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const carts = await query({
            query: "SELECT * FROM cart WHERE id = ?",
            values: [id],
        });

        return res.status(200).json({ success: true, data: carts });
    } catch (error) {
        console.error("Error fetching carts:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}