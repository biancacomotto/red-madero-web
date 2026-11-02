#include ./chunks/noise3d.glsl

uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;
uniform float uTime;

varying vec2 vUv;

// The profile canvases are uploaded unflipped and mirrored, so v = 0 is the top of the display.
void main() {
  vec2 st = vec2(1.0 - vUv.x, vUv.y);

  // A wavy frontier sweeps from the bottom of the display to the top.
  float drift = snoise(vec3(st.x * 2.2, st.y * 3.5, uTime * 0.6)) * 0.14;
  float ripple = sin(st.x * 9.0 + uTime * 3.0) * 0.035;
  float frontier = (1.0 - st.y) + drift + ripple;
  float sweep = -0.35 + uProgress * 1.7;
  float keepOld = smoothstep(sweep - 0.14, sweep + 0.14, frontier);
  // Peaks right at the frontier and fades to zero away from it.
  float band = 1.0 - abs(keepOld * 2.0 - 1.0);

  // The old profile slides up and out, the new one rises into place; both bend near the frontier.
  vec2 bend = vec2(0.0, band * 0.045);
  vec2 fromUv = st + vec2(0.0, uProgress * 0.06) - bend;
  vec2 toUv = st - vec2(0.0, (1.0 - uProgress) * 0.08) + bend;
  vec3 from = texture2D(uFrom, fromUv).rgb;
  vec3 to = texture2D(uTo, toUv).rgb;

  vec3 color = mix(to, from, keepOld);
  // A soft sheen rides along the frontier.
  color += vec3(band * band * band * 0.18);
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
