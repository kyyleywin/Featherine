export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";
import fs from "fs";
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed parsing form" });
    }

    const file = files.image;

    try {
      const buffer = fs.readFileSync(file.filepath);

      const formData = new FormData();
      formData.append("file", new Blob([buffer]), file.originalFilename);

      const upload = await fetch("https://telegra.ph/upload", {
        method: "POST",
        body: formData
      });

      const result = await upload.json();

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      const url = "https://telegra.ph" + result[0].src;

      return res.status(200).json({ url });

    } catch (e) {
      return res.status(500).json({ error: "Upload failed", details: e.message });
    }
  });
}
