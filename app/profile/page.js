"use client";

import { useState } from "react";
import {
  Grape,
  Home,
  Menu,
  Settings,
  ShoppingCart,
  User,
  Wine,
} from "lucide-react";
import Link from "next/link";

// Mock user data
const userData = {
  name: "Alice Wonderland",
  username: "alice_in_wineland",
  email: "alice@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  joinDate: "January 2023",
  totalNFTs: 3,
  totalValue: 2.5,
};

const page = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col overflow-hidden">

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-purple-600 text-white">
                <div className="flex items-center">
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                    <p className="text-purple-200">@{userData.username}</p>
                  </div>
                </div>
              </div>

              {/* Profile Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    activeTab === "profile"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-purple-600"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  Profile
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    activeTab === "stats"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-purple-600"
                  }`}
                  onClick={() => setActiveTab("stats")}
                >
                  Stats
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    activeTab === "settings"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-purple-600"
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </button>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                {activeTab === "profile" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        About Me
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Wine enthusiast and NFT collector. Passionate about
                        discovering unique digital wines and building a diverse
                        portfolio.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Contact Information
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Email: {userData.email}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Member Since
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {userData.joinDate}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "stats" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Collection Overview
                      </h3>
                      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="bg-purple-100 overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-purple-600 truncate">
                              Total NFTs Owned
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-purple-900">
                              {userData.totalNFTs}
                            </dd>
                          </div>
                        </div>
                        <div className="bg-purple-100 overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-purple-600 truncate">
                              Total Value (ETH)
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-purple-900">
                              {userData.totalValue}
                            </dd>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Recent Activity
                      </h3>
                      <ul className="mt-2 divide-y divide-gray-200">
                        <li className="py-3">
                          Purchased "Chateau Digital 2023" for 1.2 ETH
                        </li>
                        <li className="py-3">
                          Sold "Pixel Pinot Noir" for 0.8 ETH
                        </li>
                        <li className="py-3">
                          Added "Ethereum Estate Cabernet" to wishlist
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Account Settings
                      </h3>
                      <div className="mt-2 space-y-4">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            value={userData.email}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            value={userData.username}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Notification Preferences
                      </h3>
                      <div className="mt-2 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="email-notifications"
                            name="email-notifications"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label
                            htmlFor="email-notifications"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Receive email notifications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="sms-notifications"
                            name="sms-notifications"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label
                            htmlFor="sms-notifications"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Receive SMS notifications
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;
