import usePreviewImage from "@/hooks/usePreviewImage";
import { useEffect, useRef } from "react";
import { Input } from '@/Components/ui/input';

interface UploadImageProps {
    label?: string;
    text?: string;
    onImageChange: (imgUrl: string) => void;
    required?: boolean;

}

export const UploadImage = ({ label = "Default Label", text = "Default Text" , onImageChange, required = false}: UploadImageProps) => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const { handleImageChange, imgUrl } = usePreviewImage();
    useEffect(() => {
        if (imgUrl) {
            onImageChange(imgUrl);
        }
    }, [imgUrl, onImageChange]);

    return (
        <div className="flex flex-col items-start">
           <label className="block text-lg md:text-xl font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
            <div className="mt-1 p-3 w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl flex items-start">

            <button onClick={() => fileRef.current?.click()}  className="border border-gray-300  p-2 w-[183px] rounded-md bg-gray-300"
            >
                {text}
            </button>
            <Input type='file' className="hidden" ref={fileRef} onChange={handleImageChange} />
            </div>
        </div>
    );
}
