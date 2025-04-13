declare module 'react-native-vector-icons/Feather' {
  import { Icon } from 'react-native-vector-icons/Icon';

  const FeatherIcon: Icon;
  export { FeatherIcon as Mail }; // For email input in Login/Signup
  export { FeatherIcon as Lock }; // For password input in Login/Signup
  export { FeatherIcon as Eye }; // For show password in Login/Signup
  export { FeatherIcon as EyeOff }; // For hide password in Login/Signup
  export { FeatherIcon as User }; // For username input in Signup and Profile
  export { FeatherIcon as ChevronRight }; // For menu items in Profile
  export { FeatherIcon as LogOut }; // For sign out in Profile
  export { FeatherIcon as ShoppingCart }; // For My Orders in Profile
  export { FeatherIcon as Heart }; // For My Favorites in Profile
  export { FeatherIcon as MapPin }; // For My Address in Profile
  export { FeatherIcon as CreditCard }; // For Credit Cards in Profile
  export { FeatherIcon as DollarSign }; // For Transactions in Profile
  export { FeatherIcon as Bell }; // For Notifications in Profile
  export { FeatherIcon as Home }; // For Home in navigation
  export { FeatherIcon as Signal }; // For signal in action bar
  export { FeatherIcon as Wifi }; // For wifi in action bar
  export { FeatherIcon as Battery }; // For battery in action bar

  export default FeatherIcon;
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}