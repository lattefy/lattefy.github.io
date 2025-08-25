// Lattefy - QR Phone Scanner (rear-first, robust, with overlay + logs)
// Requires: jsQR loaded BEFORE this file.
// Expects DOM elements: #qr-scanner-modal, #qr-video, #qr-canvas, #qr-close, #qr-status.

(function QRScanner() {
  const modal = document.getElementById('qr-scanner-modal');
  if (!modal) return;

  const video = document.getElementById('qr-video');
  const canvas = document.getElementById('qr-canvas');
  // Optimize getImageData readbacks:
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const closeBtn = document.getElementById('qr-close');
  const statusEl = document.getElementById('qr-status');

  let stream = null;
  let raf = null;
  let targetInputId = null;
  let lastHintAt = 0;

  const uyPhoneRegex = /^09\d{7}$/;

  // Draw detection outline for visual feedback
  function drawBox(l, color = 'rgba(0,255,0,0.8)') {
    ctx.beginPath();
    ctx.moveTo(l.topLeftCorner.x, l.topLeftCorner.y);
    ctx.lineTo(l.topRightCorner.x, l.topRightCorner.y);
    ctx.lineTo(l.bottomRightCorner.x, l.bottomRightCorner.y);
    ctx.lineTo(l.bottomLeftCorner.x, l.bottomLeftCorner.y);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  document.addEventListener('DOMContentLoaded', () => init());

  function init(selector = '.scan-phone') {
    document.querySelectorAll(selector).forEach(btn => {
      btn.addEventListener('click', () => startFlow(btn.dataset.target));
    });
  }

  async function startFlow(targetId) {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert('La cámara no está disponible en este dispositivo/navegador.');
        return;
      }
      if (typeof jsQR !== 'function') {
        console.error('[QR] jsQR no está cargado. Revisa el orden de los <script>.');
        alert('Error: librería de QR no cargada.');
        return;
      }

      targetInputId = targetId;
      openModal();

      // iOS: ensure inline playback
      video.setAttribute('playsinline', '');
      video.muted = true; // safer on some devices

      // 1) Strict rear
      await tryStart({ facingMode: { exact: 'environment' } })
        // 2) Generic rear
        .catch(() => tryStart({ facingMode: 'environment' }))
        // 3) Enumerate and choose likely rear
        .catch(() => openByEnumeration());
    } catch (e) {
      console.error('[QR] startFlow failed:', e);
      alert('No fue posible acceder a la cámara.');
      closeModal();
    }
  }

  async function openByEnumeration() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cams = devices.filter(d => d.kind === 'videoinput');
    if (!cams.length) throw new Error('No cameras');

    const back = cams.find(c => /back|trás|rear|environment/i.test(c.label));
    const choice = back?.deviceId || cams[cams.length - 1].deviceId;
    await tryStart({ deviceId: { exact: choice } });
  }

  async function tryStart(videoConstraints) {
    stopCamera();
    console.log('[QR] Starting camera with constraints:', videoConstraints);

    stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: false
    });

    // Some devices return a stopped track if permission is denied afterwards
    const track = stream.getVideoTracks()[0];
    if (!track || track.readyState === 'ended') {
      throw new Error('Video track ended immediately');
    }

    video.srcObject = stream;

    // Wait for metadata -> ensures videoWidth/Height > 0
    await new Promise((resolve) => {
      const onReady = () => {
        video.removeEventListener('loadedmetadata', onReady);
        resolve();
      };
      if (video.readyState >= 1 && video.videoWidth > 0) resolve();
      else video.addEventListener('loadedmetadata', onReady, { once: true });
    });

    await video.play().catch(() => {}); // ignore autoplay quirks

    status('Apuntá al QR en la tarjeta del cliente.');
    tick();
  }

  function tick() {
    if (!video.videoWidth) {
      raf = requestAnimationFrame(tick);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // More permissive inversion attempts (helps with some QR themes/screens)
    const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'attemptBoth' });

    if (code && code.data) {
      drawBox(code.location);
      const digits = extractDigits(code.data);

      if (uyPhoneRegex.test(digits)) {
        console.log('[QR] Valid UY phone detected:', digits);
        fillAndClose(digits);
        return;
      } else {
        // Throttle hints to avoid spamming the UI
        const now = performance.now();
        if (now - lastHintAt > 1200) {
          status('QR leído, pero no es un celular uruguayo (formato 09xxxxxxx).');
          lastHintAt = now;
          console.log('[QR] Decoded but invalid for UY phone:', code.data, '->', digits);
        }
      }
    }

    raf = requestAnimationFrame(tick);
  }

  function extractDigits(text) {
    return (text || '').replace(/[^\d]/g, '');
  }

  function fillAndClose(phone) {
    const input = targetInputId ? document.getElementById(targetInputId) : null;
    if (input) input.value = phone;
    status('Número detectado ✔');
    closeModal();
  }

  function openModal() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    status('Cargando cámara…');
  }

  function closeModal() {
    stopCamera();
    modal.style.display = 'none';
    document.body.style.overflow = '';
    targetInputId = null;
  }

  function stopCamera() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    video.srcObject = null;
  }

  function status(text) {
    if (statusEl) statusEl.textContent = text;
  }

  // Close on backdrop or X
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener('beforeunload', stopCamera);
})();