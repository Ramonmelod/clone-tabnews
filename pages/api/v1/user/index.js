import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";
import session from "models/session";

const router = createRouter();

export default router.handler(controller.errorHandlers);
router.get(getHandler);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;
  const sessionObject = await session.findOneValidByToken(sessionToken);
  const renewedSession = await session.renew(sessionObject.id);
  const userObject = await user.findOnebyId(sessionObject.user_id);
  controller.setSessionCookie(renewedSession.token, response);
  response.status(200).json(userObject);
}
