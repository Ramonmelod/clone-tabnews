import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";

const router = createRouter();

export default router.handler(controller.errorHandlers);
router.get(getHandler);

async function getHandler(request, response) {
  const username = request.query.username;
  const foundUser = await user.findOnebyUsername(username);
  response.status(200).json(foundUser);
}
