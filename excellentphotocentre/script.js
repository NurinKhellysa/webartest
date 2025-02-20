// DOM Elements
const frameSize = document.getElementById("frame-size");
const frameDesign = document.getElementById("frame-design");
const uploadImage = document.getElementById("upload-image");
const previewBtn = document.getElementById("preview-btn");
const frameContainer = document.getElementById("frame-container");
const arBtn = document.getElementById("ar-btn");
const arContainer = document.getElementById("ar-container");

// Frame Preview
previewBtn.addEventListener("click", () => {
  const size = frameSize.value;
  const design = frameDesign.value;
  const file = uploadImage.files[0];

  if (!file) {
    alert("Please upload an image!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    // Create a styled frame with the uploaded image
    frameContainer.innerHTML = `
      <div style="border: 5px solid black; padding: 10px; background: #f5f5f5;">
        <img src="${e.target.result}" alt="Uploaded Image" style="max-width: 100%; height: auto;">
        <p>Size: ${size} | Design: ${design}</p>
      </div>
    `;
  };
  reader.readAsDataURL(file);
});

// AR Functionality
arBtn.addEventListener("click", async () => {
  if (!navigator.xr) {
    alert("AR is not supported on this device/browser.");
    return;
  }

  const supported = await navigator.xr.isSessionSupported("immersive-ar");
  if (!supported) {
    alert("AR session not supported. Try using a different device or browser.");
    return;
  }

  try {
    const session = await navigator.xr.requestSession("immersive-ar");
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.xr.enabled = true;
    arContainer.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
    scene.add(camera);

    const geometry = new THREE.PlaneGeometry(0.5, 0.7); // Adjust size as needed
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Placeholder color
    const frameMesh = new THREE.Mesh(geometry, material);
    frameMesh.position.set(0, 0, -1); // 1 meter in front of the user
    scene.add(frameMesh);

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    renderer.xr.setSession(session);
  } catch (error) {
    console.error("Failed to start AR session:", error);
    alert(`Failed to start AR session: ${error.message}`);
  }
});
