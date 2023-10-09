//#include "./voronoi.glsl";
varying vec3 vPosition;
varying vec3 vNormal;

varying vec3 finalPosition;

vec3 RGBToFloat(vec3 color){
    return color/255.0;
}


void main() {
    float depthShadowsVoronoi = (clamp((length(vPosition-finalPosition))*2.4, 0.0, 1.0));

    vec3 mainColor = RGBToFloat(vec3(241, 193, 126));
    vec3 secondaryColor = RGBToFloat(vec3(179, 57, 81));


    vec3 color = mix(mainColor, secondaryColor, pow(depthShadowsVoronoi, 1.0/1.2));
//    vec3 color = mix(mainColor, secondaryColor, 0.0);
    vec3 colorMultiple = mix(mainColor, secondaryColor, depthShadowsVoronoi/2.0)*(depthShadowsVoronoi) + mix(mainColor, RGBToFloat(vec3(98, 144, 195)), 0.5+(depthShadowsVoronoi/.5))*(1.0-depthShadowsVoronoi);

    vec3 BWColor = vec3(depthShadowsVoronoi);

    gl_FragColor = vec4(color, 1.0);
//    gl_FragColor = vec4(vec3(depthShadowsVoronoi), 1.0) ;
}