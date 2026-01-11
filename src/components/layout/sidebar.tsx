'use client';

import {
  Bell,
  FileCog,
  Home,
  ListChecks,
  Shield,
  Video,
  Warehouse,
  Film,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/events', icon: Bell, label: 'Events', badge: '12' },
  { href: '/actions', icon: ListChecks, label: 'Corrective Actions' },
  { href: '/rules', icon: FileCog, label: 'Safety Rules' },
  { href: '/cameras', icon: Video, label: 'Cameras' },
  { href: '/zones', icon: Warehouse, label: 'Sites & Zones' },
  { href: '/video-analysis', icon: Film, label: 'Video Analysis' },
  { href: '/faq', icon: HelpCircle, label: 'FAQ' },
];

export function SidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full max-h-screen flex-col gap-2", isMobile ? "w-full" : "hidden md:flex")}>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <Shield className="h-6 w-6" />
          <span className="">Vision EHS</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map(({ href, icon: Icon, label, badge }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  isActive && 'bg-muted text-primary'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {badge && (
                  <Badge className={cn("ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full", isActive ? "bg-primary text-primary-foreground": "")}>
                    {badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden border-r bg-card md:block w-64">
      <SidebarNav />
    </aside>
  );
}
