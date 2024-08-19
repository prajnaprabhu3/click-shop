import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

// export const { GET, POST } = createRouteHandler({
//   router: ourFileRouter,
// });

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

export default async function handler(req: Request, res: Response) {
  if (req.method === "GET") {
  } else if (req.method === "POST") {
  }
}
