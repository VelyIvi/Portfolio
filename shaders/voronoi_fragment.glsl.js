const fragmentShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    varying vec3 finalPosition;
    
    uniform vec3 mainColor;
    uniform vec3 shadeColor;
    
    void main() {
        float depthShadowsVoronoi = (clamp((length(vPosition-finalPosition))*2.4, 0.0, 1.0));
        vec3 color = mix(mainColor, shadeColor, pow(depthShadowsVoronoi, 1.0/1.3));
        gl_FragColor = vec4(color, 1.0);
    }
`
//Changes the colour of the pixel depending on how deep it is relative to the unaltered point map of the object
export default fragmentShader