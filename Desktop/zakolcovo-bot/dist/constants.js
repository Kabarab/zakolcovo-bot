"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MENU_ITEMS = exports.BOT_NAME = void 0;
exports.BOT_NAME = 'ZakolcovoBot';
exports.MENU_ITEMS = [
    // Холодные закуски
    {
        id: 'cold-1',
        name: 'Ассорти мясное',
        description: 'Язык говяжий, рулет из птицы, буженина, колбаса с/к, хрен, горчица, зелень. 250/30/30 гр.',
        price: 30,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/assorti-myasnoe.jpg',
    },
    {
        id: 'cold-2',
        name: 'Ассорти овощное',
        description: 'Свежие огурцы, помидоры, перец, редис, зелень. 300 гр.',
        price: 18,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/assorti-ovoshhnoe.jpg',
    },
    {
        id: 'cold-3',
        name: 'Ассорти из свежих фруктов',
        description: 'Виноград, апельсин, банан, киви, яблоко, груша. 1000 гр.',
        price: 25,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/assorti-iz-svezhix-fruktov.jpg',
    },
    {
        id: 'cold-4',
        name: 'Рулетики из ветчины',
        description: 'Ветчина, сыр, яйцо, чеснок, майонез, зелень. 200 гр.',
        price: 14,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/ruletiki-iz-vetchiny.jpg',
    },
    {
        id: 'cold-5',
        name: 'Рулетики из баклажан',
        description: 'Баклажаны, сыр, чеснок, майонез, зелень. 250 гр.',
        price: 16,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/ruletiki-iz-baklazhan.jpg',
    },
    {
        id: 'cold-6',
        name: 'Сельдь с картофелем',
        description: 'Филе сельди, картофель отварной, лук маринованный, зелень. 150/100/30 гр.',
        price: 13,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/seld-s-kartofelem.jpg',
    },
    // Салаты
    {
        id: 'salad-1',
        name: 'Салат «Греческий»',
        description: 'Огурцы, помидоры, перец, маслины, сыр «Фета», лист салата, масло оливковое, зелень. 250 гр.',
        price: 16,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/salat-grecheskij.jpg',
    },
    {
        id: 'salad-2',
        name: 'Салат «Цезарь» с курицей',
        description: 'Филе цыпленка, помидоры черри, гренки, сыр «Пармезан», лист салата, соус «Цезарь», зелень. 250 гр.',
        price: 18,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/salat-cezar-s-kuricej.jpg',
    },
    {
        id: 'salad-3',
        name: 'Салат «Цезарь» с креветками',
        description: 'Креветки, помидоры черри, гренки, сыр «Пармезан», лист салата, соус «Цезарь», зелень. 250 гр.',
        price: 22,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/salat-cezar-s-krevetkami.jpg',
    },
    {
        id: 'salad-4',
        name: 'Салат с языком',
        description: 'Язык говяжий, огурцы маринованные, шампиньоны, лук, майонез, зелень. 250 гр.',
        price: 17,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/salat-s-yazykom.jpg',
    },
    // Горячие закуски
    {
        id: 'hot-appetizer-1',
        name: 'Жульен с курицей и грибами',
        description: 'Филе цыпленка, шампиньоны, лук, сливочный соус, сыр. 150 гр.',
        price: 13,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/zhulen-s-kuricej-i-gribami.jpg',
    },
    {
        id: 'hot-appetizer-2',
        name: 'Блинчики с ветчиной и сыром',
        description: '2 шт. 200/30 гр.',
        price: 10,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/blinchiki-s-vetchinoj-i-syrom.jpg',
    },
    // Супы
    {
        id: 'soup-1',
        name: 'Солянка мясная',
        description: '300/30 гр.',
        price: 12,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/solyanka-myasnaya.jpg',
    },
    {
        id: 'soup-2',
        name: 'Уха «Царская»',
        description: '300 гр.',
        price: 14,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/uxa-carskaya.jpg',
    },
    // Горячие блюда из птицы
    {
        id: 'poultry-1',
        name: 'Филе цыпленка в сливочном соусе',
        description: 'Филе цыпленка, шампиньоны, лук, сливочный соус. 150/100 гр.',
        price: 18,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/file-cyplenka-v-slivochnom-souse.jpg',
    },
    {
        id: 'poultry-2',
        name: 'Филе цыпленка с ананасом',
        description: 'Филе цыпленка, ананас, сыр, майонез. 200 гр.',
        price: 19,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/file-cyplenka-s-ananasom.jpg',
    },
    // Горячие блюда из свинины
    {
        id: 'pork-1',
        name: 'Свинина «По-французски»',
        description: 'Свинина, шампиньоны, помидоры, сыр, майонез. 250 гр.',
        price: 22,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/svinina-po-francuzski.jpg',
    },
    {
        id: 'pork-2',
        name: 'Свинина в кисло-сладком соусе',
        description: 'Свинина, перец, ананас, кисло-сладкий соус. 150/100 гр.',
        price: 21,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/svinina-v-kislo-sladkom-souse.jpg',
    },
    {
        id: 'pork-3',
        name: 'Мачанка с блинами',
        description: 'Ребра свиные, колбаса домашняя, ветчина, соус, блины. 200/200 гр.',
        price: 20,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/machanka-s-blinami.jpg',
    },
    // Горячие блюда из говядины
    {
        id: 'beef-1',
        name: 'Говядина тушеная с черносливом',
        description: 'Говядина, чернослив, лук, морковь, соус. 150/100 гр.',
        price: 25,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/govyadina-tushenaya-s-chernoslivom.jpg',
    },
    // Горячие блюда из рыбы
    {
        id: 'fish-1',
        name: 'Семга в сливочно-икорном соусе',
        description: 'Филе семги, икра красная, сливочный соус. 150/50 гр.',
        price: 35,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/semga-v-slivochno-ikornom-souse.jpg',
    },
    {
        id: 'fish-2',
        name: 'Судак с овощами',
        description: 'Филе судака, помидоры, перец, лук, морковь, соус. 150/100 гр.',
        price: 24,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/sudak-s-ovoshhami.jpg',
    },
    // Гарниры
    {
        id: 'garnish-1',
        name: 'Картофель фри',
        description: '150 гр.',
        price: 7,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/kartofel-fri.jpg',
    },
    {
        id: 'garnish-2',
        name: 'Картофель по-деревенски',
        description: '150 гр.',
        price: 7,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/kartofel-po-derevenski.jpg',
    },
    {
        id: 'garnish-3',
        name: 'Картофельное пюре',
        description: '200 гр.',
        price: 6,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/kartofelnoe-pyure.jpg',
    },
    {
        id: 'garnish-4',
        name: 'Овощи на гриле',
        description: 'Баклажаны, кабачки, перец, шампиньоны. 200 гр.',
        price: 14,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/ovoshhi-na-grile.jpg',
    },
    // Соусы
    {
        id: 'sauce-1',
        name: 'Кетчуп',
        description: '50 гр.',
        price: 2,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/ketchup.jpg',
    },
    {
        id: 'sauce-2',
        name: 'Майонез',
        description: '50 гр.',
        price: 2,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/majonez.jpg',
    },
    {
        id: 'sauce-3',
        name: 'Тар-тар',
        description: '50 гр.',
        price: 3,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/tar-tar.jpg',
    },
    // Десерты
    {
        id: 'dessert-1',
        name: 'Мороженое с фруктами',
        description: '150/50 гр.',
        price: 9,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/morozhenoe-s-fruktami.jpg',
    },
    {
        id: 'dessert-2',
        name: 'Блинчики с творогом',
        description: '2 шт. 200/30 гр.',
        price: 9,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/blinchiki-s-tvorogom.jpg',
    },
    // Блюда на углях
    {
        id: 'grill-1',
        name: 'Шашлык из свинины',
        description: '100 гр.',
        price: 9,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/shashlyk-iz-svininy.jpg',
    },
    {
        id: 'grill-2',
        name: 'Шашлык из птицы',
        description: '100 гр.',
        price: 8,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/shashlyk-iz-pticy.jpg',
    },
    {
        id: 'grill-3',
        name: 'Ребра свиные',
        description: '100 гр.',
        price: 8,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/rebra-svinye.jpg',
    },
    {
        id: 'grill-4',
        name: 'Скумбрия',
        description: '100 гр.',
        price: 8,
        image: 'https://zakolcovo.by/wp-content/uploads/2022/11/skumbriya.jpg',
    },
];
