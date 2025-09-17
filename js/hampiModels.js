const hampiModels = [];

async function loadHampiModels() {
  try {
    const apiUrl = "https://ok1ab3856l.execute-api.ap-south-1.amazonaws.com/dev/temple-ar1";
    const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(apiUrl);

    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error("API request failed: " + response.status);
    }

    const result = await response.json();
    const models = JSON.parse(result.body);

    // Filter models for Karnataka -> Hampi only
    const filteredModels = models.filter(m => m.location.toLowerCase().includes("hampi"));

    const container = document.getElementById("hampiModelsContainer");
    container.innerHTML = "";

    filteredModels.forEach(m => {
      const card = document.createElement("div");
      card.className = "card";
      card.style = "background: white; border-radius: 12px; padding: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;";
      card.innerHTML = `
        <h2>${m.name}</h2>
        <p>${m.description}</p>
        <p><b>Location:</b> ${m.location}</p>
        <p><b>Rating:</b> ${m.rating} ⭐</p>
        <model-viewer 
          src="${m.url}" 
          alt="${m.name}"
          ar 
          ar-modes="webxr scene-viewer quick-look"
          camera-controls 
          auto-rotate 
          shadow-intensity="1"
          loading="eager"
          reveal="auto"
          environment-image="neutral"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23eee'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999'%3ELoading...%3C/text%3E%3C/svg%3E">
          <div slot="progress-bar" class="loading">Loading 3D model...</div>
          <div slot="error" class="error">Failed to load 3D model</div>
        </model-viewer>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading Hampi models:", error);
    document.getElementById("hampiModelsContainer").innerHTML = `
      <div class="error">
        <h3>Failed to load Hampi models</h3>
        <p>Please check your internet connection and try again.</p>
        <button onclick="loadHampiModels()">Retry</button>
      </div>`;
  }
}

window.addEventListener('DOMContentLoaded', loadHampiModels);
