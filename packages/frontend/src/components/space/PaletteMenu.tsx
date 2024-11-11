import { X, Image, Link, NotebookPen } from 'lucide-react';

type PaletteButtonType = 'note' | 'image' | 'link' | 'close';   
type PaletteButtonProps = {
    variant: PaletteButtonType;
}

function PaletteButton({ 
    variant,
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
        <button className="relative w-20 h-20 transition-transform hover:scale-110">
            <svg viewBox="0 0 100 100">
                <polygon points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25" className={config.color} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-6 h-6" />
            </div>
        </button>
    );
}


export default function PaletteMenu() {
    return (
        <div>
            <PaletteButton variant='note'/>
            <PaletteButton variant='close'/>
            <PaletteButton variant='image'/>
            <PaletteButton variant='link'/>
            <PaletteButton variant='image'/>
            <PaletteButton variant='note'/>
            <PaletteButton variant='link'/>
        </div>
    );
}