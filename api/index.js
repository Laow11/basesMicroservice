import app from "./src/app.js";
const PORT = process.env.port || 3001;

// SERVIDOR LEVANTADO
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
