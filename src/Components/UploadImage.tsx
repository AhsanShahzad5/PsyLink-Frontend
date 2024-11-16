import usePreviewImage from "@/hooks/usePreviewImage";
import { useRef } from "react";
import { Input } from '@/Components/ui/input';

interface UploadImageProps {
    label?: string;
    text?: string;
}

export const UploadImage = ({ label = "Default Label", text = "Default Text" }: UploadImageProps) => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const { handleImageChange, imgUrl } = usePreviewImage();

    return (
        <>
            <label className="block text-lg md:text-xl font-medium text-gray-700">{label}</label>
            <div className="mt-1 p-3 w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl flex items-start">

            <button onClick={() => fileRef.current?.click()}  className="border border-gray-300  p-2 w-[183px] rounded-md bg-gray-300"
            >
                {text}
            </button>
            <Input type='file' className="hidden" ref={fileRef} onChange={handleImageChange} />
            {imgUrl && <img src={imgUrl} alt="Preview" className="mt-4 rounded-[15px]" />}
            </div>
        </>
    );
}
