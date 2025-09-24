const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");
const kbInput = document.getElementById("kbInput");
const convertBtn = document.getElementById("convertBtn");
const downloadLink = document.getElementById("downloadLink");

let selectedFile = null;

// Click & Drag Events
uploadBox.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  uploadBox.querySelector("p").textContent = "✅ " + selectedFile.name;
});

uploadBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadBox.style.background = "#eef";
});
uploadBox.addEventListener("dragleave", () => {
  uploadBox.style.background = "#f9f9f9";
});
uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();
  selectedFile = e.dataTransfer.files[0];
  uploadBox.querySelector("p").textContent = "✅ " + selectedFile.name;
});

// Convert Button
convertBtn.addEventListener("click", () => {
  if (!selectedFile) {
    alert("Please upload an image first!");
    return;
  }

  const targetKB = parseInt(kbInput.value);
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let quality = 0.9;
      let result;

      do {
        result = canvas.toDataURL("image/jpeg", quality);
        quality -= 0.05;
      } while (result.length / 1024 > targetKB && quality > 0.05);

      downloadLink.href = result;
      downloadLink.download = "compressed.jpg";
      downloadLink.style.display = "block";
      downloadLink.textContent = "⬇ Download Compressed Image";
    };
  };

  reader.readAsDataURL(selectedFile);
});
