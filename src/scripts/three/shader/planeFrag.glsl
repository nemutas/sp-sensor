uniform sampler2D u_texture;
uniform vec2 u_uvScale;
uniform vec2 u_tilt;
varying vec2 v_uv;

const float ZOOM = 0.8;

void main() {
  vec2 uv = (v_uv - 0.5) * u_uvScale * ZOOM + 0.5;
  uv += u_tilt * 0.01;
  vec4 tex = texture2D(u_texture, uv);
  gl_FragColor = tex;
}