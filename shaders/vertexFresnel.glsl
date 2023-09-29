varying vec3 vPosition;
varying vec3 vNormal;

void main() {

    vPosition = vec3( vec4( position, 1.0 ) * modelMatrix);
    vNormal = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}