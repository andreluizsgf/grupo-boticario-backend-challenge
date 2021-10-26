import Application from "./app";

const application = new Application();
application.start()

application.app.listen(3000, () => {
    console.log("listening on port 3000");
});