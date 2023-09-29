//#include "./voronoi.glsl";
varying vec3 vPosition;
varying vec3 vNormal;

varying vec3 finalPosition;

vec3 RGBToFloat(vec3 color){
    return color/255.0;
}


void main() {
    float depthShadowsVoronoi = (clamp((length(vPosition-finalPosition) * 2.2), 0.0, 1.0));

    vec3 mainColor = RGBToFloat(vec3(96, 196, 195));
    vec3 secondaryColor = RGBToFloat(vec3(30, 33, 82));


    vec3 color = mix(mainColor, secondaryColor, depthShadowsVoronoi);
    vec3 BWColor = vec3(depthShadowsVoronoi);

    gl_FragColor = vec4(color, 1.0);
//    gl_FragColor = vec4(vec3(depthShadowsVoronoi), 1.0) ;
}