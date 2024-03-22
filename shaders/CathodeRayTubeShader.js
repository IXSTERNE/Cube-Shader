const CathodeRayTubeShader = {

    name: 'CathodeRayTubeShader',

    uniforms: {

        'tDiffuse': {value: null},
        'time': {value: 0.0},
        'u_resolution': {value: new THREE.Vector2()},
        'scanCount': {value: 0.8},
        'distance': {value: 1.5},
        'wobble': {value: 0.0}
    },

    vertexShader:`

        varying vec2 vUv;

        void main(){

            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,

    fragmentShader:`

        uniform sampler2D tDiffuse;
        uniform float time;
        uniform vec2 u_resolution;
        uniform float scanCount;
        uniform float distance;
        uniform float wobble;

        varying vec2 vUv;
        
        vec2 curveEffect(vec2 vUv){

            vUv = (vUv - 0.5) * 2.0;
            vUv *= distance;
            vUv.x *= 1.0 + pow((abs(vUv.y) / 5.0), 2.0); 
            vUv.y *= 1.0 + pow((abs(vUv.x) / 5.0), 2.0);
            vUv  = (vUv / 2.0) + 0.5;
            vUv =  vUv * 0.92 + 0.04;
            return vUv;
        }

        void main(){

            vec4 finalColor;

            vec2 vUv = curveEffect(gl_FragCoord.xy / u_resolution.xy);
            vec3 color;

            float sinComponent1 = sin(0.1 * time + vUv.y * 21.0);
            float sinComponent2 = sin(0.3 * time + vUv.y * 29.0);
            float sinComponent3 = sin(0.1 + 0.11 * time + vUv.y * 31.0);

            float x = sinComponent1 * sinComponent2 * sinComponent3 * wobble;

            color.r = texture2D(tDiffuse, vec2(x + vUv.x + 0.001, vUv.y + 0.001)).x + 0.01;
            color.g = texture2D(tDiffuse, vec2(x + vUv.x + 0.000, vUv.y - 0.002)).y + 0.01;
            color.b = texture2D(tDiffuse, vec2(x + vUv.x - 0.002, vUv.y + 0.000)).z + 0.01;

            color.r += 0.01 * texture2D(tDiffuse, 0.75 * vec2(x + 0.025, -0.027) + vec2(vUv.x + 0.001, vUv.y + 0.001)).x;
            color.g += 0.01 * texture2D(tDiffuse, 0.75 * vec2(x + -0.022, -0.02) + vec2(vUv.x + 0.000, vUv.y - 0.002)).y;
            color.b += 0.01 * texture2D(tDiffuse, 0.75 * vec2(x + -0.02, -0.018) + vec2(vUv.x - 0.002, vUv.y + 0.000)).z;

            color = clamp(color * 0.6 + 0.4 * color * color * 1.0, 0.0, 1.0);

            float vignette = (1.0 * 16.0 * vUv.x * vUv.y * (1.0 - vUv.x) * (1.0 - vUv.y));
            color *= vec3(pow(vignette, 0.3));

            color *= vec3(0.95, 1.05, 0.95);
            color = mix(color, color * color, 0.3) * 3.8;

            float scanlineEffect = clamp(0.35 + 0.20 * sin(3.5 * time + vUv.y * u_resolution.y * scanCount), 0.0, 1.0);
            
            float scanlinePower = pow(scanlineEffect, 1.5);
            color = color * vec3(0.4 + 0.7 * scanlinePower) ;

            color *= 1.0 + 0.01 * sin(200.0 * time);

            if(vUv.x < 0.0 || vUv.x > 1.0){
                color *= 0.0;
            }
                
            if(vUv.y < 0.0 || vUv.y > 1.0){
                color *= 0.0;
            }
                
            color *= 1.0 - 0.65 * vec3(clamp((mod(gl_FragCoord.x, 2.0) -1.0) * 2.0, 0.0, 1.0));

            finalColor = vec4(color, 2.0);
            gl_FragColor = finalColor;
        }`,
};

export { CathodeRayTubeShader }
