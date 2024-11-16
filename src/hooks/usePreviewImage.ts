import { useState } from "react";
//import useShowToast from "./useShowToast";

const usePreviewImage = () => {
  //const showToast = useShowToast()
    const [imgUrl, setImgUrl] = useState<string>('')
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: File | undefined = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = (): void => {
            setImgUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    } else {
        setImgUrl('');
    }
};
  
    return {handleImageChange , imgUrl , setImgUrl}
}

export default usePreviewImage