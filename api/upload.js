import FormData from "form-data";
import fetch from "node-fetch";

export default async function handler(req, res) {
    try {
        const { file } = req.body;

        if (!file) {
            return res.status(400).json({ error: "No file received" });
        }

        // convert base64 → buffer
        const buffer = Buffer.from(file.split(",")[1], "base64");

        const form = new FormData();
        form.append("file", buffer, {
            filename: "image.jpg",
            contentType: "image/jpeg"
        });

        const upload = await fetch("https://telegra.ph/upload", {
            method: "POST",
            body: form
        });

        const result = await upload.json();

        if (result.error) return res.status(500).json(result);

        return res.status(200).json({
            url: "https://telegra.ph" + result[0].src
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
