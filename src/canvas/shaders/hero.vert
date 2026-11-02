varying vec2 vUv;

// The quad already spans clip space, so the camera is ignored and the plane always fills the canvas.
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
