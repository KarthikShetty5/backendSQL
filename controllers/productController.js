import { query } from "../server";

export const addProduct = async (req, res) => {
    const { title, image, ratings, price, description } = req.body;

    // If the email does not exist, proceed to register the user
    const product = await query({
        query: "INSERT INTO product (title, image, ratings, price, description) VALUES (?, ?, ?, ?, ?)",
        values: [title, image, ratings, price, description],
    });

    const result = product;
    let message = result ? "success" : "error";

    const responseData = {
        message: message,
        status: 200,
        product: product,
    };
    res.status(200).json({
        success: true,
        data: responseData,
        message: "Item added to cart successfully",
    });
}

export const getProduct = async (req, res) => {
    const products = await query({
        query: "SELECT * FROM product ",
        values: [],
    });
    res.status(200).json({
        success: true,
        data: products,
    });
}