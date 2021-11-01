import Application from "./app";

const application = new Application();
const PORT = process.env.PORT ?? 3000;

application.app.listen(PORT, async () => {
  await application.start();
  console.log(`listening on port ${PORT}`);
});
