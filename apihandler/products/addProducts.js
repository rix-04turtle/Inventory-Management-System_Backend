import MasterProduct from "../../models/MasterProduct.js";
import generateSKU from "../generatesku.js";

async function addProduct(req, res) {
  try {
    let body = req.body;
    console.log(body)
    let productCatagory = body.productCatagory;
    if (typeof productCatagory !== "string") {
      return res.json({ error: "Type of Catagory must be String" });
    }
    // console.log(typeof typeof "hello world")

    let productName = body.productName;
    let productImage = body.productImage;
    let productDescription = body.productDescription;
    let productBasePrice = body.productBasePrice;
    let productStockQnt = body.productStockQnt;
    let productminStockLevel = body.productminStockLevel;

    console.log(
      productCatagory,
      productName,
      productBasePrice,
      productStockQnt,
    );

    const newProduct = new MasterProduct({
      // _id: new ObjectId,
      catagory: productCatagory,
      name: productName,
      images: productImage,
      description: productDescription,
      basePrice: productBasePrice,
      stockQuantity: productStockQnt,
      minStockLevel: productminStockLevel,
      sku: generateSKU(),
    });

    await newProduct
      .save()
      .then((data) => console.log("new prduct saved", data))
      .catch((err) => console.error("try adding once again", err));

    return res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "failed", message: "Internal Server Error", error });
  }
}

export default addProduct;
