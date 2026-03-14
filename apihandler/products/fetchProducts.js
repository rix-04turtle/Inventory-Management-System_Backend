import MasterProduct from "../../models/MasterProduct.js";


async function fetchProduct(req,res) {

    try{
        const products = await MasterProduct.find({});
        res.json({ status :"success", products })
    }
    catch (err){
        console.error(err);
        res.status(500).send('Inernal Server Error')
    }
    
}

export default fetchProduct;