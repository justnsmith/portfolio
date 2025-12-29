import { NavigationLinksProps } from '../../types';

export default function NavigationLinks({ sectionIds, activeSection, onNavigate }: NavigationLinksProps) {
    return (
        <div className="flex flex-col gap-8 mb-8">
            {sectionIds.map((id) => (
                <button
                    key={id}
                    onClick={() => onNavigate(id)}
                    className={`relative text-sm font-medium transition-all duration-300 hover:text-white group ${
                        activeSection === id
                            ? "text-white scale-110"
                            : "text-gray-400"
                    }`}
                >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                    <span
                        className={`absolute left-0 bottom-0 w-full h-0.5 bg-indigo-500 transform origin-left transition-transform duration-300 ${
                            activeSection === id ? 'scale-x-100' : 'scale-x-0'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}
