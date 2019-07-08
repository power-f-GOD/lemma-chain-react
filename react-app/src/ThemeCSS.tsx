import _colors from './colors.json';

let colors: any = _colors;



//change theme colour to colour name/code you wish to see effect
const THEME_COLOR: string = _colors.blue.name;

const DROPDOWN_BGCOLOR: string = '#ffffff',
      GRAPH_TABLINK_COLOR: string = 'yellow',
      GRAPH_TABLINK_HOVER_BG: string = 'rgb(32, 199, 245)';



let cssProps: any = {};

cssProps.themeBg = THEME_COLOR;
cssProps.themeBgHover = getColorVariant([-29, -29, -29]).variant;

let toggleBarBg = getColorVariant([0, 0, 0]);

console.log(toggleBarBg.rgbVals.reduce((a, b) => a + b))
cssProps.toggleBarBg = toggleBarBg.rgbVals.reduce((a, b) => a + b) < 475 ? 'white' : 'black';
cssProps.dropdownBg = DROPDOWN_BGCOLOR;

let dropdownBg = getColorVariant([0, 0, 0], cssProps.dropdownBg);

cssProps.dropdownColor = dropdownBg.rgbVals.reduce((a, b) => a + b) < 475 ? 'white' : 'black';
cssProps.activeElBg = cssProps.dropdownBg;
console.log(toggleBarBg.rgbVals.reduce((a, b) => a + b))
cssProps.activeTablinkColor = toggleBarBg.rgbVals.reduce((a, b) => a + b) > 510 ? getColorVariant([-48, -48, -48]).variant : toggleBarBg.variant;
cssProps.graphTabLinkBg = THEME_COLOR;
cssProps.graphTablinkColor = GRAPH_TABLINK_COLOR;
cssProps.graphTablinkHoverBg = GRAPH_TABLINK_HOVER_BG;
cssProps.tablinkBg = getColorVariant([65, 100, 65]).variant;
cssProps.tablinkHoverBg = getColorVariant([90, 125, 90]).variant;
cssProps.tablinkColor = toggleBarBg.rgbVals.reduce((a, b) => a + b) > 510 ? getColorVariant([-12, -12, -12]).variant : getColorVariant([-12, -12, -12], cssProps.dropdownBg).variant;
cssProps.tablinkHoverColor = getColorVariant([-24, -24, -24], cssProps.tablinkColor).variant;
cssProps.itemHoverBg = getColorVariant([-12, -12, -12], cssProps.dropdownBg).variant;
cssProps.itemBorderBottomColor = getColorVariant([-20, -20, -20], cssProps.dropdownBg).variant;
cssProps.itemBorderBottomHoverColor = getColorVariant([-20, -20, -20], cssProps.itemBorderBottomColor).variant;
cssProps.graphWrapperBg = getColorVariant([-13, -13, -13], cssProps.dropdownBg).variant;
cssProps.graphBg = cssProps.dropdownBg;
cssProps.graphBorderColor = getColorVariant([-26, -26, -26], cssProps.dropdownBg).variant;
cssProps.graphCurrentNodeBg = getColorVariant([15, 18, 15]).variant;
cssProps.graphCurrentNodeBorderColor = THEME_COLOR;
cssProps.graphParentNodesBg = getColorVariant([-10, -10, -10], cssProps.tablinkHoverBg).variant;
cssProps.graphParentNodesBorderColor = getColorVariant([-20, -20, -20], cssProps.graphParentNodesBg).variant;



export default function getThemeCSSText(): string
{
  return ThemeCSSText(cssProps);
}



export function getCSSProps()
{
  return cssProps;
}



export function getColorVariant(rgbDiff: number[], color: string = THEME_COLOR): {variant: string; rgbVals: number[];}
{
  if (rgbDiff.length !== 3)
    throw new Error('rgbDiff expects three values.');
  
  let rgbVals: number[],
      r: number,
      g: number,
      b: number,
      variant: string;

  if (/^[a-zA-Z]{3,}$/i.test(color))
    rgbVals = colors[color].rgbVal;
  else if (/#[0-9a-f]{3,6}/i.test(color))
    rgbVals = color.replace(/#([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})/ig, '$1 $2 $3')
                .split(' ').map((hex) => Number(parseInt(hex, 16).toString(10)));
  else if (/rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)/i.test(color))
    rgbVals = color.replace(/.*\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/, '$1 $2 $3')
                .split(' ').map((val: string) => Number(val));
  else throw new Error(`Invalid colour code '${color}'`);

  [r, g, b] = rgbVals.map((val, i) => val + rgbDiff[i]);
  variant = `rgb(${r >= 0 ? (r > 255 ? 255 : r) : 0}, ${g >= 0 ? (g > 255 ? 255 : g) : 0}, ${b >= 0 ? (b > 255 ? 255 : b) : 0})`;

  return {
    variant: String(variant),
    rgbVals: rgbVals
  }
}



function ThemeCSSText(cssProps: any): string
{
  let cssText = `
    .widget .dropdown 
    { 
      color: ${cssProps.dropdownColor};
      background: ${cssProps.dropdownBg};
    }
    
    .widget .dropdown-toggle-bar 
    {
      background: ${cssProps.themeBg};
      color: ${cssProps.toggleBarBg};
    }
    
    .widget .dropdown-toggle-bar:hover 
    { background: ${cssProps.themeBgHover}; }
    
    .widget .tab-links-wrapper button 
    {
      color: ${cssProps.tablinkColor};
      background: ${cssProps.tablinkBg};
    }
    
    .widget .tab-links-wrapper button.back-btn 
    {
      background: ${cssProps.themeBg};
      color: ${cssProps.toggleBarBg} !important;
    }
    
    .widget .tab-links-wrapper button.back-btn:hover 
    { background: ${cssProps.themeBgHover}; }
    
    .widget .tab-links-wrapper button.graph-tab-link 
    {
      background: ${cssProps.graphTabLinkBg};
      color: ${cssProps.graphTablinkColor} !important;
    }
    
    .widget .tab-links-wrapper button.graph-tab-link:hover 
    { background: ${cssProps.graphTablinkHoverBg} !important; }
    
    .widget .tab-links-wrapper button[class^=active] 
    { background: ${cssProps.dropdownBg}; }
    
    .widget .tab-links-wrapper button.recommended-tab-link,
    .widget .tab-links-wrapper button.required-tab-link 
    { border-color: ${cssProps.tablinkBg}; }
    
    .widget .tab-links-wrapper button.recommended-tab-link:hover,
    .widget .tab-links-wrapper button.required-tab-link:hover {
      background: ${cssProps.tablinkHoverBg};
      color: ${cssProps.tablinkHoverColor} !important;
    }
    
    .widget .tab-links-wrapper button.recommended-tab-link.active-tab-link,
    .widget .tab-links-wrapper button.required-tab-link.active-tab-link
    {
      background: ${cssProps.dropdownBg};
      color: ${cssProps.activeTablinkColor} !important;
    }
    
    .widget .tabs-wrapper ul 
    { border-color: ${cssProps.tablinkBg}; }
    
    .widget .tabs-wrapper ul.tab .item-wrapper 
    { border-bottom: 1px solid ${cssProps.itemBorderBottomColor}; }
    
    .widget .tabs-wrapper ul.tab .item-wrapper:hover 
    {
      background: ${cssProps.itemHoverBg};
      border-bottom-color: ${cssProps.itemBorderBottomHoverColor};
    }
    
    .widget .tabs-wrapper ul .graph-wrapper 
    { background: ${cssProps.graphWrapperBg}; }

    .widget .tabs-wrapper ul .graph-wrapper #graph 
    {
      border: 1px solid ${cssProps.graphBorderColor};
      background: ${cssProps.dropdownBg};
    }
    
    .widget .tabs-wrapper ul .graph-wrapper .key-current 
    { background: ${cssProps.graphCurrentNodeBg}; }
    
    .widget .tabs-wrapper ul .graph-wrapper .key-required 
    { background: ${cssProps.graphParentNodesBg}; }
    
    .widget .tabs-wrapper ul .graph-wrapper .key-recommended 
    { background: ${cssProps.graphParentNodesBg}; }
    
    .widget .tabs-wrapper ul .graph-wrapper .key-alien
    { background: ${cssProps.graphParentNodesBg}; }
    
    .useCustomScrollBar::-webkit-scrollbar-track 
    { background: ${cssProps.tablinkBg}; }
    
    .useCustomScrollBar::-webkit-scrollbar-thumb 
    { background: ${cssProps.themeBgHover}; }
  `;

  return cssText;
}



