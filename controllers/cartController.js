const Product = require('../models/Product');

const formatPrice = (price) => `${Number(price).toFixed(2)} TL`;

const normalizePhoneNumber = (phoneNumber) => {
  return String(phoneNumber || '').replace(/\D/g, '');
};

const buildWhatsAppMessage = ({ cartItems, totalPrice, customerName, note }) => {
  const lines = ['Merhaba, asagidaki urunler icin siparis vermek istiyorum:', ''];

  if (customerName) {
    lines.push(`Musteri: ${customerName}`, '');
  }

  cartItems.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name}`,
      `Adet: ${item.quantity}`,
      item.hasDiscount
        ? `Birim fiyat: ${formatPrice(item.unitPrice)} (Indirimli, eski fiyat: ${formatPrice(item.oldPrice)})`
        : `Birim fiyat: ${formatPrice(item.unitPrice)}`,
      `Ara toplam: ${formatPrice(item.subtotal)}`,
      '',
    );
  });

  lines.push(`Toplam: ${formatPrice(totalPrice)}`);

  if (note) {
    lines.push('', `Not: ${note}`);
  }

  return lines.join('\n');
};

const createWhatsAppCartLink = async (req, res, next) => {
  try {
    const { items, customerName, note } = req.body;
    const sellerPhoneNumber = normalizePhoneNumber(
      req.body.phoneNumber || process.env.WHATSAPP_PHONE_NUMBER,
    );

    if (!sellerPhoneNumber) {
      return res.status(500).json({
        success: false,
        message: 'WhatsApp telefon numarasi sunucuda tanimli degil',
      });
    }

    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } })
      .select('name price oldPrice discountPrice image')
      .lean();

    if (products.length !== new Set(productIds).size) {
      return res.status(404).json({
        success: false,
        message: 'Sepetteki urunlerden biri bulunamadi',
      });
    }

    const productsById = new Map(
      products.map((product) => [product._id.toString(), product]),
    );

    const cartItems = items.map((item) => {
      const product = productsById.get(item.productId);
      const quantity = Number(item.quantity);
      const hasDiscount = Boolean(product.discountPrice);
      const unitPrice = Number(hasDiscount ? product.discountPrice : product.price);
      const subtotal = unitPrice * quantity;

      return {
        productId: product._id.toString(),
        name: product.name,
        image: product.image,
        quantity,
        unitPrice,
        oldPrice: product.oldPrice,
        discountPrice: product.discountPrice,
        hasDiscount,
        subtotal,
      };
    });

    const totalPrice = cartItems.reduce((total, item) => total + item.subtotal, 0);
    const message = buildWhatsAppMessage({
      cartItems,
      totalPrice,
      customerName,
      note,
    });
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${sellerPhoneNumber}?text=${encodedMessage}`;

    return res.status(200).json({
      success: true,
      data: {
        items: cartItems,
        totalPrice,
        message,
        encodedMessage,
        whatsappUrl,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createWhatsAppCartLink,
};
