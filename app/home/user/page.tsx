"use client";
import { useEffect } from "react";
import { useState } from "react";
import { getUserData } from "./actions";
import { Button } from "@nextui-org/react";

export default function User() {
  type UserData = {
    name: string;
    email: string;
    dob: string;
    password: string;
  };

  let token = localStorage.getItem("sophia_token");
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
    fetchData();
    console.log(userData);
  }, [token]);

  async function fetchData() {
    let user = await getUserData(token as string);
    setUserData({
      name: user.name,
      email: user.email,
      dob: user.dob,
      password: user.password,
    });
  }

  return (
    <>
      <div className="text-5xl mt-4 font-bold">{userData?.name}</div>
      <div className="text-3xl ml-1 mt-4">{userData?.email}</div>
      <div className="mt-4">
      <Button className="mr-4">Alterar senha</Button>
      <Button>Alterar email</Button>
      </div>
    </>
  );
}
