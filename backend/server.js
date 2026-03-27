import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

let bebes = [];

app.get("/bebes", (req, res) => {
  res.json(bebes);
});

app.post("/bebes", (req, res) => {
  const novoBebe = req.body;
  bebes.push(novoBebe);
  res.json({ sucesso: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
