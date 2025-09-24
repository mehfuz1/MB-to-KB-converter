let files = [];

// Drag & Drop
const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");

dropArea.addEventListener("click", () => fileInput.click());

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.style.background = "#e6ecf7";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.background = "#f0f4fa";
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.style.background = "#f0f4fa";
  files = [...e.dataTransfer.files];
  fileInput.files = e.dataTransfer.files;
});

fileInput.addEventListener("change", (e) => {
  files = [...e.target.files];
});

// Convert Multiple Images
function convertImages() {
  const targetSizeKB = document.getElementById("targetSize").value;
  const resultsDiv = document.getElementById("results");
  const downloadAllBtn = document.getElementById("downloadAll");

  resultsDiv.innerHTML = "";
  if (files.length === 0) {
    alert("Please select or drop images!");
    return;
  }

  if (!targetSizeKB) {
    alert("Please enter target size in KB!");
    return;
  }

  let zip = new JSZip();
  let processed = 0;

  files.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.src = e.target.result;

      img.onload = function() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let quality = 0.9;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        while (dataUrl.length / 1024 > targetSizeKB && quality > 0.1) {
          quality -= 0.05;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        // Show result
        const resultItem = document.createElement("div");
        resultItem.className = "result-item";
        resultItem.innerHTML = `
          <strong>${file.name}</strong><br>
          Original: ${(file.size/1024).toFixed(2)} KB<br>
          Compressed: ${(dataUrl.length/1024).toFixed(2)} KB
          <div class="progress-bar"><div class="progress" style="width:100%"></div></div>
          <a href="${dataUrl}" download="compressed_${file.name}" class="download-btn">Download</a>
        `;
        resultsDiv.appendChild(resultItem);

        // Add to zip
        zip.file("compressed_" + file.name, dataUrl.split(",")[1], {base64: true});

        processed++;
        if (processed === files.length) {
          downloadAllBtn.style.display = "inline-block";
          downloadAllBtn.onclick = () => {
            zip.generateAsync({type:"blob"}).then(content => {
              saveAs(content, "compressed_images.zip");
            });
          };
        }
      };
    };
    reader.readAsDataURL(file);
  });
}

// Dark/Light Mode
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("themeToggle");
  btn.textContent = document.body.classList.contains("dark") ? "☀ Light Mode" : "🌙 Dark Mode";
});

