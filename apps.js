// ============================================================
//  f0rLorN Apps Config
//  To add a new app, copy one of the objects below and paste
//  it at the end of the array. Change the fields and save.
// ============================================================

const APPS = [
  {
    name: "Audio",           // App name after "f0rLorN "
    tag: "Audio Processing", // Short category label
    desc: "Advanced audio broadcasting and processing tool. Stream, capture, and manage audio with low latency.",
    downloadUrl: "https://github.com/YOUR_USERNAME/groza-audio/releases/latest",
    icon: "audio",           // Options: audio, cleaner, blur, video, network, code, game, system, tool
    badge: "Free",           // Badge text (e.g. "Free", "Beta", "New")
    status: "released",      // "released" | "soon" (coming soon = no download button)
  },
  {
    name: "CCleaner",
    tag: "System Utility",
    desc: "Lightweight system cleaner that removes junk files, optimizes performance, and keeps your PC running smooth.",
    downloadUrl: "https://github.com/YOUR_USERNAME/f0rlorN-ccleaner/releases/latest",
    icon: "cleaner",
    badge: "Free",
    status: "released",
  },
  {
    name: "Blur",
    tag: "Video Processing",
    desc: "Gaming montage video processor with motion blur, frame interpolation, and batch processing support.",
    downloadUrl: "https://github.com/YOUR_USERNAME/groza-blur/releases/latest",
    icon: "blur",
    badge: "Free",
    status: "released",
  },

  // ── EXAMPLE: Add a new app below ──────────────────────────
  // {
  //   name: "Recorder",
  //   tag: "Screen Capture",
  //   desc: "Lightweight screen recorder with no watermark.",
  //   downloadUrl: "https://github.com/YOUR_USERNAME/f0rlorN-recorder/releases/latest",
  //   icon: "video",
  //   badge: "New",
  //   status: "released",
  // },
];
