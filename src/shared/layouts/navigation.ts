import type { LucideIcon } from 'lucide-react';
import {
  Armchair,
  CalendarClock,
  ChefHat,
  Cloud,
  CreditCard,
  Factory,
  FileBarChart,
  LayoutDashboard,
  Monitor,
  Package,
  Settings,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  to: string;
  icon: LucideIcon;
  roles: string[];
}

export const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard, roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER', 'KITCHEN', 'INVENTORY', 'HR', 'ACCOUNTANT'] },
  { name: 'POS', to: '/pos', icon: ShoppingCart, roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER'] },
  { name: 'Self-Order Kiosk', to: '/kiosk', icon: Monitor, roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER'] },
  { name: 'Kitchen', to: '/kds', icon: ChefHat, roles: ['OWNER', 'ADMIN', 'MANAGER', 'KITCHEN'] },
  { name: 'Tables', to: '/tables', icon: Armchair, roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER'] },
  { name: 'Inventory', to: '/inventory', icon: Package, roles: ['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'] },
  { name: 'Manufacturing', to: '/manufacturing', icon: Factory, roles: ['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY', 'KITCHEN'] },
  { name: 'Purchasing', to: '/purchasing', icon: Truck, roles: ['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY'] },
  { name: 'CRM & Loyalty', to: '/crm', icon: Users, roles: ['OWNER', 'ADMIN', 'MANAGER'] },
  { name: 'Finance', to: '/finance', icon: CreditCard, roles: ['OWNER', 'ADMIN', 'ACCOUNTANT'] },
  { name: 'HR & Payroll', to: '/hr', icon: CalendarClock, roles: ['OWNER', 'ADMIN', 'HR', 'MANAGER'] },
  { name: 'Reports & Analytics', to: '/reports', icon: FileBarChart, roles: ['OWNER', 'ADMIN', 'MANAGER', 'ACCOUNTANT'] },
  { name: 'AI Assistant', to: '/ai', icon: Sparkles, roles: ['OWNER', 'ADMIN'] },
  { name: 'Google Cloud (gcloud)', to: '/settings?tab=gcloud', icon: Cloud, roles: ['OWNER', 'ADMIN'] },
  { name: 'Settings', to: '/settings', icon: Settings, roles: ['OWNER', 'ADMIN', 'MANAGER'] },
];

export function getVisibleNavigation(roles?: string[]) {
  const userRoles = roles || ['OWNER'];
  return navigationItems.filter((item) => item.roles.some((role) => userRoles.includes(role)));
}
