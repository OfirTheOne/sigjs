import { 
    createIcons, 
    ArrowUpDown, 
    Type, 
    User, 
    Calendar,
    Trophy,
    GripVertical,
    ChevronRight,
    CheckSquare,
    Square,
    Plus,
    X,
    ChevronDown,
    Minimize2, 
    Maximize2
 } from 'lucide';

 import { createIcons as sigCreateIcons } from './lucide-adapter';

createIcons({
    icons: {
        ArrowUpDown,
        Type,
        User,
        Calendar,
        Trophy,
        GripVertical,
        ChevronRight,
        CheckSquare,
        Square,
        Plus,
        X,
        ChevronDown,
        Minimize2, 
        Maximize2
    }
});

export const icons = sigCreateIcons({
    ArrowUpDown,
    Type,
    User,
    Calendar,
    Trophy,
    GripVertical,
    ChevronRight,
    CheckSquare,
    Square,
    Plus,
    X,
    ChevronDown,
    Minimize2, 
    Maximize2
});