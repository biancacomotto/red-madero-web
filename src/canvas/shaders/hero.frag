uniform float uTime;
uniform float uScroll;
uniform float uAspect;
uniform vec3 uBase;
uniform vec3 uCyan;
uniform vec3 uBlue;
uniform vec3 uViolet;
uniform vec3 uPink;
uniform vec3 uCoral;
uniform vec3 uOrange;
uniform vec3 uYellow;
uniform vec3 uCentre;

varying vec2 vUv;

mat2 rotate(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

// Colours are mixed in linear light, then encoded for the sRGB canvas.
vec3 toSrgb(vec3 linear) {
  vec3 low = linear * 12.92;
  vec3 high = 1.055 * pow(max(linear, 0.0), vec3(1.0 / 2.4)) - 0.055;
  return mix(low, high, step(0.0031308, linear));
}

// One point of the colour mesh: full strength at `at`, fading out over `reach`.
float spot(vec2 p, vec2 at, float reach) {
  vec2 offset = p - at;
  return exp(-dot(offset, offset) / (reach * reach));
}

void main() {
  // Card units: the shorter side spans -0.5..0.5, so the picture keeps its shape in portrait.
  vec2 extent = 0.5 * vec2(uAspect, 1.0) / min(uAspect, 1.0);
  vec2 p = (vUv - 0.5) * 2.0 * extent;
  // Scrolling zooms in a little, so the waves swell as the card leaves.
  p *= 1.0 - 0.25 * uScroll;
  float t = uTime * 0.12;

  // Two long waves bend the mesh like cloth, drifting slowly in opposite directions.
  float wave1 = sin(dot(p, vec2(1.4, 2.0)) + t);
  float wave2 = sin(dot(p, vec2(2.0, -0.9)) - 0.7 * t + 1.3);
  vec2 d = p + 0.3 * wave1 * vec2(0.6, -0.8) + 0.25 * wave2 * vec2(0.9, 0.4);

  // Scrolling turns the mesh around its hub, so the colours sweep past as the card leaves.
  vec2 hub = vec2(-0.12, 0.04);
  vec2 m = rotate(1.2 * uScroll) * (d - hub) + hub;

  // The mesh: the hues sit around the card as in the reference, cyan on the left, then clockwise.
  // Each pixel blends them by distance, so neighbours melt into each other.
  vec3 sum = vec3(0.0);
  float total = 0.0;
  float weight;
  // Each hue only reaches its neighbours, so it shows pure at its core instead of a three-way mix.
  weight = spot(m, extent * vec2(-0.8, 0.0), 0.42);   sum += weight * uCyan;   total += weight;
  weight = spot(m, extent * vec2(-0.4, 0.55), 0.4);   sum += weight * uBlue;   total += weight;
  weight = spot(m, extent * vec2(0.0, 0.85), 0.4);    sum += weight * uViolet; total += weight;
  weight = spot(m, extent * vec2(0.55, 0.8), 0.26);   sum += weight * uPink;   total += weight;
  weight = spot(m, extent * vec2(0.85, 0.15), 0.42);  sum += weight * uCoral;  total += weight;
  weight = spot(m, extent * vec2(0.5, -0.55), 0.42);  sum += weight * uOrange; total += weight;
  weight = spot(m, extent * vec2(-0.15, -0.65), 0.45); sum += weight * uYellow; total += weight;
  weight = spot(m, hub + vec2(0.2, 0.0), 0.16);       sum += weight * uCentre; total += weight;
  // A white halo next to the pink keeps it from blending with the blues into violet.
  weight = spot(m, extent * vec2(0.78, 0.5), 0.2);    sum += weight * uBase;   total += weight;
  weight = spot(m, extent * vec2(0.3, 0.95), 0.18);   sum += weight * uBase;   total += weight;
  // Two white corners, as in the reference: they keep cyan and yellow apart (their mix is green).
  weight = spot(m, extent * vec2(-0.85, -0.8), 0.35); sum += weight * uBase;   total += weight;
  weight = spot(m, extent * vec2(0.95, -0.85), 0.32); sum += weight * uBase;   total += weight;
  vec3 color = sum / max(total, 1e-5);

  // Where opposite hues meet, their average is grey. Lifting every mix back to full brightness turns
  // those seams into light instead, the way the folds in the reference glow.
  float peak = max(max(color.r, color.g), color.b);
  color *= 0.98 / max(peak, 1e-4);
  // Mixing also thins the chroma; push it back so the colours stay strong.
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = clamp(mix(vec3(luma), color, 1.3), 0.0, 1.0);

  // Crests: one sinuous fold runs across the card, catching the light on one side and shading the other.
  float phase = dot(p, vec2(1.8, 2.8)) + 2.5 * wave2 + 1.5 * wave1 + 0.8 * t;
  float light = smoothstep(0.45, 1.0, sin(phase));
  float shade = smoothstep(0.45, 1.0, sin(phase - 1.2));
  color = mix(color, vec3(1.0), 0.14 * light);
  color *= 1.0 - 0.06 * shade;

  // Veil: the card fades to its base colour towards the edges, unevenly along the waves.
  float dist = length((d - hub) / extent * vec2(0.76, 0.625));
  float veil = smoothstep(1.0, 1.6, dist + 0.15 * wave1);
  color = mix(color, uBase, veil);

  gl_FragColor = vec4(toSrgb(color), 1.0);
}
