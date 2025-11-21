const drop = document.getElementById("drop");
const output = document.getElementById("output");

drop.addEventListener("dragover", e => {
    e.preventDefault();
    drop.classList.add("hover");
});

drop.addEventListener("dragleave", () => {
    drop.classList.remove("hover");
});

drop.addEventListener("drop", e => {
    e.preventDefault();
    drop.classList.remove("hover");

    const file = e.dataTransfer.files[0];
    upload(file);
});

function upload(file) {
    const reader = new FileReader();
    reader.onload = async () => {
        const base64 = reader.result;

        const req = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: base64 })
        });

        const res = await req.json();

        output.innerHTML = res.url
            ? `<p>URL: <a href="${res.url}" target="_blank">${res.url}</a></p>`
            : `<p style="color:red">${res.error}</p>`;
    };
    reader.readAsDataURL(file);
}
