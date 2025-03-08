import { 
    createIcons,
    Camera, 
    MessageSquare, 
    Phone, 
    Mail, 
    Calendar, 
    Music2, 
    Settings, 
    Clock,
    X
  } from 'lucide';


createIcons({
    icons: {
        Camera,
        MessageSquare,
        Phone, 
        Mail, 
        Calendar, 
        Music2, 
        Settings, 
        Clock,
        X
    }
});

import { createIcons as adapter } from './adapter';

export const icons = adapter({
    Camera,
    MessageSquare,
    Phone, 
    Mail, 
    Calendar, 
    Music2, 
    Settings, 
    Clock,
    X
});