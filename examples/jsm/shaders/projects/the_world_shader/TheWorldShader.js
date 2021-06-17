/**
 * Pixelation shader
 */

export const TheWorldShader = async () => ({

	uniforms: {
        
        u_Time: {value: 0},
		'tDiffuse': { value: null },
		'resolution': { value: null },
		'pixelSize': { value: 1 },
        u_Trigger: { value: 0 },
	},

	vertexShader: await getShader(window.origin + "/examples/jsm/shaders/projects/the_world_shader/vs.glsl"),

	fragmentShader: await getShader(window.origin + "/examples/jsm/shaders/projects/the_world_shader/fs.glsl"),

});

export function getShader(url) {
    return new Promise((res, rej) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = e => {
            let text = xhr.response;
            // text.type = 'application/javascript'; // force the MIME
            // moduleScript.src = URL.createObjectURL(blob);
            res(text);
        };
        xhr.open('get', url);
        xhr.responseType = 'text';
        xhr.send();
    })
}