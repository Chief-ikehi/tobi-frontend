'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ThemeToggler from "./ThemeToggler"
import menuData from "./menuData"
import axios from "@/lib/axios"
import { toast } from "react-hot-toast"

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [dropdownToggler, setDropdownToggler] = useState(false)
  const [stickyMenu, setStickyMenu] = useState(false)
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const pathUrl = usePathname()

  const signinButton = () => router.push("/auth/signin")
  const signupButton = () => router.push("/auth/signup")

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    toast.success("Signed out successfully", { position: "top-center", duration: 4000 })

    // Force reload so header updates immediately
    window.location.href = "/auth/signin"
  }

  const handleStickyMenu = () => {
    if (window.scrollY >= 20) setStickyMenu(true)
    else setStickyMenu(false)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu)
    return () => window.removeEventListener("scroll", handleStickyMenu)
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/auth/profile/")
        const data = res.data
        setUser({
          name: data.user.first_name,
          email: data.user.email,
          role: data.user.role,
          dashboard: data.dashboard,
        })
      } catch (error) {
        setUser(null)
      }
    }

    fetchProfile()
  }, [])

  const handleLinkClick = () => {
    setNavigationOpen(false)
    setDropdownToggler(false)
  }

  const isActive = (path: string) => pathUrl === path

  const AuthButtons = () => {
    if (user) {
      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link href={user.dashboard || "/dashboard"}>
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-white text-sm font-semibold hover:scale-110 transition-transform">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </Link>
            <Link href={user.dashboard || "/dashboard"}>
              <p className="text-sm">{user.name}</p>
            </Link>
          </div>
          <button
            onClick={logout}
            className="rounded-full bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-800"
          >
            Sign Out
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-4">
        <button
          onClick={signinButton}
          className="text-regular text-waterloo hover:text-primary"
        >
          Sign In
        </button>
        <button
          onClick={signupButton}
          className="rounded-full bg-primary px-4 py-2 text-regular text-white hover:bg-primaryho"
        >
          Sign Up
        </button>
      </div>
    )
  }

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        stickyMenu
          ? "bg-white !py-4 shadow-md dark:bg-black"
          : "bg-transparent py-7"
      }`}
    >
      <div className="relative mx-auto max-w-c-1390 items-center justify-between px-4 md:px-8 xl:flex 2xl:px-0">
        <div className="flex w-full items-center justify-between xl:w-1/4">
          <Link href="/">
            <Image
              src="/images/logo/tobi-logo-dark.svg"
              alt="logo"
              width={119}
              height={30}
              className="w-full transition-transform duration-300 ease-in-out hover:scale-110"
            />
          </Link>

          <button
            aria-label="Toggle navigation menu"
            className="block xl:hidden"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="absolute right-0 block h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "!w-full delay-300" : "w-0"
                  }`}
                />
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "delay-400 !w-full" : "w-0"
                  }`}
                />
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "!w-full delay-500" : "w-0"
                  }`}
                />
              </span>
              <span className="du-block absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "!h-0 delay-[0]" : "h-full"
                  }`}
                />
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "!h-0 delay-200" : "h-0.5"
                  }`}
                />
              </span>
            </span>
          </button>
        </div>

        <div
          className={`invisible h-0 w-full items-center justify-between xl:visible xl:flex xl:h-auto xl:w-full ${
            navigationOpen &&
            "navbar !visible mt-4 h-auto max-h-[400px] transition-all duration-300 ease-in-out rounded-md bg-white p-7.5 shadow-solid-5 dark:bg-blacksection xl:h-auto xl:p-0 xl:shadow-none xl:dark:bg-transparent"
          }`}
        >
          <nav>
            <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-10">
              {menuData.map((menuItem, key) => (
                <li key={key} className={menuItem.submenu && "group relative"}>
                  {menuItem.submenu ? (
                    <>
                      <button
                        onClick={() => setDropdownToggler(!dropdownToggler)}
                        className="flex cursor-pointer items-center justify-between gap-3 hover:text-primary"
                      >
                        {menuItem.title}
                        <svg
                          className="h-3 w-3 cursor-pointer fill-waterloo group-hover:fill-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                        </svg>
                      </button>
                      <ul
                        className={`dropdown ${
                          dropdownToggler ? "flex" : "hidden"
                        } absolute left-0 top-full mt-2 space-y-2 rounded-md bg-white p-4 shadow-lg dark:bg-black`}
                      >
                        {menuItem.submenu.map((item, key) => (
                          <li key={key} className="hover:text-primary">
                            <Link href={item.path || "#"} onClick={handleLinkClick}>
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={menuItem.path}
                      className={
                        isActive(menuItem.path)
                          ? "text-primary hover:text-primary"
                          : "hover:text-primary"
                      }
                      onClick={handleLinkClick}
                    >
                      {menuItem.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-7 flex items-center gap-6 xl:mt-0">
            <ThemeToggler />
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header