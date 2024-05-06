import { addProduct, getProduct } from "../controllers/productController.js";

const router = express.Router();

router.route("/addProduct").post(addProduct);

router.route("/getProduct").post(getProduct);

export default router;