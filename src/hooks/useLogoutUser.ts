import { useNavigate } from "react-router-dom";
//import userAtom from "../atoms/userAtom";
//import { useSetRecoilState } from "recoil";
import { useDispatch } from "react-redux";
import { clearUser } from '../slices/authSlice';
// import useShowToast from "./useShowToast";

const useLogout = () => {
    //const setUser = useSetRecoilState(userAtom);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const showToast = useShowToast();

    const logout = async () => {
        try {
            const res = await fetch("/api/user/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            if (data.error) {
                // showToast("Error", data.error, "error");
                console.log(data.error)
                return;
            }

            localStorage.removeItem("psylink");
            dispatch(clearUser());
            //setUser(null);
            navigate('/login');
        } catch (error) {
            // showToast("Error", error, "error");
            console.log(error)
            // showToast("Error", error, "error");
        }
    };

    return logout;
};

export default useLogout;