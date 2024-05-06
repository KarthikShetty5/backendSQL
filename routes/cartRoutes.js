import { cartAdder, cartFetcher } from "../controllers/cartController.js";

const router = express.Router();

router.route("/cartAdder").post(cartAdder);

router.route("/cartFetcher").post(cartFetcher);

export default router;