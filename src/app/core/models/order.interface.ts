export interface Order {
    _id: string;
    user: string;
    cartItems: OrderItem[];
    shippingAddress: ShippingAddress;
    taxPrice: number;
    shippingPrice: number;
    totalOrderPrice: number;
    paymentMethodType: 'cash' | 'card';
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
    updatedAt: string;
    id: string;
}

export interface OrderItem {
    count: number;
    _id: string;
    product: OrderProduct;
    price: number;
}

export interface OrderProduct {
    subcategory: Subcategory[];
    _id: string;
    title: string;
    quantity: number;
    imageCover: string;
    category: Category;
    brand: Brand;
    ratingsAverage: number;
    id: string;
}

export interface ShippingAddress {
    details: string;
    phone: string;
    city: string;
}

export interface Subcategory {
    _id: string;
    name: string;
    slug: string;
    category: string;
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface OrdersResponse {
    status: string;
    results: number;
    data: Order[];
}
