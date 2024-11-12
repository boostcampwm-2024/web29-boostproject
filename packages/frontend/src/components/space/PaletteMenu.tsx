import { X, Image, Link, NotebookPen } from 'lucide-react';

type PaletteButtonType = 'note' | 'image' | 'link' | 'close';   
type Position = { top: number; left: number;}

type PaletteButtonProps = {
    variant: PaletteButtonType;
    position?: Position;
    buttonSize: number;
}

function PaletteButton({ 
    variant,
    position,
    buttonSize,
}: PaletteButtonProps ) {
    const buttonConfig = {
        note: {
          icon: NotebookPen,
          color: 'fill-yellow-300',
          // TODO: 이후 추가될 것을 고려하여 작성
          //   handler: async () => {
          //   }
        },
        image: {
          icon: Image,
          color: 'fill-yellow-400',
        },
        link: {
          icon: Link,
          color: 'fill-yellow-500',
        },
        close: {
          icon: X,
          color: 'fill-yellow-200',
        }
      } as const;

    const config = buttonConfig[variant]
    const Icon = config.icon;  

    return (
        <button
            className="absolute transition-transform hover:scale-110"
            style={{ 
                top: position?.top || undefined,
                left: position?.left || undefined,
                width: buttonSize,
                height: buttonSize
            }}
        >
            <svg viewBox="0 0 100 100">
                <polygon points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25" className={config.color} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-6 h-6" />
            </div>
        </button>
    );
}


type PaletteMenuProps = {
    itemTypes: PaletteButtonType[];
}

export default function PaletteMenu({
    itemTypes
}: PaletteMenuProps) {

    const layoutConfig = { 
        radius: 60,
        centerPoint: 80,
        containerSize: 160,
        buttonSize: 60
    } as const;

    const getPositionByIndex = (index: number): Position => {
        const angle = (index * 60) * (Math.PI / 180); 
        
        return {
            top: layoutConfig['centerPoint'] - layoutConfig['buttonSize']/2 + (layoutConfig['radius'] * Math.sin(angle)),
            left: layoutConfig['centerPoint'] - layoutConfig['buttonSize']/2 + (layoutConfig['radius'] * Math.cos(angle))
        };
    };

    return (
        <div className='relative bg-red-600 w-40 h-40'>
            <PaletteButton variant='close' position={{ top: layoutConfig['containerSize']/2-layoutConfig['buttonSize'] / 2, left: layoutConfig['containerSize']/2 -layoutConfig['buttonSize'] / 2
              }} buttonSize={layoutConfig['buttonSize']}/>
            {itemTypes.map((variant, index) => (
                <PaletteButton 
                    key={index}
                    variant={variant}
                    position={getPositionByIndex(index)}
                    buttonSize={layoutConfig['buttonSize']}
                />
            ))}
        </div>
    );
}