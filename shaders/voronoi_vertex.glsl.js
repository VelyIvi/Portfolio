const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    varying vec3 finalPosition;
    
    uniform vec2 uResolution;
    uniform float uScale;
    uniform float uChange;
    uniform float uTime;
    
    vec3 hash3d(vec3 p) {
        return fract(
        sin(vec3(dot(p, vec3(1.0, 57.0, 113.0)), dot(p, vec3(57.0, 113.0, 1.0)),
        dot(p, vec3(113.0, 1.0, 57.0)))) *
        43758.5453);
    }
    
    
    vec2 voronoi( in vec3 x, in float time, in float scale){
        x*=scale;
        vec3 n = floor(x);
        vec3 f = fract(x);
    
        vec4 m = vec4(8.0);
    
        for( int k=-1; k<=1; k++ ) {
            for( int j=-1; j<=1; j++ ) {
                for( int i=-1; i<=1; i++ ){
                    vec3 g = vec3(float(i),float(j),float(k));
                    vec3 o = hash3d( n + g );
                    vec3 r = g + (0.5+0.5*sin(vec3(time)+6.2831*o)) - f;
                    float d = dot(r,r);
                    if(d<m.x){
                        m = vec4( d, o );
                    }
                }
            }
        }
        return vec2(m.x, m.y+m.z+m.w);
    }
    
    void main() {
        vPosition = vec3( vec4( position, 1.0 ) * modelMatrix);
    
        vNormal = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );
        vec2 res = 1.0 - 0.5* voronoi(vPosition*3., uTime*0.3, uScale);
        vec3 voronoiOut = clamp(vec3(res.x), 0.0, 1.0);
    
        vec2 resIn = 0.8* voronoi(vPosition*3., uTime*0.3, uScale*(sin(uChange)/1.5+1.0));
    
        vec3 voronoiOutIn = 0.6+0.5*clamp(vec3(resIn.x), 0.0, 1.0);
        vec3 voronoiMix = mix(voronoiOut, voronoiOutIn, uChange);
        finalPosition = vec3(voronoiMix *vec3( vec4( position, 1.0 ) * modelMatrix));
        gl_Position = projectionMatrix * modelViewMatrix * vec4((voronoiMix)*vec3( vec4( position, 1.0 ) * modelMatrix), 1.0 );
    }
`
//Displaces the points of the object based on a voronoi shader
export default vertexShader