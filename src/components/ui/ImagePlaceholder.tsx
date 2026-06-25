import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

// Shows the image if a URL exists, otherwise a clean placeholder box.
// The admin uploads every image later; nothing is hardcoded.
export function ImageBox({
  src,
  alt = '',
  className = ''
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  if (src) {
    return <Image src={src} alt={alt} fill className={`object-cover ${className}`} />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
      <div className="flex flex-col items-center gap-2">
        <ImageIcon className="h-10 w-10" />
        <span className="text-xs">Add image from admin</span>
      </div>
    </div>
  );
}
