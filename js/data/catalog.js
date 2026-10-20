export const categories = [
  { id: 'shawarma', key: 'category.shawarma' },
  { id: 'combo', key: 'category.combo' },
  { id: 'extras', key: 'category.extras' },
  { id: 'drinks', key: 'category.drinks' },
  { id: 'sauces', key: 'category.sauces' },
];

export const ORDER_PRICES_TETRI = Object.freeze({
  chicken: 1000, fish: 1490, tuna: 1990, shrimp: 1990, pita: 1590,
  extraChicken: 300, cheese: 150, jalapeno: 100, redOnion: 50,
  fries: 400, garlicSauce: 100, ketchup: 100,
  packaging: 100, delivery: 300,
});

export const addons = [
  { id: 'extra-chicken', name: { ru: 'Дополнительная курица', en: 'Extra chicken', ka: 'დამატებითი ქათამი' }, priceTetri: ORDER_PRICES_TETRI.extraChicken },
  { id: 'cheese', name: { ru: 'Сыр', en: 'Cheese', ka: 'ყველი' }, priceTetri: ORDER_PRICES_TETRI.cheese },
  { id: 'jalapeno', name: { ru: 'Халапеньо', en: 'Jalapeño', ka: 'ჰალაპენიო' }, priceTetri: ORDER_PRICES_TETRI.jalapeno },
  { id: 'red-onion', name: { ru: 'Красный лук', en: 'Red onion', ka: 'წითელი ხახვი' }, priceTetri: ORDER_PRICES_TETRI.redOnion },
];

const allShawarmaAddons = addons.map(({ id }) => id);
const localizedPending = { ru: 'Состав уточняется у заведения.', en: 'Ingredients are being confirmed by the restaurant.', ka: 'შემადგენლობა რესტორანთან ზუსტდება.' };

export const products = [
  {
    id: 'chicken-shawarma', category: 'shawarma',
    menuName: { ru: 'Куриная', en: 'Chicken', ka: 'ქათმის' },
    name: { ru: 'Куриная шаурма', en: 'Chicken shawarma', ka: 'ქათმის შაურმა' },
    description: { ru: 'Классическая шаурма с курицей.', en: 'Classic chicken shawarma.', ka: 'კლასიკური ქათმის შაურმა.' },
    ingredients: localizedPending,
    image: '/assets/images/menu/chicken-shawarma.webp', priceTetri: ORDER_PRICES_TETRI.chicken,
    availableAddons: allShawarmaAddons, featured: true,
  },
  {
    id: 'fish-shawarma', category: 'shawarma',
    menuName: { ru: 'С рыбой', en: 'Fish', ka: 'თევზით' },
    name: { ru: 'Шаурма с рыбой', en: 'Fish shawarma', ka: 'თევზის შაურმა' },
    description: { ru: 'Шаурма с рыбой.', en: 'Fish shawarma.', ka: 'თევზის შაურმა.' },
    ingredients: localizedPending,
    image: '/assets/images/menu/fish-shawarma.webp', priceTetri: ORDER_PRICES_TETRI.fish,
    availableAddons: [], featured: true,
  },
  {
    id: 'tuna-roll', category: 'shawarma',
    menuName: { ru: 'С тунцом', en: 'Tuna', ka: 'თინუსით' },
    name: { ru: 'Шаурма с тунцом', en: 'Tuna shawarma', ka: 'თინუსის შაურმა' },
    description: { ru: 'Шаурма с тунцом.', en: 'Tuna shawarma.', ka: 'თინუსის შაურმა.' },
    ingredients: localizedPending,
    image: '/assets/images/menu/tuna-roll.webp', priceTetri: ORDER_PRICES_TETRI.tuna,
    availableAddons: [], featured: true,
  },
  {
    id: 'shrimp-roll', category: 'shawarma',
    menuName: { ru: 'С креветками', en: 'Shrimp', ka: 'კრევეტებით' },
    name: { ru: 'Шаурма с креветками', en: 'Shrimp shawarma', ka: 'კრევეტების შაურმა' },
    description: { ru: 'Шаурма с креветками.', en: 'Shrimp shawarma.', ka: 'კრევეტების შაურმა.' },
    ingredients: localizedPending,
    image: '/assets/images/menu/shrimp-roll.webp', priceTetri: ORDER_PRICES_TETRI.shrimp,
    availableAddons: [], featured: true,
  },
  {
    id: 'pita-shawarma', category: 'shawarma',
    menuName: { ru: 'В пите', en: 'In pita', ka: 'პიტაში' },
    name: { ru: 'Пита с тунцом', en: 'Tuna pita', ka: 'პიტა თინუსით' },
    description: { ru: 'Пита с тунцом на гриле, свежими овощами и соусом.', en: 'Pita with lightly grilled tuna, fresh vegetables and sauce.', ka: 'პიტა მსუბუქად გრილზე შემწვარი თინუსით, ახალი ბოსტნეულითა და სოუსით.' },
    ingredients: localizedPending,
    image: '/assets/images/menu/pita-shawarma.webp', priceTetri: ORDER_PRICES_TETRI.pita,
    availableAddons: [],
  },
  { id: 'fish-water-combo', category: 'combo', menuName: { ru: 'Фиш · фри · вода', en: 'Fish · fries · water', ka: 'თევზი · ფრი · წყალი' }, name: { ru: 'Фиш-шаурма, фри и вода', en: 'Fish shawarma, fries & water', ka: 'თევზის შაურმა, ფრი და წყალი' }, description: { ru: 'Фиш-шаурма, картофель фри и вода.', en: 'Fish shawarma, French fries and water.', ka: 'თევზის შაურმა, კარტოფილი ფრი და წყალი.' }, ingredients: localizedPending, image: '/assets/images/combo/fish-water-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'tuna-ayran-combo', category: 'combo', menuName: { ru: 'Тунец · фри · айран', en: 'Tuna · fries · ayran', ka: 'თინუსი · ფრი · აირანი' }, name: { ru: 'Тунец-шаурма, фри и айран', en: 'Tuna shawarma, fries & ayran', ka: 'თინუსის შაურმა, ფრი და აირანი' }, description: { ru: 'Шаурма с тунцом, картофель и айран.', en: 'Tuna shawarma, fries and ayran.', ka: 'თინუსის შაურმა, ფრი და აირანი.' }, ingredients: localizedPending, image: '/assets/images/combo/tuna-ayran-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'chicken-pita-ayran-combo', category: 'combo', menuName: { ru: 'Курица в пите', en: 'Chicken pita', ka: 'ქათამი პიტაში' }, name: { ru: 'Курица в пите, фри и айран', en: 'Chicken pita, fries & ayran', ka: 'ქათამი პიტაში, ფრი და აირანი' }, description: { ru: 'Курица в пите, картофель и айран.', en: 'Chicken in pita, fries and ayran.', ka: 'ქათამი პიტაში, ფრი და აირანი.' }, ingredients: localizedPending, image: '/assets/images/combo/chicken-pita-ayran-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'shrimp-roll-ayran-combo', category: 'combo', menuName: { ru: 'Креветочный ролл', en: 'Shrimp roll', ka: 'კრევეტის როლი' }, name: { ru: 'Креветочный ролл и айран', en: 'Shrimp roll & ayran', ka: 'კრევეტის როლი და აირანი' }, description: { ru: 'Ролл с креветками и айран.', en: 'Shrimp roll and ayran.', ka: 'კრევეტის როლი და აირანი.' }, ingredients: localizedPending, image: '/assets/images/combo/shrimp-roll-ayran-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'shrimp-cola-combo', category: 'combo', menuName: { ru: 'Креветки · кола', en: 'Shrimp · cola', ka: 'კრევეტი · კოლა' }, name: { ru: 'Креветочная шаурма и кола', en: 'Shrimp shawarma & cola', ka: 'კრევეტის შაურმა და კოლა' }, description: { ru: 'Шаурма с креветками и кола.', en: 'Shrimp shawarma and cola.', ka: 'კრევეტის შაურმა და კოლა.' }, ingredients: localizedPending, image: '/assets/images/combo/shrimp-cola-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'tuna-cola-combo', category: 'combo', menuName: { ru: 'Тунец · фри · кола', en: 'Tuna · fries · cola', ka: 'თინუსი · ფრი · კოლა' }, name: { ru: 'Тунец-шаурма, фри и кола', en: 'Tuna shawarma, fries & cola', ka: 'თინუსის შაურმა, ფრი და კოლა' }, description: { ru: 'Шаурма с тунцом, картофель фри и кола.', en: 'Tuna shawarma, French fries and cola.', ka: 'თინუსის შაურმა, კარტოფილი ფრი და კოლა.' }, ingredients: localizedPending, image: '/assets/images/combo/tuna-cola-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'shawarma-ayran-combo', category: 'combo', menuName: { ru: 'Шаурма · фри · айран', en: 'Shawarma · fries · ayran', ka: 'შაურმა · ფრი · აირანი' }, name: { ru: 'Шаурма, фри и айран', en: 'Shawarma, fries & ayran', ka: 'შაურმა, ფრი და აირანი' }, description: { ru: 'Шаурма, картофель фри и айран.', en: 'Shawarma, French fries and ayran.', ka: 'შაურმა, კარტოფილი ფრი და აირანი.' }, ingredients: localizedPending, image: '/assets/images/combo/shawarma-ayran-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'roll-water-combo', category: 'combo', menuName: { ru: 'Ролл · фри · вода', en: 'Roll · fries · water', ka: 'როლი · ფრი · წყალი' }, name: { ru: 'Ролл, фри и вода', en: 'Roll, fries & water', ka: 'როლი, ფრი და წყალი' }, description: { ru: 'Ролл CheFish, картофель и вода.', en: 'CheFish roll, fries and water.', ka: 'CheFish-ის როლი, ფრი და წყალი.' }, ingredients: localizedPending, image: '/assets/images/combo/roll-water-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'chicken-combo', category: 'combo', menuName: { ru: 'Шаурма · фри · кола', en: 'Shawarma · fries · cola', ka: 'შაურმა · ფრი · კოლა' }, name: { ru: 'Шаурма, фри и кола', en: 'Shawarma, fries & cola', ka: 'შაურმა, ფრი და კოლა' }, description: { ru: 'Шаурма CheFish, картофель фри и кола.', en: 'CheFish shawarma, French fries and cola.', ka: 'CheFish-ის შაურმა, კარტოფილი ფრი და კოლა.' }, ingredients: localizedPending, image: '/assets/images/combo/shawarma-cola-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'pita-water-combo', category: 'combo', menuName: { ru: 'Пита · фри · вода', en: 'Pita · fries · water', ka: 'პიტა · ფრი · წყალი' }, name: { ru: 'Пита, фри и вода', en: 'Pita, fries & water', ka: 'პიტა, ფრი და წყალი' }, description: { ru: 'Пита CheFish, картофель фри и вода.', en: 'CheFish pita, French fries and water.', ka: 'CheFish-ის პიტა, ფრი და წყალი.' }, ingredients: localizedPending, image: '/assets/images/combo/pita-water-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'shrimp-fries-combo', category: 'combo', menuName: { ru: 'Креветки · фри', en: 'Shrimp · fries', ka: 'კრევეტი · ფრი' }, name: { ru: 'Креветочная шаурма и фри', en: 'Shrimp shawarma & fries', ka: 'კრევეტის შაურმა და ფრი' }, description: { ru: 'Гриль-шаурма с креветками и картофель.', en: 'Grilled shrimp shawarma and fries.', ka: 'კრევეტის გრილ-შაურმა და ფრი.' }, ingredients: localizedPending, image: '/assets/images/combo/shrimp-fries-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'kebab-cola-combo', category: 'combo', menuName: { ru: 'Кебаб · фри · кола', en: 'Kebab · fries · cola', ka: 'ქაბაბი · ფრი · კოლა' }, name: { ru: 'Кебаб, фри и кола', en: 'Kebab, fries & cola', ka: 'ქაბაბი, ფრი და კოლა' }, description: { ru: 'Кебаб-комбо с колой и картофелем фри.', en: 'Kebab combo with cola and French fries.', ka: 'ქაბაბ-კომბო კოლითა და კარტოფილი ფრით.' }, ingredients: localizedPending, image: '/assets/images/combo/kebab-cola-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'gourmet-fish-cola-combo', category: 'combo', menuName: { ru: 'Фиш · фри · кола', en: 'Fish · fries · cola', ka: 'თევზი · ფრი · კოლა' }, name: { ru: 'Гурме-фиш, фри и кола', en: 'Gourmet fish, fries & cola', ka: 'გურმე-თევზი, ფრი და კოლა' }, description: { ru: 'Гурме-фиш-шаурма, картофель и кола.', en: 'Gourmet fish shawarma, fries and cola.', ka: 'გურმე-თევზის შაურმა, ფრი და კოლა.' }, ingredients: localizedPending, image: '/assets/images/combo/gourmet-fish-cola-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'tuna-water-combo', category: 'combo', menuName: { ru: 'Тунец · фри · вода', en: 'Tuna · fries · water', ka: 'თინუსი · ფრი · წყალი' }, name: { ru: 'Тунец-шаурма, фри и вода', en: 'Tuna shawarma, fries & water', ka: 'თინუსის შაურმა, ფრი და წყალი' }, description: { ru: 'Шаурма с тунцом, картофель фри и вода.', en: 'Tuna shawarma, French fries and water.', ka: 'თინუსის შაურმა, ფრი და წყალი.' }, ingredients: localizedPending, image: '/assets/images/combo/tuna-water-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  { id: 'fish-ayran-combo', category: 'combo', menuName: { ru: 'Фиш · фри · айран', en: 'Fish · fries · ayran', ka: 'თევზი · ფრი · აირანი' }, name: { ru: 'Фиш-ролл, фри и айран', en: 'Fish roll, fries & ayran', ka: 'თევზის როლი, ფრი და აირანი' }, description: { ru: 'Рыбный ролл, картофель фри и айран.', en: 'Fish roll, French fries and ayran.', ka: 'თევზის როლი, კარტოფილი ფრი და აირანი.' }, ingredients: localizedPending, image: '/assets/images/combo/fish-ayran-combo.webp', priceTetri: null, availableAddons: [], pricePending: true },
  {
    id: 'fries', category: 'extras', menuName: { ru: 'Картофель фри', en: 'French fries', ka: 'კარტოფილი ფრი' },
    name: { ru: 'Картофель фри', en: 'French fries', ka: 'კარტოფილი ფრი' },
    description: { ru: 'Картофель фри.', en: 'French fries.', ka: 'კარტოფილი ფრი.' }, ingredients: localizedPending,
    image: '/assets/images/menu/fries.webp', priceTetri: ORDER_PRICES_TETRI.fries, availableAddons: [], featured: true,
  },
  {
    id: 'jalapeno-side', category: 'extras', menuName: { ru: 'Халапеньо', en: 'Jalapeños', ka: 'ჰალაპენიო' },
    name: { ru: 'Халапеньо', en: 'Jalapeños', ka: 'ჰალაპენიო' },
    description: { ru: 'Маринованный халапеньо.', en: 'Pickled jalapeños.', ka: 'დამწნილებული ჰალაპენიო.' }, ingredients: localizedPending,
    image: '/assets/images/menu/jalapeno.webp', priceTetri: ORDER_PRICES_TETRI.jalapeno, availableAddons: [],
  },
  {
    id: 'cola', category: 'drinks', name: { ru: 'Coca-Cola', en: 'Coca-Cola', ka: 'კოკა-კოლა' },
    description: { ru: 'Coca-Cola.', en: 'Coca-Cola.', ka: 'კოკა-კოლა.' }, ingredients: localizedPending,
    image: '/assets/images/menu/cola.webp', priceTetri: null, availableAddons: [], pricePending: true,
  },
  {
    id: 'water', category: 'drinks', name: { ru: 'Вода CheFish', en: 'CheFish water', ka: 'CheFish-ის წყალი' },
    description: { ru: 'Бутылка воды.', en: 'Bottled water.', ka: 'ბოთლის წყალი.' }, ingredients: localizedPending,
    image: '/assets/images/menu/water.webp', priceTetri: null, availableAddons: [], pricePending: true,
  },
  {
    id: 'ayran', category: 'drinks', name: { ru: 'Айран', en: 'Ayran', ka: 'აირანი' },
    description: { ru: 'Айран.', en: 'Ayran.', ka: 'აირანი.' }, ingredients: localizedPending,
    image: '/assets/images/menu/ayran.webp', priceTetri: null, availableAddons: [], pricePending: true,
  },
  {
    id: 'beer', category: 'drinks', name: { ru: 'Янтарное пиво', en: 'Amber beer', ka: 'ქარვისფერი ლუდი' },
    description: { ru: 'Напиток из подготовленного меню.', en: 'A drink from the prepared menu materials.', ka: 'სასმელი მომზადებული მენიუს მასალებიდან.' }, ingredients: localizedPending,
    image: '/assets/images/menu/beer.webp', priceTetri: null, availableAddons: [], pricePending: true,
  },
  {
    id: 'garlic-sauce', category: 'sauces', menuName: { ru: 'Чесночный', en: 'Garlic', ka: 'ნივრის' },
    name: { ru: 'Чесночный соус', en: 'Garlic sauce', ka: 'ნივრის სოუსი' },
    description: { ru: 'Чесночный соус.', en: 'Garlic sauce.', ka: 'ნივრის სოუსი.' }, ingredients: localizedPending,
    image: '/assets/images/menu/garlic-sauce.webp', priceTetri: ORDER_PRICES_TETRI.garlicSauce, availableAddons: [],
  },
  {
    id: 'ketchup', category: 'sauces', menuName: { ru: 'Домашний кетчуп', en: 'House ketchup', ka: 'სახლის კეტჩუპი' },
    name: { ru: 'Домашний кетчуп', en: 'House ketchup', ka: 'სახლის კეტჩუპი' },
    description: { ru: 'Кетчуп.', en: 'Ketchup.', ka: 'კეტჩუპი.' }, ingredients: localizedPending,
    image: '/assets/images/menu/ketchup.webp', priceTetri: ORDER_PRICES_TETRI.ketchup, availableAddons: [],
  },
];

export const getProduct = (id) => products.find((product) => product.id === id) ?? null;
export const getAddon = (id) => addons.find((addon) => addon.id === id) ?? null;
export const priceForProduct = (product) => Number.isInteger(product?.priceTetri) ? product.priceTetri : null;
