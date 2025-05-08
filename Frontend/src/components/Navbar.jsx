import { Link, useNavigate } from "react-router-dom";
import { HiMiniBars3CenterLeft, HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi";
import { logout } from "../redux/features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation } from "../redux/features/users/usersApi";

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const [logoutUser, { isLoading }] = useLogoutUserMutation();
    const dispatch = useDispatch();

    const handleLogOut = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            localStorage.removeItem("token");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="bg-primary max-w-screen-2xl mx-auto px-4 py-6">
            <nav className="flex justify-between items-center">
                <div className="flex gap-2">
                    <button>
                        <HiMiniBars3CenterLeft className="size-6"/>
                    </button>
                </div>

                <div className="relative flex items-center md:space-x-3 space-x-2">
                    <div>
                        {user ? (
                            <>
                                <label
                                className="bg-white text-sm font-semibold sm:ml-1 p-1 sm:px-6 px-2 flex items-center rounded-md"
                                >Hello! {user.name}</label>
                            </>
                        ) : (
                            <Link to="/login" className="bg-white gap-1 text-sm font-semibold sm:ml-1 p-1 sm:px-6 px-2 flex items-center rounded-md">
                                <HiOutlineUser/> 
                                Login
                            </Link>
                        )}
                    </div>
                    {user?<button
                        onClick={handleLogOut}
                        className="bg-white gap-1 text-sm font-semibold sm:ml-1 p-1 sm:px-6 px-2 flex items-center rounded-md hover:bg-gray-100"
                    >
                        Logout
                    </button>:<></>}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
