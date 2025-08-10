const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();
const port = 3000;

// Configura Multer para guardar el archivo en la memoria (MemoryStorage)
const upload = multer({ dest: "uploads/" });

app.post("/api/citas/bulk-import", upload.single("csvFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No se ha subido ningún archivo.");
  }

  const filePath = req.file.path;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      // Elimina el archivo subido después de procesarlo
      fs.unlinkSync(filePath);

      // Aquí `results` es la lista de objetos JS con los datos del CSV
      console.log(results);
      res
        .status(200)
        .json({ message: "Archivo procesado con éxito", data: results });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
