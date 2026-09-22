// =========================================================
// 0. PROMO ADVERTISEMENTS ROTATOR (WITH HOVER INTERACTION)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const quangcaoDiv = document.querySelector(".promo .quangcao");

  if (quangcaoDiv) {
    const promoImages = [
      "edited_media/COMM2754-2026-S2-A3w12-Amigos4-ads1.png",
      "edited_media/COMM2754-2026-S2-A3w12-Amigos4-ads2.png",
      "edited_media/COMM2754-2026-S2-A3w12-Amigos4-ads3.png",
      "edited_media/COMM2754-2026-S2-A3w12-Amigos4-ads4.png"
    ];

    const imgElement = document.createElement("img");
    
    // Smooth transition settings for scaling & filters
    imgElement.style.transition = "transform 0.2s ease-in-out, filter 0.2s ease-in-out";
    quangcaoDiv.appendChild(imgElement);

    // Inject shake keyframes into document header automatically
    if (!document.getElementById("promo-shake-style")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "promo-shake-style";
      styleSheet.innerText = `
        @keyframes promoShake {
          0% { transform: scale(1.04) rotate(0deg); }
          25% { transform: scale(1.04) rotate(-2deg); }
          50% { transform: scale(1.04) rotate(2deg); }
          75% { transform: scale(1.04) rotate(-1deg); }
          100% { transform: scale(1.04) rotate(0deg); }
        }
        .promo-hover-shake {
          animation: promoShake 0.4s ease-in-out infinite alternate;
          filter: brightness(1.15) contrast(1.05);
          cursor: pointer;
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Hover Interaction Handlers
    quangcaoDiv.addEventListener("mouseenter", () => {
      imgElement.classList.add("promo-hover-shake");
    });

    quangcaoDiv.addEventListener("mouseleave", () => {
      imgElement.classList.remove("promo-hover-shake");
    });

    let currentIndex = -1;

    function changePromoImage() {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * promoImages.length);
      } while (randomIndex === currentIndex && promoImages.length > 1);

      currentIndex = randomIndex;
      imgElement.src = promoImages[currentIndex];
    }

    // Set initial image and start 3-second interval
    changePromoImage();
    setInterval(changePromoImage, 3000);
  }
});






/// =========================================================
// 1. SCROLLING AD SKETCH
// =========================================================

const scrollingAdSketch = (p) => {
  let adText = "You saw the addiction. Did you see the person?";
  let textXPos = 0;
  let scrollSpeed = 1.5;
  let textWidthValue = 0;
  let gap = 400;

  let cloverImage;
  let cloverImageReady = false;
  let cloverImageWidth = 32;
  let cloverImageHeight = 32;

  const cloverImageFile =
    "edited_media/COMM2754-2026-S2-A3w12-Amigos4-clover.gif";

  let candies = [];
  let loadedSounds = [];
  let isHovering = false;

  const candyImageFiles = [
    "edited_media/COMM2754-2026-S2-A3w12-Amigos4-element1.png",
    "edited_media/COMM2754-2026-S2-A3w12-Amigos4-element2.png",
    "edited_media/COMM2754-2026-S2-A3w12-Amigos4-element3.png",
  ];

  let candyImages = [];
  let candyImagesReady = false;
  let loadedCandyCount = 0;

  let pendingCandyHover = false;
  let pendingHoverX = 0;
  let pendingHoverY = 0;

  const soundFiles = [
    "designed_sounds/COMM2754-2026-S2-A3w12-Amigos4-beat-anim.wav",
    "designed_sounds/COMM2754-2026-S2-A3w12-Amigos4-blip-anim.wav",
    "designed_sounds/COMM2754-2026-S2-A3w12-Amigos4-over10-bao.wav",
  ];

  p.setup = () => {
    const container = document.querySelector(".banner");

    const w = container?.clientWidth || 300;
    const h = container?.clientHeight || 40;

    const canvas = p.createCanvas(w, h);

    // Load clover GIF as a DOM image
    cloverImage = p.createImg(cloverImageFile, "");
    cloverImage.hide();

    // Keep GIF aspect ratio
    cloverImage.elt.onload = () => {
      const originalWidth = cloverImage.elt.naturalWidth;
      const originalHeight = cloverImage.elt.naturalHeight;

      const maxHeight = 32;

      cloverImageHeight = maxHeight;
      cloverImageWidth =
        (originalWidth / originalHeight) * maxHeight;

      cloverImageReady = true;
    };

    if (container) {
      canvas.parent(container);
    }

    p.textSize(24);
    p.textFont("Georgia");
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.CENTER);

    textWidthValue = p.textWidth(adText);
    textXPos = p.width;

    loadedSounds = soundFiles.map((path) => {
      const snd = new Audio(path);
      snd.volume = 0.5;
      return snd;
    });

    candyImageFiles.forEach((path, index) => {
      const img = new Image();
      img.src = path;

      img.onload = () => {
        loadedCandyCount++;
        candyImages.push(img);

        if (loadedCandyCount === candyImageFiles.length) {
          candyImagesReady = true;

          if (pendingCandyHover) {
            spawnCandyParticles(pendingHoverX, pendingHoverY);
            pendingCandyHover = false;
          }
        }
      };

      img.onerror = () => {
        loadedCandyCount++;

        if (loadedCandyCount === candyImageFiles.length) {
          candyImagesReady = true;

          if (pendingCandyHover) {
            spawnCandyParticles(pendingHoverX, pendingHoverY);
            pendingCandyHover = false;
          }
        }
      };
    });
  };

  function spawnCandyParticles(x, y) {
    if (!candyImagesReady) {
      pendingCandyHover = true;
      pendingHoverX = x;
      pendingHoverY = y;
      return;
    }

    const usableImages = candyImages.filter(
      (img) => img.complete && img.naturalWidth > 0
    );

    if (usableImages.length === 0) return;

    const particleCount = p.floor(p.random(15, 30));

    for (let i = 0; i < particleCount; i++) {
      const selectedImage = p.random(usableImages);

      candies.push(
        new CandyParticle(p, selectedImage, x, y)
      );
    }
  }

  p.draw = () => {
    p.clear();

    p.fill("#FFFFFF");
    p.noStroke();

    // STRICT HOVER DETECTION
    const mouseInCanvas =
      p.mouseX > 0 &&
      p.mouseX <= p.width &&
      p.mouseY > 0 &&
      p.mouseY <= p.height;

    // Trigger only when entering the banner from outside
    if (mouseInCanvas && !isHovering) {
      isHovering = true;

      // Play random sound
      if (loadedSounds.length > 0) {
        const snd = p.random(loadedSounds);
        snd.currentTime = 0;

        snd.play().catch((error) => {
          console.log("Audio blocked:", error);
        });
      }

      if (candyImagesReady) {
        spawnCandyParticles(p.mouseX, p.mouseY);
      } else {
        pendingCandyHover = true;
        pendingHoverX = p.mouseX;
        pendingHoverY = p.mouseY;
      }
    }

    // Reset hover state when mouse leaves canvas completely
    if (!mouseInCanvas) {
      isHovering = false;
    }

    // Update & Display Candies
    candies = candies.filter((candy) => {
      candy.update();
      candy.display();
      return !candy.isDead();
    });

    // Scrolling Text + Clover GIF
    const iconGap = 10;

    const textWithIconWidth =
      cloverImageWidth +
      iconGap +
      textWidthValue;

    const fullLength =
      textWithIconWidth + gap;

    for (
      let currentX = textXPos;
      currentX < p.width;
      currentX += fullLength
    ) {
      // Draw clover GIF before the sentence
      if (cloverImageReady) {
        p.image(
          cloverImage,
          currentX,
          p.height / 2 - cloverImageHeight / 2,
          cloverImageWidth,
          cloverImageHeight
        );
      }

      // Draw sentence after the GIF
      p.text(
        adText,
        currentX +
          cloverImageWidth +
          iconGap,
        p.height / 2
      );
    }

    textXPos -= scrollSpeed;

    if (textXPos <= -textWithIconWidth) {
      textXPos += fullLength;
    }
  };

  p.windowResized = () => {
    const container = document.querySelector(".banner");

    if (container) {
      p.resizeCanvas(
        container.clientWidth,
        container.clientHeight
      );

      textWidthValue = p.textWidth(adText);
    }
  };
};



// =========================================================
// 2. CANDY PARTICLE CLASS
// =========================================================

class CandyParticle {
  constructor(p, image, x, y) {
    this.p = p;
    this.image = image;

    this.x = x;
    this.y = y;

    this.vx = p.random(-3.5, 3.5);
    this.vy = p.random(-4.5, 0.5);

    this.gravity = 0.1;

    this.alpha = 1.0;
    this.lifespan = 180;

    this.size = p.random(12, 20);

    this.rotation = p.random(p.TWO_PI);
    this.rotationSpeed = p.random(-0.04, 0.04);
  }

  update() {
    this.x += this.vx;

    this.vy += this.gravity;
    this.y += this.vy;

    this.rotation += this.rotationSpeed;

    this.lifespan--;
    this.alpha = this.p.map(this.lifespan, 0, 180, 0, 1.0);
  }

  display() {
    if (!this.image || !this.image.complete || this.image.naturalWidth === 0) {
      return;
    }

    const ctx = this.p.drawingContext;
    const imgRatio = this.image.naturalWidth / this.image.naturalHeight;

    let drawWidth = this.size;
    let drawHeight = this.size;

    if (imgRatio >= 1) {
      drawHeight = this.size / imgRatio;
    } else {
      drawWidth = this.size * imgRatio;
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));

    ctx.drawImage(
      this.image,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );

    ctx.restore();
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

new p5(scrollingAdSketch);

// =========================================================
// 3. BACKGROUND PIXEL ARTWORK SKETCH
// =========================================================

const backgroundSketch = (p) => {
  let aspectRatio;
  let stars = [];
  let waveSeeds = [];
  let orbs = [];

  let timeAccumulator = 0;
  let p5Colors = [];

  const rawColors = [
    [105, 0, 125],
    [25, 0, 85],
    [50, 0, 105],
    [135, 0, 170],
  ];

  const LOW_RES_WIDTH = 400;

  p.setup = () => {
    let container = document.getElementById("bg-canvas-container");

    if (!container) {
      container = document.createElement("div");
      container.id = "bg-canvas-container";
      document.body.prepend(container);
    }

    aspectRatio = window.innerHeight / window.innerWidth;

    const lowResHeight = p.floor(LOW_RES_WIDTH * aspectRatio);

    p.pixelDensity(1);
    p.frameRate(30);

    const canvas = p.createCanvas(LOW_RES_WIDTH, lowResHeight);

    canvas.parent(container);

    p5Colors = rawColors.map((colorValue) => {
      return p.color(colorValue[0], colorValue[1], colorValue[2]);
    });

    orbs = [
      { x: 0.2, y: 0.25, baseR: 110, phase: 0.0, colorShiftSpeed: 0.15 },
      { x: 0.8, y: 0.2, baseR: 120, phase: 1.5, colorShiftSpeed: 0.12 },
      { x: 0.5, y: 0.5, baseR: 100, phase: 3.0, colorShiftSpeed: 0.18 },
      { x: 0.15, y: 0.75, baseR: 115, phase: 4.2, colorShiftSpeed: 0.14 },
      { x: 0.85, y: 0.8, baseR: 125, phase: 2.1, colorShiftSpeed: 0.16 },
      { x: 0.5, y: 0.85, baseR: 95, phase: 5.5, colorShiftSpeed: 0.11 },
    ];

    stars = Array.from({ length: 6 }, () => ({
      x: p.random(p.width),
      y: p.random(p.height),
      vx: p.random(-0.3, 0.3),
      vy: p.random(-0.2, 0.2),
      phase: p.random(p.TWO_PI),
    }));

    waveSeeds = [p.random(100), p.random(100)];
  };

  p.draw = () => {
    const dt = p.min(p.deltaTime * 0.001, 0.05);

    timeAccumulator += dt;

    const t = timeAccumulator * 0.6;

    const bgSpeed = 0.4;

    const bgProgress = (timeAccumulator * bgSpeed) % p5Colors.length;

    const bgIdx1 = p.floor(bgProgress);

    const bgIdx2 = (bgIdx1 + 1) % p5Colors.length;

    const bgAmt = bgProgress - bgIdx1;

    const bgColor = p.lerpColor(p5Colors[bgIdx1], p5Colors[bgIdx2], bgAmt);

    p.background(bgColor);

    p.noStroke();

    orbs.forEach((orb) => {
      const cx = p.width * orb.x;
      const cy = p.height * orb.y;

      const pulse = p.sin(timeAccumulator * 1.2 + orb.phase);

      const currentRadius = orb.baseR + pulse * 14;

      const colorProgress =
        (timeAccumulator * orb.colorShiftSpeed + orb.phase) % p5Colors.length;

      const idx1 = p.floor(colorProgress);
      const idx2 = (idx1 + 1) % p5Colors.length;
      const amt = colorProgress - idx1;

      const activeColor = p.lerpColor(p5Colors[idx1], p5Colors[idx2], amt);

      const layers = 4;

      for (let i = layers; i > 0; i--) {
        const currentR = p.map(
          i,
          1,
          layers,
          currentRadius,
          currentRadius * 0.15
        );

        const alphaVal = p.map(i, 1, layers, 35, 140);

        p.fill(
          p.red(activeColor),
          p.green(activeColor),
          p.blue(activeColor),
          alphaVal
        );

        p.ellipse(cx, cy, currentR);
      }
    });

    p.fill(255, 255, 255, 100);

    p.noStroke();

    const spacing = 6;

    for (let x = 0; x < p.width; x += spacing) {
      for (let y = 0; y < p.height; y += spacing) {
        const dTL = p.dist(x, y, 0, 0);

        const dBR = p.dist(x, y, p.width, p.height);

        if (dTL < p.width * 0.35 || dBR < p.width * 0.35) {
          p.rect(x, y, 1, 1);
        }
      }
    }

    p.noFill();

    p.stroke(255, 255, 255, 160);

    p.strokeWeight(1);

    waveSeeds.forEach((seed, index) => {
      p.beginShape();

      const yOffset = index === 0 ? p.height * 0.22 : p.height * 0.78;

      for (let x = 0; x <= p.width; x += 3) {
        const y =
          yOffset +
          p.sin(x * 0.03 + t * 1.5 + seed) * 4 +
          p.cos(x * 0.02 - t) * 2;

        p.vertex(x, y);
      }

      p.endShape();
    });

    stars.forEach((star) => {
      star.x = (star.x + star.vx * (dt * 30) + p.width) % p.width;

      star.y = (star.y + star.vy * (dt * 30) + p.height) % p.height;

      p.fill(255, 255, 255);

      p.noStroke();

      p.rect(star.x, star.y, 1, 1);

      p.rect(star.x - 1, star.y, 3, 1);

      p.rect(star.x, star.y - 1, 1, 3);
    });
  };

  p.windowResized = () => {
    aspectRatio = window.innerHeight / window.innerWidth;

    p.resizeCanvas(LOW_RES_WIDTH, p.floor(LOW_RES_WIDTH * aspectRatio));
  };
};

new p5(backgroundSketch);