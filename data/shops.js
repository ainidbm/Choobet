const SHOPS = [
  {
    id: 'mixuebingcheng',
    name: '蜜雪冰城',
    logo: 'images/logos/mixuebingcheng.png',
    drinks: [
      { id: 'mxbc-001', name: '珍珠奶茶',   categories: ['奶茶'],           price: 8  },
      { id: 'mxbc-002', name: '柠檬水',     categories: ['果茶'],           price: 4  },
      { id: 'mxbc-003', name: '抹茶拿铁',   categories: ['抹茶', '咖啡'],   price: 12 },
      { id: 'mxbc-004', name: '草莓奶昔',   categories: ['奶茶'],           price: 10 },
      { id: 'mxbc-005', name: '芒果冰沙',   categories: ['果茶'],           price: 9  },
      { id: 'mxbc-006', name: '摩卡摇摇奶昔', categories: ['咖啡', '奶茶'], price: 11 },
    ]
  },
  {
    id: 'chabaidao',
    name: '茶百道',
    logo: 'images/logos/chabaidao.png',
    drinks: [
      { id: 'cbd-001', name: '杨枝甘露',     categories: ['果茶'],         price: 18 },
      { id: 'cbd-002', name: '豆乳玉麒麟',   categories: ['奶茶'],         price: 16 },
      { id: 'cbd-003', name: '茉莉奶绿',     categories: ['奶茶', '抹茶'], price: 14 },
      { id: 'cbd-004', name: '西瓜啵啵',     categories: ['果茶'],         price: 15 },
      { id: 'cbd-005', name: '生椰拿铁',     categories: ['咖啡'],         price: 17 },
    ]
  },
  {
    id: 'xicha',
    name: '喜茶',
    logo: 'images/logos/xicha.png',
    drinks: [
      { id: 'xc-001', name: '多肉葡萄',       categories: ['果茶'],         price: 29 },
      { id: 'xc-002', name: '烤黑糖波波牛乳', categories: ['奶茶'],         price: 25 },
      { id: 'xc-003', name: '芝芝莓莓',       categories: ['果茶'],         price: 28 },
      { id: 'xc-004', name: '绿妍抹茶',       categories: ['抹茶'],         price: 22 },
      { id: 'xc-005', name: '满杯红柚',       categories: ['果茶'],         price: 26 },
      { id: 'xc-006', name: '冰淇淋芒芒',     categories: ['冰淇淋', '果茶'], price: 24 },
    ]
  },
  {
    id: 'guming',
    name: '古茗',
    logo: 'images/logos/guming.png',
    drinks: [
      { id: 'gm-001', name: '布蕾脆脆奶芙',   categories: ['奶茶'],         price: 19 },
      { id: 'gm-002', name: '超A芝士葡萄',    categories: ['果茶'],         price: 20 },
      { id: 'gm-003', name: '桃气乌龙奶盖',   categories: ['奶茶', '果茶'], price: 17 },
      { id: 'gm-004', name: '生椰拿铁冰',     categories: ['咖啡'],         price: 18 },
      { id: 'gm-005', name: '龙井香',         categories: ['抹茶'],         price: 15 },
      { id: 'gm-006', name: '曲奇冰淇淋奶茶', categories: ['冰淇淋', '奶茶'], price: 21 },
    ]
  },
  {
    id: 'yidiandian',
    name: '一点点',
    logo: 'images/logos/yidiandian.png',
    drinks: [
      { id: 'ydd-001', name: '四季奶青',     categories: ['奶茶'],         price: 12 },
      { id: 'ydd-002', name: '波霸奶茶',     categories: ['奶茶'],         price: 13 },
      { id: 'ydd-003', name: '冰淇淋红茶',   categories: ['冰淇淋', '奶茶'], price: 16 },
      { id: 'ydd-004', name: '葡萄柚绿',     categories: ['果茶'],         price: 14 },
      { id: 'ydd-005', name: '燕麦拿铁',     categories: ['咖啡'],         price: 18 },
      { id: 'ydd-006', name: '抹茶红豆',     categories: ['抹茶'],         price: 15 },
      { id: 'ydd-007', name: '可可芭蕾',     categories: ['奶茶'],         price: 17 },
    ]
  }
];

const CATEGORIES = ['奶茶', '果茶', '咖啡', '抹茶', '冰淇淋'];

const CATEGORY_TO_BOARD = {
  '奶茶': 'milktea',
  '果茶': 'fruittea',
  '咖啡': 'coffee',
  '抹茶': 'matcha',
  '冰淇淋': 'icecream'
};

function findDrink(drinkId) {
  for (const shop of SHOPS) {
    const drink = shop.drinks.find(d => d.id === drinkId);
    if (drink) return { drink, shop };
  }
  return null;
}

function getDrinksForBoard(boardId) {
  if (boardId === 'main') {
    return SHOPS.flatMap(s => s.drinks.map(d => ({ ...d, shopId: s.id, shopName: s.name, shopLogo: s.logo })));
  }
  if (boardId.startsWith('pool_')) {
    const pool = getCustomPools().find(p => p.id === boardId);
    if (!pool) return [];
    return pool.drinkIds.map(id => {
      const result = findDrink(id);
      if (!result) return null;
      return { ...result.drink, shopId: result.shop.id, shopName: result.shop.name, shopLogo: result.shop.logo };
    }).filter(Boolean);
  }
  // Category board
  const category = Object.keys(CATEGORY_TO_BOARD).find(k => CATEGORY_TO_BOARD[k] === boardId);
  if (!category) return [];
  return SHOPS.flatMap(s =>
    s.drinks.filter(d => d.categories.includes(category))
      .map(d => ({ ...d, shopId: s.id, shopName: s.name, shopLogo: s.logo }))
  );
}

function getShopsForBoard(boardId) {
  const drinks = getDrinksForBoard(boardId);
  const shopIds = [...new Set(drinks.map(d => d.shopId))];
  return SHOPS.filter(s => shopIds.includes(s.id));
}
