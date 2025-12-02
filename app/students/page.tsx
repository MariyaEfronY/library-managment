"use client";



import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import BookRequestForm from "./components/BookRequestForm";
import { useState } from "react";

export default function StudentsPage() {
  const [tab, setTab] = useState<"register" | "login" | "request">("register");

  return (
    <div style={{ width: "500px", margin: "40px auto" }}>
      <h1>Students Portal</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setTab("register")}>Register</button>
        <button onClick={() => setTab("login")}>Login</button>
        <button onClick={() => setTab("request")}>Book Request</button>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
        {tab === "register" && <RegisterForm />}
        {tab === "login" && <LoginForm />}
        {tab === "request" && <BookRequestForm />}
      </div>
    </div>
  );
}
