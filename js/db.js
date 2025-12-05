// js/db.js

const products = [
    // --- LOCAL ---
    {
        id: "l1",
        name: "Nasi Lemak Kukus Biasa",
        price: 6.00,
        category: "local",
        desc: "Traditional steamed coconut rice with sambal and condiments.",
        img: "images/nasi_lemak_kukus_biasa.jpg"
    },
    {
        id: "l2",
        name: "Nasi Ayam Crunchy",
        price: 12.00,
        category: "local",
        desc: "Crispy fried chicken served with fragrant rice and soup.",
        img: "images/nasi_ayam_crunchy.png"
    },
    {
        id: "l3",
        name: "Nasi Lemak Buttermilk",
        price: 15.00,
        category: "local",
        desc: "Our signature nasi lemak paired with creamy buttermilk chicken.",
        img: "images/nasilemak_kukus_buttermilk.png"
    },

    // --- WESTERN ---
    {
        id: "w1",
        name: "Chicken Chop",
        price: 16.00,
        category: "western",
        desc: "Deep-fried marinated chicken thigh served with fries and coleslaw.",
        img: "images/chicken_chop.png"
    },
    {
        id: "w2",
        name: "Fettucine Buttermilk",
        price: 18.00,
        category: "western",
        desc: "Creamy buttermilk sauce tossed with fettucine pasta.",
        img: "images/fettucine_buttermilk.png"
    },
    {
        id: "w3",
        name: "Spaghetti Carbonara",
        price: 18.00,
        category: "western",
        desc: "Classic creamy white sauce pasta with mushrooms.",
        img: "images/spaghetti_carbonara.jpg"
    },
    {
        id: "w4",
        name: "Spaghetti Bolognese",
        price: 18.00,
        category: "western",
        desc: "Experience nice bolognese in town.",
        img: "images/spaghetti_bolognese.png"
    },

    // --- SIDES (Categorized as Western/Snack for filter) ---
    {
        id: "s1",
        name: "Popcorn Chicken",
        price: 10.00,
        category: "western",
        desc: "Bite-sized fried chicken snacks.",
        img: "images/popcorn_chicken.jpg"
    },
    {
        id: "s2",
        name: "Meatball Fries",
        price: 12.00,
        category: "western",
        desc: "Meatballs served with cheesy fries.",
        img: "images/meatball_fries.jpg"
    },
    {
        id: "s3",
        name: "Spring Roll",
        price: 6.00,
        category: "western",
        desc: "Crispy vegetable spring rolls.",
        img: "images/spring_roll.png"
    },

    // --- DRINKS ---
    {
        id: "b1",
        name: "Strawberry Frappe",
        price: 13.00,
        category: "drinks",
        desc: "Fresh strawberry ice blended drink.",
        img: "images/straw_frappe.jpg"
    },
    {
        id: "b2",
        name: "Blue Monster Frappe",
        price: 14.00,
        category: "drinks",
        desc: "A vibrant blue vanilla citrus blend.",
        img: "images/blue_monster.jpg"
    },
    {
        id: "b3",
        name: "Vietnam Frappe",
        price: 14.00,
        category: "drinks",
        desc: "Strong Vietnamese coffee blend frappe.",
        img: "images/vietnam_frappe.jpg"
    },
    {
        id: "b4",
        name: "Butterscotch Frappe",
        price: 13.00,
        category: "drinks",
        desc: "Ice blended butterscotch drink.",
        img: "images/butterscotch.png"
    },
    {
        id: "b5",
        name: "Banana Frappe",
        price: 13.00,
        category: "drinks",
        desc: "Sweet and creamy banana ice blend.",
        img: "images/banana_frappe.jpg"
    },
    {
        id: "b6",
        name: "Chocolate Larva",
        price: 12.00,
        category: "drinks",
        desc: "Iced chocolate cake with ice cream.",
        img: "images/choc_larva.png"
    },
    {
        id: "b7",
        name: "Mineral Water",
        price: 2.00,
        category: "drinks",
        desc: "Chilled mineral water.",
        img: "images/water.jpg"
    },

    // --- DESSERT ---
    {
        id: "d1",
        name: "Strawberry Waffle",
        price: 6.00,
        category: "dessert",
        desc: "Waffle with strawberry jam.",
        img: "images/straw_waffle.jpg"
    },
    {
        id: "d2",
        name: "Chocolate Waffle",
        price: 6.00,
        category: "dessert",
        desc: "Waffle with rich chocolate.",
        img: "images/chocolate_waffle.jpg"
    },
    {
        id: "d3",
        name: "Peanut Waffle",
        price: 5.00,
        category: "dessert",
        desc: "Classic waffle with peanut spread.",
        img: "images/peanut_waffle.jpg"
    }
];
