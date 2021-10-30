import Application from './app';

const application = new Application();

application.app.listen(3000, async() => {
    await application.start();
    console.log('listening on port 3000');
});