import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
