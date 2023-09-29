uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;


void main(){

    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float dotProduct = dot(viewDirection, normalize(vNormal));
    float fresnel = 1.0 - clamp(pow(dotProduct, dotProduct*dotProduct), 0.0, 1.0);

    vec3 color = vec3(fresnel) * vec3(vPosition.x+1.0, vPosition.y+1.0, vPosition.z+1.0);

    gl_FragColor = vec4(vec3(color), 1.0);
}