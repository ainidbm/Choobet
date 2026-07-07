const SHOPS = [
  {
    id: 'mixuebingcheng',
    name: '蜜雪冰城',
    logo: 'images/logos/mixuebingcheng.png',
    drinks: [
      { id: 'mxbc-001', name: '冰鲜柠檬水', categories: ['果茶'], price: 4  },
      { id: 'mxbc-002', name: '棒打鲜橙', categories: ['果茶'], price: 6  },
      { id: 'mxbc-003', name: '芝士奶盖四季春', categories: ['奶茶'], price:8 },
      { id: 'mxbc-004', name: '茉莉奶绿', categories: ['奶茶'], price: 6  },
      { id: 'mxbc-005', name: '珍珠奶茶', categories: ['奶茶'], price: 6 },
      { id: 'mxbc-006', name: '蜜桃四季春', categories: ['果茶'], price: 7 },
      { id: 'mxbc-007', name: '满杯百香果', categories: ['果茶'], price: 7 },
      { id: 'mxbc-008', name: '柠檬绿茶', categories: ['果茶'], price: 5 },
      { id: 'mxbc-009', name: '芋圆葡萄', categories: ['果茶'], price: 8 },
      { id: 'mxbc-010', name: '草莓啵啵', categories: ['果茶'], price: 8 },
      { id: 'mxbc-011', name: '桃喜芒芒', categories: ['果茶'], price: 6 },
      { id: 'mxbc-012', nname: '菠萝百香果', categories: ['果茶'], price: 8 },
      { id: 'mxbc-013', name: '蓝莓果粒茶', categories: ['果茶'], price: 7 },
      { id: 'mxbc-014', name: '柚子香柠茶', categories: ['果茶'], price: 7 },
      { id: 'mxbc-015', name: '柚子香柠红茶', categories: ['果茶'], price: 6 },
      { id: 'mxbc-016', name: '珍珠奶茶', categories: ['奶茶'], price: 6 },
      { id: 'mxbc-017', name: '椰果奶茶', categories: ['奶茶'], price: 7 },
      { id: 'mxbc-018', name: '芋圆奶茶', categories: ['奶茶'], price: 8 },
      { id: 'mxbc-019', name: '原味奶茶', categories: ['奶茶'], price: 6 },
      { id: 'mxbc-020', name: '三拼霸霸奶茶', categories: ['奶茶'], price: 8 },
      { id: 'mxbc-021', name: '布丁奶茶', categories: ['奶茶'], price: 7 },
      { id: 'mxbc-022', name: '双拼奶茶', categories: ['奶茶'], price: 7 },
      { id: 'mxbc-023', name: '芝士奶盖绿茶', categories: ['奶茶'], price: 8 },
      { id: 'mxbc-024', name: '新鲜冰淇淋（黑芝麻脆筒）', categories: ['冰淇淋'], price: 2 },
      { id: 'mxbc-025', name: '草莓摇摇奶昔', categories: ['冰淇淋'], price: 6 },
      { id: 'mxbc-026', name: '脆皮大圣代', categories: ['冰淇淋'], price: 7 },
      { id: 'mxbc-027', name: '雪王大圣代（奥利奥饼干风味）', categories: ['冰淇淋'], price: 6 },
      { id: 'mxbc-028', name: '雪王大圣代（草莓）', categories: ['冰淇淋'], price: 6 },
      { id: 'mxbc-029', name: '雪王大圣代（芒果）', categories: ['冰淇淋'], price: 6 },
      { id: 'mxbc-030', name: '草莓摇摇奶昔', categories: ['冰淇淋'], price: 6 },
      { id: 'mxbc-031', name: '四季春轻乳茶', categories: ['奶茶'], price: 6  },
      { id: 'mxbc-032', name: '四季春轻乳茶', categories: ['奶茶'], price: 6  },
      { id: 'mxbc-033', name: '蜜桃甘露', categories: ['奶茶'], price: 9  },
      { id: 'mxbc-034', name: '薄荷奶绿', categories: ['奶茶'], price: 6  },
      { id: 'mxbc-035', name: '美式咖啡', categories: ['咖啡'], price: 5  },
      { id: 'mxbc-036', name: '葡萄冰美式', categories: ['咖啡'], price: 6  },
      { id: 'mxbc-037', name: '爆汁柠柚咖', categories: ['咖啡'], price: 8  },
      { id: 'mxbc-038', name: '真橙美式', categories: ['咖啡'], price: 7  },
      { id: 'mxbc-039', name: '真橙拿铁', categories: ['咖啡'], price: 8  },
      { id: 'mxbc-040', name: '茉莉拿铁咖啡', categories: ['咖啡'], price: 7  },
      { id: 'mxbc-041', name: '拿铁咖啡', categories: ['咖啡'], price: 7  },
      { id: 'mxbc-042', name: '雪王雪顶咖啡', categories: ['咖啡'], price: 7  },
      { id: 'mxbc-043', name: '港式杨枝甘露', categories: ['奶茶'], price: 9  },
      { id: 'mxbc-044', name: '生椰拿铁', categories: ['咖啡'], price: 8  },
      { id: 'mxbc-045', name: '茉莉绿茶', categories: ['奶茶'], price: 4  },
      { id: 'mxbc-046', name: '高山四季春茶', categories: ['奶茶'], price: 4  },
    ]
  },
  {
    id: 'yihetang',
    name: '益禾堂',
    logo: 'images/logos/yihetang.png',
    drinks: [
      { id: 'yht-001', name: '真有料烧仙草', categories: ['奶茶'], price: 13 },
      { id: 'yht-002', name: '薄荷奶绿', categories: ['奶茶'], price: 9 },
      { id: 'yht-003', name: '益禾烤奶', categories: ['奶茶'], price: 8 },
      { id: 'yht-004', name: '薄荷柠檬水', categories: ['果茶'], price: 5 },
      { id: 'yht-005', name: '翠峰茉莉', categories: ['纯茶'], price: 5 },
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

const CATEGORIES = ['奶茶', '果茶', '咖啡', '抹茶', '冰淇淋', '酸奶', '纯茶'];

const CATEGORY_TO_BOARD = {
  '奶茶': 'milktea',
  '果茶': 'fruittea',
  '咖啡': 'coffee',
  '抹茶': 'matcha',
  '冰淇淋': 'icecream',
  '酸奶': 'yogurt',
  '纯茶': 'puretea'
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
