uniform sampler2D tDiffuse;
uniform float u_Time;
uniform vec2 resolution;
uniform float u_Trigger;

varying highp vec2 vUv;

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    vec3 hsv = vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    return hsv;
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(){

    vec4 originColor = texture2D(tDiffuse, vUv);

    if(u_Trigger > 0.0) {
        float w = (0.5 - (vUv.x)) * (resolution.x / resolution.y);
        float h = 0.5 - vUv.y;
        float distanceFromCenter = sqrt(w * w + h * h);
        
        float sinArg = distanceFromCenter * 10.0 - u_Time * 10.0;
        float slope = cos(sinArg) ;
        float effectFactor = 0.012; // 0.05
        vec4 color = texture(tDiffuse, vUv + normalize(vec2(w, h)) * slope * effectFactor);

        vec3 hsvColor = rgb2hsv(color.rgb);

        hsvColor.x += mix(0.0, 0.3, sin(u_Time));
        hsvColor.x = fract(hsvColor.x);

        vec4 final =  1.0 - vec4(hsv2rgb(hsvColor), 1.0);
        
        gl_FragColor = final;
    }
    else {
        gl_FragColor = originColor;
    }

}