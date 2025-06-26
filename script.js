const form = document.getElementById("cv-form");
const preview = document.getElementById("preview");

// 📤 PDF Oluştur
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const data = await getFormData();
  const html = getTemplateHTML(data);
  const temp = document.createElement("div");
  temp.innerHTML = html;
  document.body.appendChild(temp);

  html2pdf()
    .set({
      margin: 0,
      filename: `${data.fullname.trim().replace(/\s+/g, "_").toLowerCase()}-cv.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, scrollY: 0 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css"] }
    })
    .from(temp)
    .save()
    .then(() => document.body.removeChild(temp));
});

// 🧠 Form Verilerini Al
async function getFormData() {
  const get = (name) => form.elements[name]?.value || "";
  const file = form.elements["photo"]?.files[0];
  let photo = "";
  if (file) photo = await readFileAsDataURL(file);

  return {
    fullname: get("fullname"),
    email: get("email"),
    phone: get("phone"),
    address: get("address"),
    about: get("about"),
    education: get("education"),
    experience: get("experience"),
    certificates: get("certificates"),
    skills: get("skills"),
    linkedin: get("linkedin"),
    templateStyle: get("templateStyle"),
    photo
  };
}

// 💎 ŞABLON ÜRETİCİ — 3 Tamamen Farklı Stilde
function getTemplateHTML(data) {
  const p = (label, value) => value ? `<p><strong>${label}:</strong> ${value}</p>` : "";
  const multi = (label, val) => val ? `<div style="margin: 8px 0;"><strong>${label}:</strong><br>${val.replace(/\n/g, "<br>")}</div>` : "";
  const img = data.photo ? `<img src="${data.photo}" style="width:100px;border-radius:10px;">` : "";

  if (data.templateStyle === "modern") {
    return `
      <div style="display:flex; font-family:'Segoe UI',sans-serif; color:#333; width:100%; min-height:100vh;">
        <div style="width:30%; background:#1e1e1e; color:#fff; padding:20px;">
          ${img}<h2 style="margin-top:10px;">${data.fullname}</h2>
          ${p("Email", data.email)}
          ${p("Telefon", data.phone)}
          ${p("Adres", data.address)}
          ${p("LinkedIn / GitHub", data.linkedin)}
        </div>
        <div style="width:70%; padding:30px; background:#f9f9f9;">
          ${multi("Hakkında", data.about)}
          ${multi("Eğitim", data.education)}
          ${multi("İş Deneyimi", data.experience)}
          ${multi("Sertifikalar", data.certificates)}
          ${p("Beceriler", data.skills)}
        </div>
      </div>
    `;
  }

  if (data.templateStyle === "elegant") {
    return `
      <div style="font-family:Georgia,serif; padding:40px; max-width:800px; margin:auto; color:#111;">
        <h1 style="border-bottom:2px solid #444;">${data.fullname}</h1>
        ${img ? `<div style="margin: 20px 0;">${img}</div>` : ""}
        ${p("Email", data.email)}
        ${p("Telefon", data.phone)}
        ${p("Adres", data.address)}
        ${multi("Hakkında", data.about)}
        <hr>
        ${multi("Eğitim", data.education)}
        ${multi("İş Deneyimi", data.experience)}
        ${multi("Sertifikalar", data.certificates)}
        ${p("Beceriler", data.skills)}
        ${p("LinkedIn / GitHub", data.linkedin)}
      </div>
    `;
  }

  // ✨ Default: Klasik Kartlı
  return `
    <div style="font-family:Arial,sans-serif; padding:30px; background:#f3f3f3; max-width:900px; margin:auto; color:#222;">
      <div style="background:white; padding:25px; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.1);">
        <div style="display:flex; align-items:center; gap:20px;">
          ${img}
          <div>
            <h1 style="margin:0;">${data.fullname}</h1>
            ${p("Email", data.email)}
            ${p("Telefon", data.phone)}
            ${p("Adres", data.address)}
            ${p("LinkedIn / GitHub", data.linkedin)}
          </div>
        </div>
        <hr style="margin:20px 0;">
        ${multi("Hakkında", data.about)}
        ${multi("Eğitim", data.education)}
        ${multi("İş Deneyimi", data.experience)}
        ${multi("Sertifikalar", data.certificates)}
        ${p("Beceriler", data.skills)}
      </div>
    </div>
  `;
}

// 📷 Fotoğraf Base64
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = e => reject(e);
    reader.readAsDataURL(file);
  });
}

// 👁️ Önizlemeyi Güncelle
form.querySelectorAll("input, textarea, select").forEach(el =>
  el.addEventListener("input", updatePreview)
);
updatePreview();

async function updatePreview() {
  const data = await getFormData();
  const html = getTemplateHTML(data);
  preview.innerHTML = html;
}