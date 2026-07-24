export const ROLE_OPTIONS = ['Customer', 'RestaurantStaff', 'HotelStaff', 'RestaurantManager', 'HotelManager', 'SuperAdmin'];

export const DEFAULT_ROUTE_BY_ROLE = {
  Customer: '/menu',
  RestaurantStaff: '/orders',
  HotelStaff: '/orders',
  RestaurantManager: '/manager-dashboard',
  HotelManager: '/manager-dashboard',
  SuperAdmin: '/super-admin',
};
