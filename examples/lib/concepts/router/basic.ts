import { router } from "@hella/router";

const appRouter = router();

appRouter.start({
  "/": "/hello",
  "/hello": async () => {
    const greeting = await new Promise((resolve) => resolve("Hello"));
    console.log(greeting);
  },
});
