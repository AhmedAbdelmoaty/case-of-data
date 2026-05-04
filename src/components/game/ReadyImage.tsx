import { useEffect, useRef, useState } from "react";
import { preloadImage } from "@/lib/assetPreloader";

interface ReadyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const ReadyImage = ({ src, className = "", style, ...props }: ReadyImageProps) => {
  const [readySrc, setReadySrc] = useState(src);
  const previousSrcRef = useRef(src);

  useEffect(() => {
    let cancelled = false;
    preloadImage(src).then(() => {
      if (cancelled) return;
      previousSrcRef.current = src;
      setReadySrc(src);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <img
      {...props}
      src={readySrc || previousSrcRef.current}
      className={className}
      style={style}
    />
  );
};
