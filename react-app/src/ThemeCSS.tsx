import colors from './colors.json';
import widgetconfig from './widgetconfig.json';


const COLORS: any = colors;



//change theme colour to colour name/code you wish to, to see effect. PS: You can also use colors.COLOUR_NAME.name (e.g. colors.blue.name) to get colour hints
const THEME_COLOR: string = widgetconfig.themeColor || 'rgb(145, 0, 145)',
      DROPDOWN_BGCOLOR: string = widgetconfig.dropdownBg || 'white',
      GRAPH_TABLINK_COLOR: string = widgetconfig.graphTablinkColor || '', //suggested: yellow
      GRAPH_TABLINK_HOVER_BG: string = widgetconfig.graphTablinkHoverBg || ''; //suggested: rgb(32, 199, 245)



let cssProps: any = {};

cssProps.themeBg = THEME_COLOR;
cssProps.themeHoverBg = getColor([-25, -25, -25]).variant;

let toggleBarBg = getColor([0, 0, 0]);

cssProps.toggleBarBg = toggleBarBg.rgbVal.reduce((a, b) => a + b) < 475 ? 'white' : 'black';
cssProps.dropdownBg = DROPDOWN_BGCOLOR;

let dropdownBg = getColor([0, 0, 0], cssProps.dropdownBg);

cssProps.dropdownColor = dropdownBg.rgbVal.reduce((a, b) => a + b) < 475 ? 'white' : 'black';
cssProps.activeTablinkColor = toggleBarBg.rgbVal.reduce((a, b) => a + b) > 510 ? 
                              getColor([-48, -48, -48]).variant : toggleBarBg.variant;
cssProps.graphTabLinkBg = THEME_COLOR;
cssProps.graphTablinkHoverBg = GRAPH_TABLINK_HOVER_BG || 
                               getColor([-133, 179, 90], cssProps.themeBg).variant;
cssProps.graphTablinkColor = GRAPH_TABLINK_COLOR || 
                             getColor([223, 56, -245], cssProps.graphTablinkHoverBg).variant;
cssProps.tablinkBg = getColor([45, 80, 45]).variant;
cssProps.tablinkHoverBg = getColor([20, 20, 20], cssProps.tablinkBg).variant;
cssProps.tablinkColor = toggleBarBg.rgbVal.reduce((a, b) => a + b) > 510 ?
                        getColor([-12, -12, -12]).variant : getColor([-12, -12, -12], cssProps.dropdownBg).variant;
cssProps.tablinkHoverColor = getColor([12, 12, 12], cssProps.tablinkColor).variant;
cssProps.itemHoverBg = getColor([-12, -12, -12], cssProps.dropdownBg).variant;
cssProps.itemBorderBottomColor = getColor([-20, -20, -20], cssProps.dropdownBg).variant;
cssProps.itemBorderBottomHoverColor = getColor([-20, -20, -20], cssProps.itemBorderBottomColor).variant;
cssProps.graphWrapperBg = getColor([-13, -13, -13], cssProps.dropdownBg).variant;
cssProps.graphBg = cssProps.dropdownBg;
cssProps.graphBorderColor = getColor([-26, -26, -26], cssProps.dropdownBg).variant;
cssProps.graphCurrentNodeBg = getColor([25, 25, 25]).variant;
cssProps.graphCurrentNodeBorderColor = THEME_COLOR;
cssProps.graphParentNodesBg = getColor([0, 0, 0], cssProps.graphTablinkHoverBg).variant;
cssProps.graphParentNodesBorderColor = getColor([-20, -20, -20], cssProps.graphParentNodesBg).variant;
cssProps.graphNetworkRequiredEdgeColor = widgetconfig.graphNetworkRequiredEdgeColor || 'darkorange';
cssProps.graphNetworkRecommendedEdgeColor = widgetconfig.graphNetworkRecommendedEdgeColor || '#009100';



export default function getThemeCSSText(): string
{
  return ThemeCSSText(cssProps);
}



export function getCSSProps()
{
  return cssProps;
}



export function getColor(rgbDiff: number[], color: string = THEME_COLOR): {variant: string; rgbVal: number[];}
{
  if (rgbDiff.length !== 3)
    throw new Error('rgbDiff expects three values.');
  
  let rgbVal: number[],
      r: number,
      g: number,
      b: number,
      variant: string;

  if (/^[a-zA-Z]{3,}$/i.test(color) && COLORS[color])
    rgbVal = COLORS[color].rgbVal;
  else if (/^#[0-9a-f]{3,6}$/i.test(color))
    rgbVal = color.replace(/#([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})/ig, '$1 $2 $3')
                .split(' ').map((hex) => Number(parseInt(hex, 16).toString(10)));
  else if (/^rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)$/i.test(color))
    rgbVal = color.replace(/.*\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/, '$1 $2 $3')
                .split(' ').map((val: string) => Number(val));
  else throw new Error(`Invalid colour code/name, '${color}'`);

  [r, g, b] = rgbVal.map((val, i) => val + rgbDiff[i]);
  variant = `rgb(${r >= 0 ? (r > 255 ? 255 : r) : 0}, ${g >= 0 ? (g > 255 ? 255 : g) : 0}, ${b >= 0 ? (b > 255 ? 255 : b) : 0})`;

  return {
    variant: String(variant),
    rgbVal: rgbVal
  }
}



function ThemeCSSText(cssProps: any): string
{
  let cssText = `
    .widget .dropdown 
    { 
      color: ${cssProps.dropdownColor};
      background: ${cssProps.dropdownBg};
      border-color: ${cssProps.tablinkBg};
    }
    
    .widget .dropdown-toggle-bar 
    {
      background: ${cssProps.themeBg};
      color: ${cssProps.toggleBarBg};
    }
    
    .widget .dropdown-toggle-bar:hover 
    { background: ${cssProps.themeHoverBg}; }
    
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
    { background: ${cssProps.themeHoverBg}; }
    
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
    
    .widget .tabs-wrapper ul .graph-wrapper #graph-key .key-current 
    { background: ${cssProps.graphCurrentNodeBg}; }
    
    .widget .tabs-wrapper ul .graph-wrapper #graph-key .key-other 
    { background: ${cssProps.graphParentNodesBg}; }

    .widget .tabs-wrapper ul .graph-wrapper #graph-key .key-line-recommended {
      background: ${cssProps.graphNetworkRecommendedEdgeColor};
    }

    .widget .tabs-wrapper ul .graph-wrapper #graph-key .key-line-required {
      background: ${cssProps.graphNetworkRequiredEdgeColor};
    }
    
    .useCustomScrollBar::-webkit-scrollbar-track 
    { background: ${cssProps.tablinkBg}; }
    
    .useCustomScrollBar::-webkit-scrollbar-thumb 
    { background: ${cssProps.themeHoverBg}; }
  `;

  return cssText;
}



