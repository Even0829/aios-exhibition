import type {CSSProperties} from 'react';
export interface StrandsProps {
 colors?:string[]; count?:number; speed?:number; amplitude?:number; waviness?:number;
 thickness?:number; glow?:number; taper?:number; spread?:number; hueShift?:number;
 intensity?:number; saturation?:number; opacity?:number; scale?:number; glass?:boolean;
 refraction?:number; dispersion?:number; glassSize?:number; className?:string; style?:CSSProperties;
}
export default function Strands(props:StrandsProps):import('react').ReactElement;
