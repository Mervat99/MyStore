
import gemini from "../ai/gemini.js";
import Product from "../models/Product.js";

export const askAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please provide a message",
      });
    }

    const products = await Product.find({
      countInStock: { $gt: 0 },
    })
      .select("name description price category countInStock")
      .lean();

    const productCatalog = products.map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.countInStock,
    }));

    const prompt = `
You are the AI Shopping Assistant for MyStore.

Your job is to help customers choose products from the MyStore catalog.

Important rules:
1. Only recommend products that exist in the provided catalog.
2. Never invent products, prices, categories, or stock levels.
3. Use the product descriptions to understand what may suit the customer.
4. When the customer asks for recommendations, briefly explain why each product may be suitable.
5. If the customer specifies a budget, respect it.
6. If no product matches the request, clearly say that no matching product was found.
7. Mention prices in USD.
8. Do not claim that a product is available if it is not in the catalog.
9. Keep responses friendly, clear, and reasonably concise.

Customer message:
${message.trim()}

MyStore product catalog:
${JSON.stringify(productCatalog, null, 2)}
`;

    const response = await gemini.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
    });

    res.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("========== AI ERROR ==========");
    console.error(error);
    console.error("================================");

    res.status(500).json({
      message: error?.message || "AI request failed",
    });
  }
};

