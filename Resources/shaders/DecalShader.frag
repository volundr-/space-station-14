uniform sampler2D sampler;

uniform vec4 decalParms1[10];
uniform vec4 decalParms2[10];

varying vec4 Color;

vec2 ATXC(int i)
{
	return vec2(mul((gl_TexCoord[0].x - decalParms1[i].x), decalParms2[i].x) + decalParms2[i].z, (mul((gl_TexCoord[0].y - decalParms1[i].y) , decalParms2[i].y) + decalParms2[i].w);
}

vec4 DecalColor(vec2 coor)
{
	return texture2D(sampler,coor);
}


vec4 computeColor(vec2 atlasCoord, float baseAlpha, int i)
{
   vec4 temp = clamp(vec4(gl_TexCoord[0].x - decalParms1[i].x,
						  decalParms1[i].z - gl_TexCoord[0].x,
				 		  gl_TexCoord[0].y - decalParms1[i].y,
				 		  decalParms1[i].w - gl_TexCoord[0].y),
				 	 0.0,1.0);

    int inbounds = int(clamp((temp.x+temp.y+temp.z+temp.w),0.0,1.0));

	vec4 decalColor = DecalColor(atlasCoord);
	return vec4(decalColor.xyz, decalColor.w *baseAlpha *inbounds); 

}

vec4 DecalShader()
{
	vec2 ATXCoord;
	
	vec4 outputColor = texture2D(sampler,gl_TexCoord[0]);
	
	vec4 decalColor = 0;
	vec4 tempColor = 0;	
	
	float numColors = 0;
	
	for(int i = 0; i < 5; i++)
	{
		ATXCoord = ATXC(i);
		tempColor = computeColor(ATXCoord,outputColor.w ,i);
		float purple = ceil(clamp(length(tempColor.xyz - vec3(1,0,1)),0.0,1.0));
		tempColor = decalColor + (tempColor * purple);
		numColors =  numColors + int(tempColor.w);
		decalColor = tempColor;
		
	}
	
	decalColor = (decalColor * numColors);
	
	
	
	return outputColor + decalColor;

}



void main()
{	
	gl_FragColor = Color;
}