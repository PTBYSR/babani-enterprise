async function main() {
    console.log("Fetching a product...");

    // Find a product via the local API
    const res = await fetch('http://localhost:3000/api/products');
    const data = await res.json();
    if (!data.products || data.products.length === 0) {
        console.log("No products found via API");
        process.exit(1);
    }
    const productId = data.products[0]._id;
    console.log("Testing on product: ", productId, "Name:", data.products[0].name);

    // Make first POST
    const res1 = await fetch(`http://localhost:3000/api/products/${productId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: 2 })
    });
    const data1 = await res1.json();
    console.log("First POST Response:", res1.status, data1);

    // Make second POST
    const res2 = await fetch(`http://localhost:3000/api/products/${productId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: 4 })
    });
    const data2 = await res2.json();
    console.log("Second POST Response:", res2.status, data2);

    process.exit(0);
}

main().catch(console.error);
