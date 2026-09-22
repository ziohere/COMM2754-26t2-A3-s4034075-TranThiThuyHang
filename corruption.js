// corruption.js
// -----------------------------------------------------------------------
// Runs the "corruption" ending once the user has dusted off both
// portraits. Handles: swapping all page text to the call-to-action line,
// a black "fog" that slowly rolls over the page, a swarm of shaking/
// glitching spam ads, a gating button, and the final "What's new" panel.
//
// Requires corruption.css to be linked in <head>.
// Load this file BEFORE or AFTER sketchCorrupt.js — order doesn't matter,
// since sketchCorrupt.js only calls window.triggerCorruption() later, in
// response to a click.
// -----------------------------------------------------------------------

(function () {
  const CORRUPTION_DURATION_MS = 10000; // 10 seconds of chaos
  const AD_SPAWN_INTERVAL_MS = 350;
  const CTA_TEXT = "You saw the addiction. Did you see the person?";

  window.triggerCorruption = function triggerCorruption() {
    if (typeof window.startCorruptionSound === "function") {
      window.startCorruptionSound();
    }

    swapAllTextToCTA();
    startFog();

    let adSpam = setInterval(spawnSpamAd, AD_SPAWN_INTERVAL_MS);

    // After the corruption window, stop spamming and gate the ending
    // behind a single deliberate click instead of auto-advancing.
    setTimeout(() => {
      clearInterval(adSpam);
      showLookAwayButton();
    }, CORRUPTION_DURATION_MS);
  };

  // --- 1. Swap all visible page text to the CTA line --- //
  function swapAllTextToCTA() {
    const textElements = document.querySelectorAll(
      "p, h1, h2, h3, h4, span, a, button, small, strong, em"
    );
    textElements.forEach((el) => {
      if (el.id !== "move-on-btn" && el.id !== "look-away-btn") {
        el.innerText = CTA_TEXT;
      }
    });
  }

  // --- 2. Black fog that slowly covers the page content --- //
  // Sits above the regular page content but below the spam ads, so the
  // loud red ads stay readable while everything behind them sinks into
  // black over the full 10 seconds.
  function startFog() {
    const fog = document.createElement("div");
    fog.id = "fog-overlay";
    document.body.appendChild(fog);

    // Wait a frame so the browser registers the starting opacity (0)
    // before we flip the class — otherwise the transition never plays.
    requestAnimationFrame(() => {
      fog.classList.add("fog-active");
    });
  }

  // --- 3. Spam ad swarm, bigger + chaotic (shake + glitch) --- //
  function spawnSpamAd() {
    if (typeof window.playCorruptPopupSounds === "function") {
      window.playCorruptPopupSounds();
    }

    const ad = document.createElement("div");
    ad.className = "spam-ad";

    // Bigger, variable footprint so the swarm reads as roughly 60% of
    // the visible page by the time the sequence ends.
    const width = 32 + Math.random() * 20; // 32% - 52% viewport width
    const top = Math.random() * 75;
    const left = Math.random() * 70;
    const rotate = (Math.random() * 10 - 5).toFixed(1);
    const shakeDelay = (Math.random() * 0.3).toFixed(2);
    const glitchDelay = (Math.random() * 0.6).toFixed(2);

    ad.style.top = `${top}%`;
    ad.style.left = `${left}%`;
    ad.style.width = `${width}%`;
    ad.style.setProperty("--rot", `${rotate}deg`);
    ad.style.animationDelay = `${shakeDelay}s, ${glitchDelay}s`;
    ad.innerText = CTA_TEXT;

    document.body.appendChild(ad);
  }

  // --- 4. Gate the ending behind a single button --- //
  function showLookAwayButton() {
    const btn = document.createElement("button");
    btn.id = "look-away-btn";
    btn.innerText = "Looking away is never the answer";
    document.body.appendChild(btn);

    // Fade the button in a beat after it's added
    requestAnimationFrame(() => btn.classList.add("look-away-visible"));

    btn.addEventListener(
      "click",
      () => {
        showFinalPanel();
      },
      { once: true }
    );
  }

 // --- 5. Final "What's new" panel --- //
  function showFinalPanel() {
    // Inject the new modal HTML into body (removing 'hidden' so it displays immediately)
    document.body.innerHTML = `
      <div id="whats-new-modal" class="modal-overlay">
        <div class="modal-box">
          <div class="modal-header">
            <span class="modal-title">SYSTEM OVERRIDE: SDG 3.5</span>
            <button id="close-modal-btn" class="close-btn">X</button>
          </div>
          
          <div class="modal-content">
            <h2 class="modal-main-heading">
              "You saw the addiction.<br />Did you see the person?"
            </h2>
            
            <h3 class="cta-title">Call to Action</h3>
            <p>
              Aligned with United Nations Sustainable Development Goal 3.5, this
              project raises awareness of substance use disorders and promotes
              voluntary treatment through creative communication. In Vietnam, only
              90,869 of 220,904 registered people who use drugs are engaged in
              structured rehabilitation (Ministry of Public Security 2024, cited
              in Nguyen et al. 2025). While 43% are placed in compulsory
              rehabilitation centres, 85.6% relapse within 12 months (Nguyen et
              al. 2025). In Viet Nam, drug addiction treatment has traditionally
              relied heavily on compulsory institutional care. In 2019, 76.8% of
              people receiving institutional treatment were treated compulsorily,
              compared with 19.2% voluntarily. Meanwhile, around 800
              community-based treatment and support sites operated across 23
              cities and provinces, although relapse and unemployment remained
              significant challenges (Le et al. 2024).
            </p>
            
            <p>
              Featuring one of the most talented, famous figure of the music
              industry who has overcome addiction - while also advocating for
              rehabilitation of substance abuse victims, Elton John quoted: “I
              finally summoned up the courage to say three words that would change
              my life ‘I need help’” (John 2026, cited in Broomall 2026). This
              marked his voluntary in seeking entry to rehabilitation in 1990,
              with the help of his loved ones. He later described rehabilitation
              as a freeing experience that helped him rediscover joy in life
              (Broomall 2026). Influenced by his strong will and resilience, our
              call to action aims to erase stigma formed that revolves around
              substance abuse victim, encourage people to see them beyond their
              suffering: “You saw the addiction. Did you see the person?”.
              Targeting young Vietnamese adults to perceive how addiction could
              affect a person through multiple factors - the campaign highlights a
              sense of immersive nostalgia with 2000s aesthetic of an instant
              messaging browser, lead the user with a plot line of familiarity
              when the victim, is the one you care about.
            </p>
            
            <div class="medical-info-box">
              <h3>MEDICAL SERVICES & SUPPORT IN VIETNAM</h3>
              <p>
                If you see someone struggling with addiction, or if you need help
                yourself, please reach out to these official, voluntary medical
                facilities for guidance and rehabilitation:
              </p>
              <ul>
                <li>
                  <strong>Ho Chi Minh City Psychiatric Hospital (Bệnh viện Tâm thần TP.HCM):</strong>
                  Call <span class="highlight-text">(028) 3923 4675</span>. They
                  provide professional psychological counseling and voluntary
                  detoxification treatments.
                </li>
                <li>
                  <strong>Ministry of Health Hotline:</strong> Call
                  <span class="highlight-text">1900 9095</span> for medical
                  direction and information regarding nearest treatment centers.
                </li>
                <li>
                  <strong>National Child & Youth Protection Hotline:</strong> Call
                  <span class="highlight-text">111</span> for urgent mental health
                  crises and general social support interventions.
                </li>
              </ul>
            </div>
            
            <p class="about-us-text">
              <strong>About Us:</strong><br />
              We are a group of Digital Media students from RMIT University
              Vietnam (Saigon South Campus). This project is designed for COMM2754
              (Digital Media Specialisation 1). We created this generative art
              project with the purpose of helping everyone view people struggling
              with addiction through a gentler, more empathetic lens, and to
              understand the practical steps needed to help them overcome it.
              Contact:
              Tran Thi Thuy Hang - s4034075@rmit.edu.vn
              Dan Le Nguyen Thuy - s4158958@rmit.edu.vn
              Ngoc Nguyen Duc Bao - S4067283@rmit.edu.vn
              Nam Vu Hai - S4118255@rmit.edu.vn
            </p>
          </div>
        </div>
      </div>
    `;

    // Add close button functionality
    document.getElementById("close-modal-btn").addEventListener("click", () => {
      window.location.reload();
    });
  }
  })();
