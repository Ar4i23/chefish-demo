import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const archiveRoot = resolve(process.argv[2] ?? '');

if (!archiveRoot || archiveRoot === projectRoot) {
  throw new Error('Pass the extracted asset archive directory as the first argument.');
}

const normalize = (value) => value
  .normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .toLocaleLowerCase('ru');

const findImage = (folder, terms) => {
  const absoluteFolder = join(archiveRoot, folder);
  const normalizedTerms = terms.map(normalize);
  const file = readdirSync(absoluteFolder).find((entry) => {
    if (!/\.(png|jpe?g)$/i.test(entry) || entry.startsWith('.')) return false;
    const normalizedName = normalize(entry);
    return normalizedTerms.every((term) => normalizedName.includes(term));
  });
  if (!file) throw new Error(`Image not found in ${folder}: ${terms.join(', ')}`);
  return join(absoluteFolder, file);
};

const images = [
  ['image_hero', ['три фирменных ролла'], 'assets/images/sections/hero-rolls.jpg', 1800, 84],
  ['images_section', ['свежего салата'], 'assets/images/sections/vegetables.jpg', 1700, 82],
  ['images_section', ['чесноком и зеленью'], 'assets/images/sections/sauce.jpg', 1700, 82],
  ['images_section', ['пряной курицы'], 'assets/images/sections/chicken.jpg', 1700, 82],
  ['images_section', ['сборка шаурмы'], 'assets/images/sections/assembly.jpg', 1700, 82],
  ['images_section', ['картофель фри', 'ледяная кола'], 'assets/images/sections/combo-banner.jpg', 1700, 82],
  ['menu_cards', ['кинематографичный шаурма-ролл'], 'assets/images/menu/chicken-shawarma.jpg', 920, 83],
  ['menu_cards', ['гурмэ-шаурма'], 'assets/images/menu/fish-shawarma.jpg', 920, 83],
  ['menu_cards', ['гриль-ролл с тунцом'], 'assets/images/menu/tuna-roll.jpg', 920, 83],
  ['menu_cards', ['креветочный ролл'], 'assets/images/menu/shrimp-roll.jpg', 920, 83],
  ['menu_cards', ['шаурма с хрустящими овощами'], 'assets/images/menu/pita-shawarma.jpg', 920, 83],
  ['menu_cards', ['хрустящий картофель'], 'assets/images/menu/fries.jpg', 920, 83],
  ['menu_cards', ['маринованные халапеньо'], 'assets/images/menu/jalapeno.jpg', 920, 83],
  ['menu_cards', ['охлажденная вода'], 'assets/images/menu/water.jpg', 920, 83],
  ['menu_cards', ['coca'], 'assets/images/menu/cola.jpg', 920, 83],
  ['menu_cards', ['холодный айран'], 'assets/images/menu/ayran.jpg', 920, 83],
  ['menu_cards', ['сливочно-чесночный соус'], 'assets/images/menu/garlic-sauce.jpg', 920, 83],
  ['menu_cards', ['рустическая композиция'], 'assets/images/menu/ketchup.jpg', 920, 83],
  ['menu_cards', ['янтарное пиво'], 'assets/images/menu/beer.jpg', 920, 83],
  ['combo', ['фиш-шаверма', 'картофелем', 'водой'], 'assets/images/combo/fish-water-combo.jpg', 1100, 82],
  ['combo', ['тунец-шаверма', 'картофелем', 'айраном'], 'assets/images/combo/tuna-ayran-combo.jpg', 1100, 82],
  ['combo', ['гриль-курица в пите', 'картофелем', 'айраном'], 'assets/images/combo/chicken-pita-ayran-combo.jpg', 1100, 82],
  ['combo', ['гриль-ролл с креветками', 'айраном'], 'assets/images/combo/shrimp-roll-ayran-combo.jpg', 1100, 82],
  ['combo', ['креветочный шаурма-комбо', 'колой'], 'assets/images/combo/shrimp-cola-combo.jpg', 1100, 82],
  ['combo', ['тунец-шаурма', 'картофелем', 'колой'], 'assets/images/combo/tuna-cola-combo.jpg', 1100, 82],
  ['combo', ['шаурма с картофелем фри', 'айраном'], 'assets/images/combo/shawarma-ayran-combo.jpg', 1100, 82],
  ['combo', ['аппетитный ролл chefish', 'картофелем', 'водой'], 'assets/images/combo/roll-water-combo.jpg', 1100, 82],
  ['combo', ['шаурма с картофелем', 'колой chefish'], 'assets/images/combo/shawarma-cola-combo.jpg', 1100, 82],
  ['combo', ['пита с картофелем фри', 'водой chefish'], 'assets/images/combo/pita-water-combo.jpg', 1100, 82],
  ['combo', ['гриль-шаурма с креветками', 'картофелем'], 'assets/images/combo/shrimp-fries-combo.jpg', 1100, 82],
  ['combo', ['аппетитный кебаб-комбо', 'колой', 'фри'], 'assets/images/combo/kebab-cola-combo.jpg', 1100, 82],
  ['combo', ['гурме-фиш-шаурма', 'картофелем', 'колой'], 'assets/images/combo/gourmet-fish-cola-combo.jpg', 1100, 82],
  ['combo', ['тунец-шаурма', 'картофелем фри', 'водой'], 'assets/images/combo/tuna-water-combo.jpg', 1100, 82],
  ['combo', ['рыбный ролл', 'айраном', 'фри'], 'assets/images/combo/fish-ayran-combo.jpg', 1100, 82],
];

const mappedSources = new Map();

for (const [folder, terms, relativeOutput, width, quality] of images) {
  const output = join(projectRoot, relativeOutput);
  mkdirSync(join(output, '..'), { recursive: true });
  const result = spawnSync('sips', [
    '-s', 'format', 'jpeg',
    '-s', 'formatOptions', String(quality),
    '--resampleWidth', String(width),
    findImage(folder, terms),
    '--out', output,
  ], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`sips failed for ${relativeOutput}: ${result.stderr || result.stdout}`);
  }
  mappedSources.set(findImage(folder, terms), relativeOutput);
  console.log(`${relativeOutput} ${result.stdout.match(/\d+(?:\.\d+)?\s*[kM]?B/i)?.[0] ?? ''}`);
}

const logo = findImage('logo', ['логотип chefish']);
const logoOutput = join(projectRoot, 'assets/images/brand/chefish-logo.png');
copyFileSync(logo, logoOutput);
mappedSources.set(logo, 'assets/images/brand/chefish-logo.png');
console.log('assets/images/brand/chefish-logo.png');

const webpResult = spawnSync('python3', [join(projectRoot, 'scripts/optimize-webp.py'), projectRoot], { encoding: 'utf8' });
if (webpResult.status !== 0) {
  throw new Error(`WebP optimization failed. Install Pillow for python3 and retry. ${webpResult.stderr || webpResult.stdout}`);
}
process.stdout.write(webpResult.stdout);

const sourceFolders = ['image_hero', 'images_section', 'menu_cards', 'combo', 'logo'];
const sourceMap = sourceFolders.flatMap((folder) => readdirSync(join(archiveRoot, folder))
  .filter((name) => /\.(png|jpe?g)$/i.test(name) && !name.startsWith('.'))
  .map((name) => {
    const sourcePath = join(archiveRoot, folder, name);
    const output = mappedSources.get(sourcePath) ?? null;
    return {
      source: `${folder}/${name}`,
      output,
      webpOutput: output?.replace(/\.jpg$/i, '.webp') ?? null,
      imported: Boolean(output),
      note: output ? '' : folder === 'combo'
        ? 'Не сопоставлено: в текущем каталоге нет подтверждённой записи для этого варианта.'
        : 'Не используется существующим каталогом.',
    };
  }));
writeFileSync(join(projectRoot, 'scripts/image-mapping.json'), `${JSON.stringify(sourceMap, null, 2)}\n`);
console.log(`scripts/image-mapping.json (${sourceMap.length} исходных изображений)`);
