import React, { useState, Fragment, useEffect } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { HomeIcon, ListBulletIcon, ArrowPathIcon, DocumentTextIcon, HeartIcon } from '@heroicons/react/24/outline'
import '../style/styles.css'
import { Link } from 'react-router-dom';  // Importation manquante


const Navbar = ({ isAuthenticated, onLogout, testPassNotification, testFailNotification }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message) => {
    setNotifications([...notifications, { type, message }]);
  };

  const removeNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  const handleTestExecution = async () => {
    const result = await executeTest();
    if (result) {
      addNotification('success', 'Test passé avec succès');
      testPassNotification();
    } else {
      addNotification('error', 'Le test a échoué');
      testFailNotification();
    }
  };

  const executeTest = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.5; 
        resolve(success);
      }, 1000);
    });
  };

  const navigation = [
    { name: 'Check-Apis', href: '/check-apis', icon: <HomeIcon className="h-6 w-6" />, current: false },
    { name: 'Test-All Apis', href: '/testallapis', icon: <ListBulletIcon className="h-6 w-6" />, current: false },
    { name: 'Test-Api', href: '/api-test', icon: <ArrowPathIcon className="h-6 w-6" />, current: false },
    { name: 'Test-Results', href: '/testresults', icon: <DocumentTextIcon className="h-6 w-6" />, current: false },
    { name: 'Health', href: '/health', icon: <HeartIcon className="h-6 w-6" />, current: false },
    { name: 'Metrice', href: '/metrice', icon: <HeartIcon className="h-6 w-6" />, current: false },
    { name: 'Admin', href: '/admin', current: false },


  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  // State to track scroll position
  const [isScrolled, setIsScrolled] = useState(false);

  // Function to handle scroll event
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    } 
  };

  // Attach scroll event listener when component mounts
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Disclosure as="nav" className={classNames("bg-white", isScrolled && "fixed-navbar")}>
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/check-apis">
                      <img
                        src="https://societegenerale.africa/fileadmin/user_upload/logos/160_logo_corporatenew_fr.svg"
                        alt="Logo"
                        className="h-10"
                      />
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block w-full">
                    <div className="flex justify-center space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current ? 'bg-gray-200 text-black' : 'text-gray-500 hover:bg-gray-200 hover:text-black',
                            'rounded-md px-3 py-2 text-sm font-medium flex items-center space-x-2'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {isAuthenticated && (
                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button className="relative rounded-full bg-white p-1 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white">
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                          {notifications.length > 0 && (
                            <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                              {notifications.length}
                            </span>
                          )}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Notification
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1493666438817-866a91353ca9" alt="" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={onLogout}
                              className={classNames(active ? 'bg-gray-100' : '', 'block w-full px-4 py-2 text-sm text-gray-700')}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default Navbar;
