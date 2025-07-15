import React, { useState, useContext } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    if (currState === "Sign up" && isDataSubmitted) {
      await login("signup", { fullName, email, password, bio });
    } else if (currState === "Login") {
      await login("login", { email, password });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-10 bg-cover bg-center backdrop-blur-xl gap-10">
      {/* ------------ Left ------------ */}
      <div className="flex flex-col items-center  md:justify-end md:w-1/2">
        <img src={assets.logo_big} alt="logo" className="w-[min(50vw, 200px)] max-w-[200px]" />
      </div>

      {/* ------------ Right ------------ */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-gray-500 text-white p-6 rounded-lg shadow-xl flex flex-col gap-6"
      >
        <h2 className="text-2xl font-semibold flex items-center justify-between">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              className="w-5 cursor-pointer"
              alt="Back"
            />
          )}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            id="fullName"
            name="fullName"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            placeholder="Full Name"
            required
            className="p-2 border border-gray-500 rounded-md bg-transparent placeholder-gray-300"
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md bg-transparent placeholder-gray-300"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md bg-transparent placeholder-gray-300"
            />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Provide a short bio..."
            rows={4}
            required
            className="p-2 border border-gray-500 rounded-md bg-transparent placeholder-gray-300"
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white font-semibold rounded-md"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="text-center text-sm text-gray-300">
          {currState === "Sign up" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className="text-violet-400 font-medium cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Sign up");
                  setIsDataSubmitted(false);
                }}
                className="text-violet-400 font-medium cursor-pointer"
              >
                Sign up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
