import { Navigate } from "react-router-dom";
import ListActions from "../component/admin/Actions/ListActions";

export const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const password = '123456'
const CheckPassword = () => {
    const enteredPassword = prompt('Nhập mật khẩu:');
    if (enteredPassword === password) {
        return <ListActions />;
    } else {
        return <Navigate to="/admin" />;
    }
};
export { CheckPassword }