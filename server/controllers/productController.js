// In-memory storage for demo
let products = [
  {
    _id: '1',
    name: 'Rose Glow Face Serum',
    description: 'Luxurious rose-infused face serum that hydrates and brightens your skin.',
    price: 29.99,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
    stock: 45,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Velvet Matte Lipstick',
    description: 'Long-lasting velvet matte lipstick in a stunning shade of berry.',
    price: 18.99,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    stock: 120,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Baby Gentle Wash',
    description: 'Tear-free, pH-balanced gentle body wash specially formulated for babies.',
    price: 12.99,
    category: 'baby-products',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    stock: 80,
    featured: true,
    createdAt: new Date().toISOString()
  }
];

/**
 * @desc    Get all products with optional filtering and search
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let filteredProducts = [...products];

    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Filter featured products
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured === true);
    }

    // Search by name or description
    if (search) {
      const q = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products', error: error.message });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = products.find(p => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching product', error: error.message });
  }
};

/**
 * @desc    Create a new product (Admin only)
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock, featured } = req.body;

    const newProduct = {
      _id: Date.now().toString(),
      name,
      description,
      price,
      category,
      image: image || '',
      stock: stock || 0,
      featured: featured || false,
      createdAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating product', error: error.message });
  }
};

/**
 * @desc    Update a product (Admin only)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock, featured } = req.body;
    const index = products.findIndex(p => p._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products[index] = {
      ...products[index],
      name: name || products[index].name,
      description: description || products[index].description,
      price: price || products[index].price,
      category: category || products[index].category,
      image: image !== undefined ? image : products[index].image,
      stock: stock !== undefined ? stock : products[index].stock,
      featured: featured !== undefined ? featured : products[index].featured,
    };

    res.json(products[index]);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product', error: error.message });
  }
};

/**
 * @desc    Delete a product (Admin only)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const index = products.findIndex(p => p._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products.splice(index, 1);
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
