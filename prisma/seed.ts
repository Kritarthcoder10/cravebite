import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing database tables...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding database tables...');

  // Create Restaurants and their Menu Items
  const restaurantsData = [
    {
      name: 'Bella Italia',
      slug: 'bella-italia',
      address: '42 Corso Roma, Suite 100',
      rating: 4.7,
      cuisine: 'Italian, Pizza, Pasta',
      coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
      deliveryTime: 35,
      isPremium: true,
      menuItems: [
        {
          name: 'Margherita Basil Pizza',
          description: 'Fresh mozzarella, organic cherry tomatoes, fresh basil leaves, and cold-pressed extra virgin olive oil.',
          price: 14.99,
          category: 'Main Course',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Truffle Mushroom Fettuccine',
          description: 'Hand-rolled pasta tossed in a creamy wild mushroom and black truffle oil sauce.',
          price: 18.99,
          category: 'Main Course',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Bruschetta Trio',
          description: 'Toasted rustic Italian bread topped with garlic-rubbed heirloom tomatoes, whipped ricotta with honey, and olive tapenade.',
          price: 8.99,
          category: 'Starters',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Classic Tiramisu',
          description: 'Ladyfingers soaked in espresso, layered with whipped mascarpone cheese, and dusted with dark cocoa.',
          price: 7.99,
          category: 'Dessert',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Italian Blood Orange Soda',
          description: 'Sparkling mineral water infused with organic blood orange juice and mint.',
          price: 3.49,
          category: 'Beverage',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600',
        },
      ],
    },
    {
      name: 'Spice Symphony',
      slug: 'spice-symphony',
      address: '108 Curry Boulevard',
      rating: 4.6,
      cuisine: 'Indian, Curry, Tandoor',
      coverImage: 'https://images.unsplash.com/photo-1585938338392-50a59970d2ee?auto=format&fit=crop&q=80&w=800',
      deliveryTime: 40,
      isPremium: true,
      menuItems: [
        {
          name: 'Paneer Butter Masala',
          description: 'Soft cubes of cottage cheese cooked in a rich, velvety tomato and cashew gravy flavored with fenugreek.',
          price: 15.49,
          category: 'Main Course',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Slow-Cooked Butter Chicken',
          description: 'Tender tandoori chicken pieces simmered in a spiced butter, tomato, and cream sauce.',
          price: 16.99,
          category: 'Main Course',
          isVeg: false,
          imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Crispy Vegetable Samosas',
          description: 'Two flaky pastries stuffed with spiced potatoes, green peas, served with mint and tamarind chutneys.',
          price: 6.49,
          category: 'Starters',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Garlic Butter Naan',
          description: 'Soft, clay-oven-baked flatbread brushed with garlic butter and fresh cilantro.',
          price: 3.99,
          category: 'Starters',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Gulab Jamun with Rabri',
          description: 'Warm milk dumplings soaked in cardamom-infused sugar syrup, served with thickened sweetened milk.',
          price: 6.99,
          category: 'Dessert',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Mango Lassi',
          description: 'A creamy yogurt smoothie blended with ripe sweet mangoes and a touch of cardamom.',
          price: 4.49,
          category: 'Beverage',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=600',
        },
      ],
    },
    {
      name: 'Golden Dragon',
      slug: 'golden-dragon',
      address: '88 Wok Way, Chinatown',
      rating: 4.3,
      cuisine: 'Chinese, Wok, Dim Sum',
      coverImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
      deliveryTime: 30,
      isPremium: false,
      menuItems: [
        {
          name: 'Szechuan Chilli Paneer',
          description: 'Stir-fried cottage cheese cubes with colorful bell peppers, onions, and hot Szechuan peppercorns.',
          price: 13.99,
          category: 'Main Course',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'General Tso Chicken',
          description: 'Crispy fried chicken bites tossed in a sweet, savory, and slightly spicy glaze with broccoli.',
          price: 14.99,
          category: 'Main Course',
          isVeg: false,
          imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Steamed Crystal Dumplings',
          description: 'Translucent dough packed with finely chopped assorted winter vegetables and water chestnuts.',
          price: 7.99,
          category: 'Starters',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1496116211227-7d77b848c26c?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Peking Duck Bao',
          description: 'Two fluffy steamed buns filled with crispy duck, cucumber, spring onions, and sweet hoisin sauce.',
          price: 9.99,
          category: 'Starters',
          isVeg: false,
          imageUrl: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Sweet Taro Sesame Balls',
          description: 'Fried glutinous rice flour balls coated in white sesame seeds with a sweet taro paste center.',
          price: 5.99,
          category: 'Dessert',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Iced Jasmine Green Tea',
          description: 'Fragrant jasmine green tea freshly brewed and served chilled over ice with a hint of honey.',
          price: 3.49,
          category: 'Beverage',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600',
        },
      ],
    },
    {
      name: 'Burger Bistro',
      slug: 'burger-bistro',
      address: '77 Gourmet Street',
      rating: 4.5,
      cuisine: 'Fast Food, Burgers, Grill',
      coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
      deliveryTime: 25,
      isPremium: false,
      menuItems: [
        {
          name: 'Double Truffle Cheeseburger',
          description: 'Two flame-grilled Angus beef patties, aged cheddar, caramelized onions, and house truffle aioli on a brioche bun.',
          price: 13.49,
          category: 'Main Course',
          isVeg: false,
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Avocado Crunch Veggie Burger',
          description: 'House-made spiced black bean and quinoa patty, smashed avocado, crispy onions, and chipotle mayo.',
          price: 11.99,
          category: 'Main Course',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Loaded Sweet Potato Fries',
          description: 'Crispy sweet potato fries loaded with melted white cheddar, chives, and spicy jalapeño ranch.',
          price: 7.49,
          category: 'Starters',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Warm Fudge Brownie',
          description: 'Rich dark chocolate brownie served warm with a drizzle of salted caramel sauce.',
          price: 5.99,
          category: 'Dessert',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Craft Strawberry Lemonade',
          description: 'Freshly squeezed lemons blended with ripe strawberries and dynamic mint leaves.',
          price: 3.99,
          category: 'Beverage',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
        },
      ],
    },
    {
      name: 'The Green Bowl',
      slug: 'the-green-bowl',
      address: '15 Well-being Circle',
      rating: 4.8,
      cuisine: 'Healthy, Salad, Vegan',
      coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
      deliveryTime: 25,
      isPremium: true,
      menuItems: [
        {
          name: 'Avocado Quinoa Power Bowl',
          description: 'Organic red quinoa, Hass avocado, heirloom cherry tomatoes, organic cucumbers, pumpkin seeds, and dynamic lemon herb vinaigrette.',
          price: 12.99,
          category: 'Main Course',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Miso Glazed Tofu Salad',
          description: 'Crispy organic tofu cubes, shredded red cabbage, edamame, grated carrots, and white sesame dressing.',
          price: 11.49,
          category: 'Main Course',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Warm Sweet Potato Hummus Platter',
          description: 'Creamy sweet potato hummus garnished with toasted pine nuts, olive oil, served with warm whole-wheat pita bread.',
          price: 8.49,
          category: 'Starters',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1577906096429-f73df2c32244?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Chia Seed Pudding',
          description: 'Organic chia seeds soaked in unsweetened almond milk, topped with sliced strawberries, blueberries, and pure maple syrup.',
          price: 6.49,
          category: 'Dessert',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Green Detox Smoothie',
          description: 'A refreshing blend of organic baby spinach, cucumber, Granny Smith apple, celery, and cold-pressed ginger.',
          price: 4.99,
          category: 'Beverage',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587caaec?auto=format&fit=crop&q=80&w=600',
        },
      ],
    },
    {
      name: 'Sakura Sushi',
      slug: 'sakura-sushi',
      address: '22 Blossom Avenue',
      rating: 4.9,
      cuisine: 'Japanese, Sushi, Seafood',
      coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
      deliveryTime: 45,
      isPremium: true,
      menuItems: [
        {
          name: 'Premium Sashimi Platter',
          description: 'Fifteen pieces of expertly sliced raw fish: Atlantic salmon, bluefin tuna, and yellowtail, served with pickled ginger.',
          price: 29.99,
          category: 'Main Course',
          isVeg: false,
          imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Dragon Roll (8 Pcs)',
          description: 'Barbequed eel and cucumber inside, wrapped with avocado and topped with sweet unagi sauce and flying fish roe.',
          price: 16.99,
          category: 'Main Course',
          isVeg: false,
          imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Crispy Shrimp Tempura',
          description: 'Four ocean-caught prawns coated in light crispy tempura batter, served with warm dashi dipping sauce.',
          price: 9.99,
          category: 'Starters',
          isVeg: false,
          imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Matcha Green Tea Mochi',
          description: 'Soft sweet rice dough shells containing premium green tea ice cream.',
          price: 5.99,
          category: 'Dessert',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Chilled Sweet Matcha Latte',
          description: 'Ceremonial grade green tea whisked with cold milk and sweet honey over ice.',
          price: 4.99,
          category: 'Beverage',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600',
        },
      ],
    },
    {
      name: 'Taco Fiesta',
      slug: 'taco-fiesta',
      address: '33 Cantina Boulevard',
      rating: 4.4,
      cuisine: 'Mexican, Tacos, Tex-Mex',
      coverImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800',
      deliveryTime: 20,
      isPremium: false,
      menuItems: [
        {
          name: 'Birria Beef Tacos (3 Pcs)',
          description: 'Three crispy corn tortillas filled with slow-cooked shredded beef, melted Monterey Jack cheese, cilantro, and onion, served with warm consommé.',
          price: 13.99,
          category: 'Main Course',
          isVeg: false,
          imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Chipotle Jackfruit Quesadilla',
          description: 'Grilled flour tortilla filled with smoky chipotle jackfruit, black beans, roasted corn, and vegan cheese.',
          price: 11.99,
          category: 'Main Course',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Charred Corn Street Dip',
          description: 'Charred corn kernels tossed in spicy crema, lime juice, cotija cheese, served with fresh tortilla chips.',
          price: 6.99,
          category: 'Starters',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1577906096429-f73df2c32244?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Cinnamon Churros',
          description: 'Fried dough pastries dusted in cinnamon sugar, served with a hot dark chocolate dip.',
          price: 5.49,
          category: 'Dessert',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Classic Hibiscus Aqua Fresca',
          description: 'A sweet and refreshing cold tea brewed from dried hibiscus flowers, lime, and organic sugar.',
          price: 3.49,
          category: 'Beverage',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
        },
      ],
    },
    {
      name: 'Sweet Treats Patisserie',
      slug: 'sweet-treats-patisserie',
      address: '9 Sugar Lane',
      rating: 4.7,
      cuisine: 'Desserts, Bakery, Coffee',
      coverImage: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800',
      deliveryTime: 15,
      isPremium: true,
      menuItems: [
        {
          name: 'Premium French Macaron Box',
          description: 'Six assorted delicate almond flour macarons: pistachio, salted caramel, dark chocolate, raspberry, vanilla, and lemon.',
          price: 12.99,
          category: 'Dessert',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Molten Lava Cake',
          description: 'Rich chocolate cake with a warm liquid chocolate center, served with a scoop of vanilla bean ice cream.',
          price: 7.99,
          category: 'Dessert',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Warm Artisanal Chocolate Croissant',
          description: 'Flaky, buttery puff pastry laminated and filled with premium Belgian dark chocolate bars.',
          price: 4.99,
          category: 'Starters',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1549903072-7e6e0be077a5?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Caramel Macchiato Coffee',
          description: 'Hot steamed whole milk, layered with double espresso, vanilla syrup, and a rich caramel drizzle.',
          price: 4.49,
          category: 'Beverage',
          isVeg: true,
          imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=600',
        },
      ],
    },
  ];

  for (const restData of restaurantsData) {
    console.log(`Creating restaurant: ${restData.name}`);
    const { menuItems, ...restaurantInfo } = restData;
    const restaurant = await prisma.restaurant.create({
      data: restaurantInfo,
    });

    for (const item of menuItems) {
      await prisma.menuItem.create({
        data: {
          ...item,
          restaurantId: restaurant.id,
        },
      });
    }
  }

  // Create a default customer user for testing
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('customer123', 10);
  
  console.log('Creating default test customer user...');
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      phone: '1234567890',
      defaultAddress: '123 Main Street, New York, NY 10001',
      role: 'CUSTOMER',
    },
  });

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
