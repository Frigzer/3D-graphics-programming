let gl; 
let points;

async function loadFile(file) {
    text = await file.text();
    text=text.replaceAll('/', ' ');
    text=text.replaceAll('\n', ' ');
    let arrayCopy = text.split(' ');
 const vertices = [[]];  let licz_vertices = 0;
 const normals = [[]]; let licz_normals = 0;
 const coords = [[]];  let licz_coords = 0;
 const triangles = []; let licz_triangles = 0;
 for (let i=0;i<arrayCopy.length-1;i++)
 {
 if (arrayCopy[i]=='v') {
	vertices.push([]);
 vertices[licz_vertices].push(parseFloat(arrayCopy[i+1]));
 vertices[licz_vertices].push(parseFloat(arrayCopy[i+2]));
 vertices[licz_vertices].push(parseFloat(arrayCopy[i+3]));
 i+=3;
 licz_vertices++;
 }
 if (arrayCopy[i]=='vn') {
 normals.push([]);
 normals[licz_normals].push(parseFloat(arrayCopy[i+1]));
 normals[licz_normals].push(parseFloat(arrayCopy[i+2]));
 normals[licz_normals].push(parseFloat(arrayCopy[i+3]));
 i+=3;
 licz_normals++;
 }
 if (arrayCopy[i]=='vt') {
 coords.push([]);
 coords[licz_coords].push(parseFloat(arrayCopy[i+1]));
 coords[licz_coords].push(parseFloat(arrayCopy[i+2]));
 i+=2;
 licz_coords++;
 }
 if (arrayCopy[i]=='f') {
 triangles.push([]);
 for (let j=1;j<=9;j++) 
triangles[licz_triangles].push(parseFloat(arrayCopy[i+j]));
 i+=9;
 licz_triangles++;
 }
 }
 let vert_array=[];
 for (let i = 0; i < triangles.length; i++)
 {
 vert_array.push(vertices[triangles[i][0] - 1][0]);
 vert_array.push(vertices[triangles[i][0] - 1][1]);
 vert_array.push(vertices[triangles[i][0] - 1][2]);
 vert_array.push(normals[triangles[i][2] - 1][0]);
 vert_array.push(normals[triangles[i][2] - 1][1]);
 vert_array.push(normals[triangles[i][2] - 1][2]);
 vert_array.push(coords[triangles[i][1] - 1][0]);
 vert_array.push(coords[triangles[i][1] - 1][1]);
 vert_array.push(vertices[triangles[i][3] - 1][0]);
 vert_array.push(vertices[triangles[i][3] - 1][1]);
 vert_array.push(vertices[triangles[i][3] - 1][2]);
 vert_array.push(normals[triangles[i][5] - 1][0]);
 vert_array.push(normals[triangles[i][5] - 1][1]);
 vert_array.push(normals[triangles[i][5] - 1][2]);
 vert_array.push(coords[triangles[i][4] - 1][0]);
 vert_array.push(coords[triangles[i][4] - 1][1]);
 vert_array.push(vertices[triangles[i][6] - 1][0]);
 vert_array.push(vertices[triangles[i][6] - 1][1]);
 vert_array.push(vertices[triangles[i][6] - 1][2]);
 vert_array.push(normals[triangles[i][8] - 1][0]);
 vert_array.push(normals[triangles[i][8] - 1][1]);
 vert_array.push(normals[triangles[i][8] - 1][2]);
 vert_array.push(coords[triangles[i][7] - 1][0]);
 vert_array.push(coords[triangles[i][7] - 1][1]);
 }
 points=triangles.length*3;
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vert_array), gl.STATIC_DRAW);
 }





function start() {


            const canvas = document.getElementById("my_canvas");
			//Inicialize the GL contex
            gl = canvas.getContext("webgl2");


//*****************pointer lock object forking for cross browser**********************

canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;


canvas.onclick = function() {
 canvas.requestPointerLock();
};

// Hook pointer lock state change events for different browsers
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
    console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", ustaw_kamere_mysz, false);
  } else {
    console.log('The pointer lock status is now unlocked');  
    document.removeEventListener("mousemove", ustaw_kamere_mysz, false);
  }
}

//****************************************************************

			if (gl === null) {
				alert("Unable to initialize WebGL. Your browser or machine may not support it.");
			//return;
			}

			   console.log("WebGL version: " + gl.getParameter(gl.VERSION));
            console.log("GLSL version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
            console.log("Vendor: " + gl.getParameter(gl.VENDOR));


            const vs = gl.createShader(gl.VERTEX_SHADER);
            const fs = gl.createShader(gl.FRAGMENT_SHADER);
            const program = gl.createProgram();

		const vsSource = 
			`#version 300 es
            precision highp float;
            in vec3 position;
				in vec3 color;
				uniform mat4 model;
				uniform mat4 view;
				uniform mat4 proj;				
				in vec2 aTexCoord;
				out vec2 TexCoord;
			
				out vec3 Color;


            void main(void)
            {
            TexCoord = aTexCoord;
				Color = color;

				
				    gl_Position = proj * view * model * vec4(position, 1.0);
            }`;

			const fsSource = 
			`#version 300 es
            precision highp float;
			   in vec3 Color;
            out vec4 frag_color;
            in vec2 TexCoord;
				uniform sampler2D texture1;
				uniform sampler2D texture2;

            void main(void)
            {
            	
            //frag_color = mix(texture(texture1, TexCoord), texture(texture2, TexCoord),0.5);

				
				frag_color = texture(texture2, TexCoord);
				//  frag_color = vec4(Color, 1.0);
                //frag_color = vec4(1.0, 0.5, 0.25, 1.0);
            }`;

//compilation vs
		gl.shaderSource(vs, vsSource);		
		gl.compileShader(vs);
		if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
                {
                    alert(gl.getShaderInfoLog(vs));
                }

//compilation fs
		gl.shaderSource(fs, fsSource);     
		gl.compileShader(fs);
		if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
                {
                    alert(gl.getShaderInfoLog(fs));
                }

            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);

            if(!gl.getProgramParameter(program, gl.LINK_STATUS))
            {
                alert(gl.getProgramInfoLog(program));
            }

                gl.useProgram(program);

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);


						var n_draw=3;
						kostka();
						


// dane wierzchołkowe -------------------------------------------------------------------------

            const positionAttrib = gl.getAttribLocation(program, "position");
            gl.enableVertexAttribArray(positionAttrib);
            gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 8*4, 0);
            
            const colorAttrib = gl.getAttribLocation(program, "color");
            gl.enableVertexAttribArray(colorAttrib);
            gl.vertexAttribPointer(colorAttrib, 3, gl.FLOAT, false, 8*4, 3*4);

            const texCoord = gl.getAttribLocation(program, "aTexCoord");
            gl.enableVertexAttribArray(texCoord);
            gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 8*4, 6*4);

            
//-----------------------------------------------------------------------------------------------
						
						
				window.requestAnimationFrame(draw);
             

// Ustawienia macierzy ---------------------------------------------------------------------------------------------------------

// macierz modelu *******************************************
 
 const model = mat4.create();
 let kat_obrotu = -25 * Math.PI / 180;   // in radians
  
  mat4.rotate(model,  model,  kat_obrotu,   [0, 0, 1]);    

	let uniModel = gl.getUniformLocation(program, 'model');       
	gl.uniformMatrix4fv( uniModel, false, model);

//****************************************************************

// macierz widoku *******************************************
 
  const view = mat4.create(); 
 

	mat4.lookAt(view, [0,0,3], [0,0,-1], [0,1,0]);

	let uniView = gl.getUniformLocation(program, 'view');       
	gl.uniformMatrix4fv( uniView, false, view);


//***************************************************************
	
// macierz projekcji *******************************************
 const proj = mat4.create();
  
  mat4.perspective(proj, 60 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0 );

   let uniProj = gl.getUniformLocation(program, 'proj');       
	gl.uniformMatrix4fv( uniProj, false, proj);

//***************************************************************

//----------------------------------------------------------------------------------------------------------------------------------------------
		

	
	
	// var uniColor_loc = gl.getUniformLocation(program, 'uniColor');
    //const maincolor = [1.0,1.0,1.0];
	// gl.uniform3fv(uniColor_loc,new Float32Array(maincolor));



var pressedKey = {};
window.onkeyup = function(e) { pressedKey[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKey[e.keyCode] = true; }

function ustaw_kamere() {

let cameraSpeed = 0.002*elapsedTime;


	if (pressedKey["38"]) //Up
	{
		cameraPos.x+=cameraSpeed * cameraFront.x;
		cameraPos.y+=cameraSpeed * cameraFront.y;
		cameraPos.z+=cameraSpeed * cameraFront.z;
	}

	if (pressedKey["40"]) //Down
	{
		cameraPos.x-=cameraSpeed * cameraFront.x;
		cameraPos.y-=cameraSpeed * cameraFront.y;
		cameraPos.z-=cameraSpeed * cameraFront.z;
	}

	if (pressedKey["37"]) //Left
	{
		let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
		cameraPos.x-=cameraPos_tmp.x * cameraSpeed;
		cameraPos.y-=cameraPos_tmp.y * cameraSpeed;
		cameraPos.z-=cameraPos_tmp.z * cameraSpeed;     
     // obrot -= cameraSpeed;
	  // cameraFront.x =  Math.sin(obrot);
	 //  cameraFront.z = -Math.cos(obrot);
	}
  		
	if (pressedKey["39"]) //Right
	{
		let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
		cameraPos.x+=cameraPos_tmp.x * cameraSpeed;
		cameraPos.y+=cameraPos_tmp.y * cameraSpeed;
		cameraPos.z+=cameraPos_tmp.z * cameraSpeed;     

      //obrot += cameraSpeed;
		//cameraFront.x =  Math.sin(obrot);
		//cameraFront.z = -Math.cos(obrot);
	}


	let cameraFront_tmp = glm.vec3(1,1,1);

	cameraFront_tmp.x = cameraPos.x+cameraFront.x;
	cameraFront_tmp.y = cameraPos.y+cameraFront.y;
	cameraFront_tmp.z = cameraPos.z+cameraFront.z;
  

    mat4.lookAt(view, cameraPos, cameraFront_tmp, cameraUp);	    
	gl.uniformMatrix4fv( uniView, false, view);



}

let x = 50;
let y = 50;
let yaw =-90;  //------------------
let pitch=0;


function ustaw_kamere_mysz(e) {

//				console.log("x="+x+" y="+y);


	let xoffset = e.movementX;
	let yoffset = e.movementY;


	let sensitivity = 0.1;
	let cameraSpeed = 0.05*elapsedTime;

	xoffset *= sensitivity;
	yoffset *= sensitivity;


	yaw += xoffset * cameraSpeed;
   pitch -= yoffset*cameraSpeed;


	if (pitch > 89.0)
		pitch = 89.0;
	if (pitch < -89.0)
		pitch = -89.0;
		

	let front = glm.vec3(1,1,1);


	front.x = Math.cos(glm.radians(yaw))*Math.cos(glm.radians(pitch));
	front.y = Math.sin(glm.radians(pitch));
	front.z = Math.sin(glm.radians(yaw)) * Math.cos(glm.radians(pitch));
	cameraFront = glm.normalize(front);


}



//texture1   *****************************************************************************
  const texture1 = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture1);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();

  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);
    
       gl.generateMipmap(gl.TEXTURE_2D);
    
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 //      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 //      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        
    
  };
  image.crossOrigin = ""; 
  image.src = "https://cdn.pixabay.com/photo/2012/03/03/23/06/wall-21534_960_720.jpg";

//************************************************************************************
//texture2   *****************************************************************************
  const texture2 = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture2);

 
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image2 = new Image();

   image2.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image2);
    
       gl.generateMipmap(gl.TEXTURE_2D);
    
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 //       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 //      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);       
    
  };
  image2.crossOrigin = ""; 
  image2.src = "https://cdn.pixabay.com/photo/2012/03/03/23/06/wall-21534_960_720.jpg";
//************************************************************************************



	gl.uniform1i(gl.getUniformLocation(program, "texture1"), 1); // set it manually
	gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0); // set it manually



function StereoProjection(_left, _right, _bottom, _top, _near, _far, _zero_plane, _dist, _eye)
 {
 //    Perform the perspective projection for one eye's subfield.
 //    The projection is in the direction of the negative z-axis.
 //            _left=-6.0;
 //            _right=6.0;
 //            _bottom=-4.8;
 //             _top=4.8;
 //    [default: -6.0, 6.0, -4.8, 4.8]
 //    left, right, bottom, top = the coordinate range, in the plane of zero parallax setting,
 //         which will be displayed on the screen.
 //         The ratio between (right-left) and (top-bottom) should equal the aspect
 //    ratio of the display.
   //                  _near=6.0;
   //                  _far=-20.0;
 //    [default: 6.0, -6.0]
 //    near, far = the z-coordinate values of the clipping planes.
   //                  _zero_plane=0.0;
 //    [default: 0.0]
 //    zero_plane = the z-coordinate of the plane of zero parallax setting.
 //    [default: 14.5]
  //                     _dist=10.5;
 //   dist = the distance from the center of projection to the plane of zero parallax.
 //    [default: -0.3]
  //                 _eye=-0.3;
 //    eye = half the eye separation; positive for the right eye subfield,
 //    negative for the left eye subfield.
 let   _dx = _right - _left;
 let   _dy = _top - _bottom;
 let   _xmid = (_right + _left) / 2.0;
 let   _ymid = (_top + _bottom) / 2.0;
 let   _clip_near = _dist + _zero_plane - _near;
 let   _clip_far = _dist + _zero_plane - _far;
 let  _n_over_d = (_clip_near / _dist);
 let   _topw = _n_over_d * _dy / 2.0;
 let   _bottomw = -_topw;
 let   _rightw = _n_over_d * (_dx / 2.0 - _eye); 
let   _leftw = _n_over_d * (-_dx / 2.0 - _eye);
 const proj = mat4.create();
 mat4.frustum(proj, _leftw, _rightw, _bottomw, _topw, _clip_near, _clip_far)
 mat4.translate(proj, proj, [-_xmid - _eye, -_ymid, 0]);  
let uniProj = gl.getUniformLocation(program, 'proj');       
gl.uniformMatrix4fv( uniProj, false, proj);
 }



let tryb = 1;
let separation = 0.05;
let prymityw=gl.TRIANGLES;
gl.enable(gl.DEPTH_TEST);


let licznik=0;
const fpsElem = document.querySelector("#fps");
let startTime=0;
let elapsedTime=0;

	    function draw()
            {
  
					elapsedTime = performance.now() - startTime; 
  
 				   startTime = performance.now();
 				   
					licznik++;
					let fFps = 1000 / elapsedTime;  
					
						if(licznik > fFps){	
							fpsElem.textContent = fFps.toFixed(1);
	
							licznik = 0;
						}					
					
					
					 ustaw_kamere();  

                gl.clearColor(0, 0, 0, 1);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  //              gl.drawArrays(prymityw, 0, n_draw);

				switch(tryb)
				{
					case 0:
						gl.viewport(0, 0, canvas.width, canvas.height); //cały obszar ekranu
       					 //More than 1 texture
 
						gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, texture2);
				
						gl.drawArrays(prymityw, 0, 12);
				
						//gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, texture1);
				
						gl.drawArrays(prymityw, 12, points);
						break;

					case 1:
						gl.viewport(0, 0, canvas.width, canvas.height); //cały obszar ekranu
       
						StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, -separation); //projekcja dla lewego oka
						gl.colorMask(true,false,false,false); //czerwony filtr
				
						gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, texture2);
				
						gl.drawArrays(prymityw, 0, 12);
				
						//gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, texture1);
				
						gl.drawArrays(prymityw, 12, points);
				
				
				
						gl.clear(gl.DEPTH_BUFFER_BIT);
						StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, separation); //projekcja dla prawego oka
						gl.colorMask(false,false,true,false); //niebieski filtr
						gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, texture2);
				
						gl.drawArrays(prymityw, 0, 12);
				
						//gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, texture1);
				
						gl.drawArrays(prymityw, 12, points);
						gl.colorMask(true,true,true,true);
				
						break;

					case 2:
						gl.viewport(0, 0, canvas.width/2, canvas.height); //cały obszar ekranu
       
						StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, -separation); //projekcja dla lewego oka
				
						gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, texture2);
				
						gl.drawArrays(prymityw, 0, 12);
				
						//gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, texture1);
				
						gl.drawArrays(prymityw, 12, points);
				
				
				
						gl.clear(gl.DEPTH_BUFFER_BIT);
						gl.viewport(canvas.width/2, 0, canvas.width/2, canvas.height); //cały obszar ekranu
						StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, separation); //projekcja dla prawego oka
						gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, texture2);
				
						gl.drawArrays(prymityw, 0, 12);
				
						//gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, texture1);
				
						gl.drawArrays(prymityw, 12, points);
						gl.colorMask(true,true,true,true);
						break;
				}


/*
	//load more than 1 texture in the same time
	   	gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture1);
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, texture2);

         gl.drawArrays(prymityw, 0, 36);
*/

		//More than 1 texture

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture2);

         gl.drawArrays(prymityw, 0, 12);

			//gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture1);

         gl.drawArrays(prymityw, 12, 24);
         








//setTimeout(() => { requestAnimationFrame(draw);}, 1000 / 10);

                window.requestAnimationFrame(draw);			
            }

let punkty = 24;
function kostka() {

	

	var vertices = [
	-0.5, -0.5, -0.5,  0.0, 0.0, 0.0,  0.0, 0.0,
	 0.5, -0.5, -0.5,  0.0, 0.0, 1.0,  1.0, 0.0,
	 0.5,  0.5, -0.5,  0.0, 1.0, 1.0,  1.0, 1.0,
	 0.5,  0.5, -0.5,  0.0, 1.0, 1.0,  1.0, 1.0,
	-0.5,  0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 1.0,
	-0.5, -0.5, -0.5,  0.0, 0.0, 0.0,  0.0, 0.0,

	-0.5, -0.5,  0.5,  0.0, 0.0, 0.0,  0.0, 0.0,
	 0.5, -0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 0.0,
	 0.5,  0.5,  0.5,  1.0, 1.0, 1.0,  1.0, 1.0,
	 0.5,  0.5,  0.5,  1.0, 1.0, 1.0,  1.0, 1.0,
	-0.5,  0.5,  0.5,  0.0, 1.0, 0.0,  0.0, 1.0,
	-0.5, -0.5,  0.5,  0.0, 0.0, 0.0,  0.0, 0.0,

	-0.5,  0.5,  0.5,  1.0, 0.0, 1.0,  0.0, 0.0,
	-0.5,  0.5, -0.5,  1.0, 1.0, 1.0,  1.0, 0.0,
	-0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  1.0, 1.0,
	-0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  1.0, 1.0,
	-0.5, -0.5,  0.5,  0.0, 0.0, 0.0,  0.0, 1.0,
	-0.5,  0.5,  0.5,  1.0, 0.0, 1.0,  0.0, 0.0,

	 0.5,  0.5,  0.5,  1.0, 0.0, 1.0,  0.0, 0.0,
	 0.5,  0.5, -0.5,  1.0, 1.0, 1.0,  1.0, 0.0,
	 0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  1.0, 1.0,
	 0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  1.0, 1.0,
	 0.5, -0.5,  0.5,  0.0, 0.0, 0.0,  0.0, 1.0,
	 0.5,  0.5,  0.5,  1.0, 0.0, 1.0,  0.0, 0.0,

	-0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 0.0,
	 0.5, -0.5, -0.5,  1.0, 1.0, 1.0,  1.0, 0.0,
	 0.5, -0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 1.0,
	 0.5, -0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 1.0,
	-0.5, -0.5,  0.5,  0.0, 0.0, 0.0,  0.0, 1.0,
	-0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 0.0,

	-0.5,  0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 0.0,
	 0.5,  0.5, -0.5,  1.0, 1.0, 1.0,  1.0, 0.0,
	 0.5,  0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 1.0,
	 0.5,  0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 1.0,
	-0.5,  0.5,  0.5,  0.0, 0.0, 0.0,  0.0, 1.0,
	-0.5,  0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 0.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	
	//n_draw=punkty_;
}

/*
			window.addEventListener('mousemove', e => {
			    //drawLine(context, x, y, e.offsetX, e.offsetY);
			    x = e.offsetX;
			    y = e.offsetY;
				//console.log("x="+x+" y="+y);
				//n=y+1;
				//z=x;
				 //rysunek(z,y)
			});
*/


let cameraPos = glm.vec3(0,0,3);
let cameraFront = glm.vec3(0,0,-1);
let cameraUp = glm.vec3(0,1,0);
let obrot=0.0;



window.addEventListener('keydown', function(event) {


switch (event.keyCode) {

	case 48: // 0
	 tryb=0;        
	break;
  	
    case 49: // 1
     //prymityw=gl.LINES;     
	 tryb=1;   
    break;

    case 50: // 2
     //prymityw=gl.LINE_LOOP; 
	 tryb=2;
    break;  	
  		
    case 51: // 3
     prymityw=gl.LINE_STRIP; 
    break;

    case 52: // 4
     prymityw=gl.TRIANGLES;
    break;

    case 53: // 5
     prymityw=gl.TRIANGLE_STRIP; 
    break;

    case 54: // 6
     prymityw=gl.TRIANGLE_FAN; 
    break;

   case 68: // d
   if (gl.isEnabled(gl.DEPTH_TEST))
		gl.disable(gl.DEPTH_TEST);
	else     
      gl.enable(gl.DEPTH_TEST);
    break;

 case 27: // d
   	if (confirm("Close Window?")) 
    close();
    break;
  

  }
  
  
  

 
  
}, false);



}

/*

// Add the event listeners for mousedown, mousemove, and mouseup
window.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
   alert(x);
   alert(y);


});
*/

/*window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    //drawLine(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});*/



