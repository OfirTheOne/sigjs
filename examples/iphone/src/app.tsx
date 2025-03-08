import { createSignal, If, Renderable } from '@sigjs/sig';
import { icons } from './icons';

const {
    Camera,
    MessageSquare,
    Phone,
    Mail,
    Calendar,
    Music2,
    Settings,
    Clock,
    X
} = icons

interface App {
    id: string;
    name: string;
    icon: Renderable;
    color: string;
    content: string;
}

const apps: App[] = [
    {
        id: 'messages',
        name: 'Messages',
        icon: <MessageSquare className="w-8 h-8" />,
        color: 'bg-green-500',
        content: 'Messages app content here'
    },
    {
        id: 'phone',
        name: 'Phone',
        icon: <Phone className="w-8 h-8" />,
        color: 'bg-blue-500',
        content: 'Phone app content here'
    },
    {
        id: 'mail',
        name: 'Mail',
        icon: <Mail className="w-8 h-8" />,
        color: 'bg-red-500',
        content: 'Mail app content here'
    },
    {
        id: 'camera',
        name: 'Camera',
        icon: <Camera className="w-8 h-8" />,
        color: 'bg-gray-800',
        content: 'Camera app content here'
    },
    {
        id: 'calendar',
        name: 'Calendar',
        icon: <Calendar className="w-8 h-8" />,
        color: 'bg-orange-500',
        content: 'Calendar app content here'
    },
    {
        id: 'music',
        name: 'Music',
        icon: <Music2 className="w-8 h-8" />,
        color: 'bg-pink-500',
        content: 'Music app content here'
    },
    {
        id: 'settings',
        name: 'Settings',
        icon: <Settings className="w-8 h-8" />,
        color: 'bg-gray-500',
        content: 'Settings app content here'
    },
    {
        id: 'clock',
        name: 'Clock',
        icon: <Clock className="w-8 h-8" />,
        color: 'bg-yellow-500',
        content: 'Clock app content here'
    },
];


const createTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}


export function App() {
    const [openApp$, setOpenApp] = createSignal<App | null>(null);
    const [time$] = createSignal(createTimeString());

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809')] bg-cover flex items-center justify-center p-4">
            <div className="w-[375px] h-[812px] bg-black rounded-[60px] overflow-hidden relative shadow-2xl border-8 border-gray-800">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[40%] h-7 bg-black rounded-b-3xl z-50"></div>

                {/* Status Bar */}
                <div className="relative h-12 flex items-center justify-between px-6 text-white text-sm z-40">
                    <span>{time$}</span>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-white"></div>
                        <div className="w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>
                </div>

                {/* App Grid */}
                <div className="h-full pt-12 px-6 pb-8 bg-black/20 backdrop-blur-xl">
                    <div className="grid grid-cols-4 gap-6">
                        {apps.map((app) => (
                            <button
                                key={app.id}
                                onClick={() => setOpenApp(app)}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center text-white`}>
                                    {app.icon}
                                </div>
                                <span className="text-white text-xs">{app.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>

                {/* App Window */}
                <If condition={openApp$}
                    then={(
                        <div className="absolute inset-0 bg-white z-50 animate-slide-up">
                            <div className="flex items-center justify-between p-4 bg-gray-100">
                                <h2 className="text-lg font-semibold">{openApp$.select('name')}</h2>
                                <button
                                    onClick={() => setOpenApp(null)}
                                    className="p-2 hover:bg-gray-200 rounded-full"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-4">
                                <p>{openApp$.select('content')}</p>
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
}
