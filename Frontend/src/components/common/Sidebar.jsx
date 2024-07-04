import XSvg from '../svgs/X';

import { MdHomeFilled } from 'react-icons/md';
import { IoNotifications } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import useLogout from '../../hooks/auth/useLogout';
import { useQuery } from '@tanstack/react-query';

const Sidebar = () => {
  const data = {
    fullName: 'John Doe',
    username: 'johndoe',
    profileImg: '/avatars/boy1.png',
  };

  const { logout, isLogingOut } = useLogout();

  const { data: authUser } = useQuery({ queryKey: ['authuser'] });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {authUser && (
          <div className="mt-auto mb-10 flex justify-between  items-center transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full">
            <Link to={`/profile/${authUser.username}`} className="flex items-center gap-2">
              <div className="avatar hidden md:inline-flex">
                <div className="w-8 rounded-full">
                  <img src={authUser?.profileImg || '/avatar-placeholder.png'} />
                </div>
              </div>
              <div className="flex justify-between flex-1">
                <div className="hidden md:block">
                  <p className="text-white font-bold text-sm w-20 truncate">{authUser?.fullname}</p>
                  <p className="text-slate-500 text-sm">@{authUser?.username}</p>
                </div>
              </div>
            </Link>
            <button onClick={logout}>
              {isLogingOut ? (
                <span className="loading loading-spinner" />
              ) : (
                <BiLogOut className="w-5 h-5 cursor-pointer" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
