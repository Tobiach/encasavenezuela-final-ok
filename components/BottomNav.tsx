import React from 'react';
import { Home, Users, MapPin, Heart, UserCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { label: 'Inicio',   icon: Home,       path: '/'           },
  { label: 'Locales',  icon: Users,       path: '/partners'   },
  { label: 'Mapa',     icon: MapPin,      path: '/locales-map'},
  { label: 'Favoritos',icon: Heart,       path: null          },
  { label: 'Perfil',   icon: UserCircle,  path: '/auth'       },
] as const;

const BottomNav: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-100 shadow-lg h-16 flex justify-around items-center">
      {TABS.map(({ label, icon: Icon, path }) => {
        const isActive = path !== null && location.pathname === path;
        return (
          <button
            key={label}
            onClick={() => path && navigate(path)}
            className={`flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-xl transition-all active:scale-90 ${
              isActive ? 'text-ven-yellow' : 'text-gray-400'
            } ${!path ? 'opacity-40 cursor-default' : ''}`}
          >
            <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
            <span className={`text-[9px] font-bold uppercase tracking-wider leading-none ${isActive ? 'font-black' : ''}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
