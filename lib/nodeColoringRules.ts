/**
 * Prism Writing - Node Coloring and Categorization Rules
 * 
 * This system automatically categorizes and colors nodes based on their content,
 * type, and relationships to create a visually meaningful knowledge graph.
 */

export interface ColorRule {
  pattern: RegExp | string;
  color: string;
  category: string;
  description: string;
}

// Prismatic color palette following Prism Writing brand
export const PRISM_COLORS = {
  // Purple family - Entities, Organizations
  PURPLE: '#a855f7',
  VIOLET: '#8b5cf6',
  LAVENDER: '#c084fc',
  
  // Pink family - People, Leaders
  PINK: '#ec4899',
  HOT_PINK: '#f472b6',
  ROSE: '#fb7185',
  
  // Cyan family - Locations, Geography
  CYAN: '#06b6d4',
  BRIGHT_CYAN: '#22d3ee',
  LIGHT_CYAN: '#2dd4bf',
  
  // Blue family - Concepts, Ideas
  BLUE: '#3b82f6',
  SKY: '#0ea5e9',
  LIGHT_BLUE: '#38bdf8',
  
  // Magenta family - Events, Actions
  MAGENTA: '#c026d3',
  FUCHSIA: '#d946ef',
  PINK_PURPLE: '#e879f9',
  
  // Indigo family - Policies, Systems
  INDIGO: '#6366f1',
  PERIWINKLE: '#818cf8',
  LIGHT_PURPLE: '#a78bfa',
  
  // Teal family - Technology, Innovation
  TEAL: '#14b8a6',
  
  // Green family - Positive, Growth
  EMERALD: '#34d399',
  GREEN: '#4ade80',
  
  // Amber family - Warnings, Important
  AMBER: '#fbbf24',
  
  // Default
  DEFAULT: '#e879f9',
};

// Node categorization rules (order matters - first match wins)
export const NODE_COLOR_RULES: ColorRule[] = [
  // Countries & Nations
  { pattern: /\b(U\.S\.A|United States|America|China|Russia|India|Brazil|Canada|Mexico|Japan|Germany|France|UK|Italy|Spain|Australia|Korea|Indonesia|Thailand|Vietnam|Philippines|Malaysia|Singapore|Argentina|Chile|Colombia|Peru|Venezuela|Ecuador|Bolivia|Uruguay|Paraguay|Egypt|South Africa|Nigeria|Kenya|Ghana|Saudi Arabia|UAE|Israel|Turkey|Iran|Iraq|Pakistan|Bangladesh|Afghanistan|Ukraine|Poland|Romania|Sweden|Norway|Denmark|Finland|Netherlands|Belgium|Switzerland|Austria|Greece|Portugal|Ireland|New Zealand|Taiwan|Hong Kong)\b/i, color: PRISM_COLORS.CYAN, category: 'Country', description: 'Nation states and countries' },
  
  // Regions & Continents
  { pattern: /\b(Americas|Europe|Asia|Africa|Middle East|Latin America|North America|South America|Central America|Caribbean|Pacific|Atlantic|Mediterranean|Balkans|Scandinavia|Western Europe|Eastern Europe|Southeast Asia|East Asia|South Asia|Central Asia)\b/i, color: PRISM_COLORS.LIGHT_CYAN, category: 'Region', description: 'Geographic regions and continents' },
  
  // Cities
  { pattern: /\b(Washington|Moscow|Beijing|Tokyo|London|Paris|Berlin|Rome|Madrid|New Delhi|Brasilia|Ottawa|Mexico City|Seoul|Bangkok|Hanoi|Manila|Jakarta|Singapore|Buenos Aires|Santiago|Bogota|Lima|Caracas|Cairo|Johannesburg|Lagos|Nairobi|Riyadh|Dubai|Tel Aviv|Istanbul|Tehran|Kiev|Warsaw)\b/i, color: PRISM_COLORS.BRIGHT_CYAN, category: 'City', description: 'Major cities' },
  
  // Political Leaders & Presidents
  { pattern: /\b(President|Prime Minister|Chancellor|King|Queen|Emperor|Sultan|Emir|Leader|Chairman|Secretary|Minister|Governor|Mayor|Senator|Representative|Congressman|Delegate)\b/i, color: PRISM_COLORS.PINK, category: 'Leader', description: 'Political leaders and officials' },
  
  // Specific Leaders (add more as needed)
  { pattern: /\b(Biden|Trump|Putin|Xi Jinping|Modi|Macron|Scholz|Trudeau|López Obrador|Bukele|Zelenskyy|Erdogan|Netanyahu|Khamenei|Kim Jong Un|Moon Jae-in|Bolsonaro|Lula|Milei)\b/i, color: PRISM_COLORS.HOT_PINK, category: 'NamedLeader', description: 'Named political leaders' },
  
  // Organizations - International
  { pattern: /\b(UN|United Nations|NATO|EU|European Union|WHO|IMF|World Bank|WTO|OPEC|G7|G20|ASEAN|African Union|OAS|Arab League|BRICS)\b/i, color: PRISM_COLORS.PURPLE, category: 'IntlOrganization', description: 'International organizations' },
  
  // Organizations - Government
  { pattern: /\b(Congress|Senate|Parliament|House|Assembly|Council|Court|Department|Agency|Ministry|Bureau|Commission|Committee)\b/i, color: PRISM_COLORS.VIOLET, category: 'GovtOrganization', description: 'Government bodies' },
  
  // Political Parties & Movements
  { pattern: /\b(Democratic|Republican|Conservative|Labour|Liberal|Socialist|Communist|Green|Nationalist|Populist|Party|Movement|Coalition|Alliance)\b/i, color: PRISM_COLORS.LAVENDER, category: 'PoliticalParty', description: 'Political parties and movements' },
  
  // Events & Actions
  { pattern: /\b(Election|Summit|Conference|Treaty|Agreement|War|Conflict|Revolution|Coup|Protest|Crisis|Referendum|Vote|Negotiation|Meeting|Rally)\b/i, color: PRISM_COLORS.MAGENTA, category: 'Event', description: 'Political events and actions' },
  
  // Policies & Systems
  { pattern: /\b(Policy|Law|Act|Bill|Constitution|Reform|Strategy|Initiative|Program|Plan|Regulation|Sanction|Tariff|Trade|Immigration|Healthcare|Education|Defense|Security)\b/i, color: PRISM_COLORS.INDIGO, category: 'Policy', description: 'Policies and systems' },
  
  // Economic Concepts
  { pattern: /\b(Economy|GDP|Market|Trade|Export|Import|Investment|Inflation|Debt|Budget|Tax|Finance|Banking|Currency|Dollar|Euro|Yuan|Peso)\b/i, color: PRISM_COLORS.AMBER, category: 'Economic', description: 'Economic concepts' },
  
  // Technology & Innovation
  { pattern: /\b(Technology|AI|Artificial Intelligence|Blockchain|Crypto|Digital|Cyber|Internet|Data|Cloud|Innovation|Science|Research)\b/i, color: PRISM_COLORS.TEAL, category: 'Technology', description: 'Technology and innovation' },
  
  // Social Issues
  { pattern: /\b(Climate|Environment|Human Rights|Democracy|Freedom|Justice|Equality|Poverty|Migration|Refugee|Pandemic|Health|COVID)\b/i, color: PRISM_COLORS.EMERALD, category: 'SocialIssue', description: 'Social and environmental issues' },
  
  // Military & Security
  { pattern: /\b(Military|Army|Navy|Air Force|Defense|Security|Intelligence|CIA|FBI|NSA|Pentagon|Weapon|Nuclear|Missile|Drone)\b/i, color: PRISM_COLORS.ROSE, category: 'Military', description: 'Military and security' },
  
  // Media & Communication
  { pattern: /\b(Media|Press|News|Journalism|Propaganda|Social Media|Facebook|Twitter|YouTube|TikTok|Information|Communication)\b/i, color: PRISM_COLORS.BLUE, category: 'Media', description: 'Media and communication' },
  
  // Ideologies & Concepts
  { pattern: /\b(Democracy|Authoritarianism|Capitalism|Socialism|Communism|Fascism|Liberalism|Conservatism|Nationalism|Globalism|Ideology|Doctrine|Philosophy)\b/i, color: PRISM_COLORS.PERIWINKLE, category: 'Ideology', description: 'Political ideologies and philosophies' },
];

/**
 * Categorize and color a node based on its label and metadata
 */
export function categorizeNode(label: string, existingCategory?: string): { color: string; category: string; description: string } {
  // Clean label - remove markdown formatting
  const cleanLabel = label.replace(/\*\*/g, '').replace(/\[\[.*?\]\]/g, '').trim();
  
  // Check against rules
  for (const rule of NODE_COLOR_RULES) {
    if (typeof rule.pattern === 'string') {
      if (cleanLabel.toLowerCase().includes(rule.pattern.toLowerCase())) {
        return { color: rule.color, category: rule.category, description: rule.description };
      }
    } else {
      if (rule.pattern.test(cleanLabel)) {
        return { color: rule.color, category: rule.category, description: rule.description };
      }
    }
  }
  
  // Use existing category color if it's a hex color
  if (existingCategory && existingCategory.startsWith('#')) {
    return { color: existingCategory, category: 'Custom', description: 'Custom categorized node' };
  }
  
  // Default
  return { color: PRISM_COLORS.DEFAULT, category: 'General', description: 'General concept or entity' };
}

/**
 * Clean and format node label for display
 */
export function formatNodeLabel(label: string): string {
  return label
    .replace(/\*\*/g, '')           // Remove markdown bold
    .replace(/\[\[.*?\]\]/g, '')    // Remove wiki links
    .replace(/\n/g, ' ')            // Replace newlines with spaces
    .trim()
    .substring(0, 100);             // Limit length
}

/**
 * Generate size based on connections and importance
 */
export function calculateNodeSize(connectionCount: number, isImportant: boolean = false): number {
  const baseSize = 1;
  const connectionBonus = Math.min(connectionCount * 0.1, 1); // Max +1 from connections
  const importanceBonus = isImportant ? 0.5 : 0;
  
  return baseSize + connectionBonus + importanceBonus;
}
