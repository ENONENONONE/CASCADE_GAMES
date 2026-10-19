# parts/vr — the field in a headset

WebXR `immersive-vr` in the page itself: SteamVR headsets through Chrome or Edge on Windows (SteamVR's OpenXR runtime), Quest's
browser natively. No engine, no second build: the same three.js scene, the same parts, the same save in the browser.

## What the headset gets

- **The world at the real floor.** The rig stands 2.4 m down for the session, so the world's floor at y −2.4 (the 210-gon, the
  relief, the heat carpet, the white climber) lies at your feet with `local-floor`. The head then stands about 0.8 m under the
  field's centre: the horizon ring sits a hand above the eyes at 6 m, 7.6° up. The sky shader is a clip-space quad that reads one
  camera, so in the headset it gives way to the stars, as in AR; the rain is a mesh and stays. GLOW and the CRT are off in XR already.
- **The console** at the belt, 0.9 × 0.45 m, 0.75 m ahead, tilted up 32°, following the head's yaw at 4 % a frame so it is always
  found by a glance down and never jerks: the day and chapter, your cell and its word, the target and its word, moves against par,
  the rule, the clock, the effort bar as segments, the voice line, the quest, and the buttons: the six moves (the 6↔9 flip when the
  chapter opens it) with their hues and a gold inner ring on a free one, UNDO, HINT, RELIEF, VIEW, HEAT, EXIT VR. A ring at the top
  right shows the stick's six sectors and lights the one held.
- **The cards** at 1.4 m ahead, 1 m square: whatever card the page shows (a chapter, the won or lost card with the bardo's offer, the
  seal, a tapped cell's panel), its text wrapped, its buttons as the page has them (GO, NEXT, AGAIN, REBIRTH, END THE DAY, WALK ON,
  × CLOSE). A press clicks the DOM button, so the rules stay in one place; SHARE is left out (no share sheet in a session).
- **The insets** beside the console: the rays chart and the trace tile, their canvases copied to textures nine times a second.
- **The controllers**: a green ray from each; the trigger (select) taps what the ray meets, a card button first, then a console
  button, then a cell of the sky within 3.5° of the ray; the squeeze is UNDO; the thumbstick a radial menu of the six, one move per
  push past 0.8 (×g right, ÷g left, FOLD upper right, Γ lower right, INV lower left, ×i upper left), the sector drawn on the console.
- **Comfort**: the view is never moved by the page in XR (the crossing's turn and the bardo's lift already check `isPresenting`),
  bullet time keeps the headset's own projection, the flow of the cells stays as it is on a screen, and the flash gate still counts
  every onset. The TUBE is closed on entry (it skips the 3D frame).

## Preview without a headset

`FOLD_DEBUG.vr.preview(true)` hangs the same console, card and insets in front of the screen camera (the head at the rig's origin,
so the console sits 0.5 m below the eye), for a look and for the headless test; `vr.aim(ctrl, i)` and `vr.select(i)` run the pointer
from a controller object, so the test turns a controller at the console and presses a move.

## What is not here

- A Steam listing: that is the same page in an Electron shell with WebXR over OpenXR and a Steamworks app id; nothing in the game
  changes for it.
- Hand tracking: the trigger and the stick cover play; hands would add a pinch for select and nothing for the six.
- The TUBE and the TABLE in the headset: the chart is an inset; a full-size TUBE would be a third panel.
- Text input: the name is typed before entering.
