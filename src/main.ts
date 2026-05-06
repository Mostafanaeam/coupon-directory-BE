import app from './server.js';

const port = process.env.PORT || 5000;

app.listen(Number(port), () => {
  console.log(`Server is running on port ${port}`);
});
