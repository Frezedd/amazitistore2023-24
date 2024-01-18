import React, { useState } from "react";
import ArrowRight from "@mui/icons-material/ArrowRight";
import { darklogo } from "../assets/index";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {RotatingLines} from 'react-loader-spinner'
import {motion} from 'framer-motion'

const Resgistration = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  // Error Message Start
  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errCPassword, setErrCPassword] = useState("");
  const [firebaseErr, setFirebaseErr] = useState("");
  // Error Message Ends

  // Loading start here
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  // Loading Ends here

  // Handle function Start
  const handleName = (e) => {
    setClientName(e.target.value);
    setErrClientName("");
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };
  const handleCPassword = (e) => {
    setCPassword(e.target.value);
    setErrCPassword("");
  };
  // Handle function Ends

  // Email Validation Start
  const emailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);
  };
  // Email Validation Ends

  // Submit Button Start
  const handleResgistration = (e) => {
    e.preventDefault();
    if (!clientName) {
      setErrClientName("Enter Your Name");
    }
    if (!email) {
      setErrEmail("Enter Your email or mobile phone number");
      setFirebaseErr("");
    } else {
      if (!emailValidation(email)) {
        setErrEmail("Enter a valid email");
      }
    }
    if (!password) {
      setErrPassword("Enter Your Password");
    } else {
      if (password.length < 6) {
        setErrPassword("Password must be at least 6 characters");
      }
    }
    if (!cPassword) {
      setErrCPassword("Confrim Your Password");
    } else {
      if (cPassword !== password) {
        setErrCPassword("Password not Matched");
      }
    }

    if (
      clientName &&
      email &&
      emailValidation(email) &&
      password &&
      password.length >= 6 &&
      cPassword &&
      cPassword === password
    ) {

      setLoading(true); 
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          updateProfile(auth.currentUser, {
            displayName: clientName,
            photoURL:"#",
          });
          // Signed up
          const user = userCredential.user;

          setLoading(false);
          setSuccessMsg("Account Created Successfully!");
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
          // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode.includes("auth/email-already-in-use")) {
              setFirebaseErr("Email Already in use, try another one");
            }
            // ...
          });

      
        //  =========== Firebase Registration End here =============== 
      
      setClientName("");
      setEmail("");
      setPassword("");
      setCPassword("");
      setErrCPassword("");
      setFirebaseErr("");
    }

  };
  // Submit Button Ends

  return (
    <div className="w-full">
      <div className="w-full bg-gray-100 pb-10">
        <form className="w-[370px] mx-auto flex flex-col items-center">
          <img className="w-32" src={darklogo} alt="darklogo" />
          <div className="w-full border border-zinc-200 p-6">
            <h2 className="font-titleFont text-3xl font-medium mb-4">
              Create Account
            </h2>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Your name</p>

                <input
                  onChange={handleName}
                  value={clientName}
                  type="text"
                  className="w-full py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#0000FF] focus-within:shadow-amazonInput duration-100"
                />
                {errClientName && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-extrabold text-base">
                      !
                    </span>
                    {errClientName}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium"> Mobile number or email</p>

                <input
                  onChange={handleEmail}
                  value={email}
                  type="email"
                  className="w-full lowercase py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#0000FF] focus-within:shadow-amazonInput duration-100"
                />
                {errEmail && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-extrabold text-base">
                      !
                    </span>
                    {errEmail}
                  </p>
                )}

                {firebaseErr && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-extrabold text-base">
                      !
                    </span>
                    {firebaseErr}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium"> Password</p>

                <input
                  onChange={handlePassword}
                  value={password}
                  type="Password"
                  className="w-full py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#0000FF] focus-within:shadow-amazonInput duration-100"
                />
                {errPassword && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-extrabold text-base">
                      !
                    </span>
                    {errPassword}
                  </p>
                )}
                <p className="text-xs text-gray-600">
                  <span className="italic font-titleFont font-extrabold text-base text-blue-600">
                    i
                  </span>{" "}
                  {""}Passwords must be at least 6 characters.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium"> Re-enter password</p>

                <input
                  onChange={handleCPassword}
                  value={cPassword}
                  type="Password"
                  className="w-full py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#0000FF] focus-within:shadow-amazonInput duration-100"
                />
                {errCPassword && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-extrabold text-base">
                      !
                    </span>
                    {errCPassword}
                  </p>
                )}
              </div>
              <button
                onClick={handleResgistration}
                className="w-full py-1.5 text-sm font-normal rounded-sm bg-gradient-to-t from-[#f7dfa5] to-[#f0c14b] hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-amazonInput">
                Continue
              </button>
              {
                loading &&(
                    <div className="flex justify-center">
                        <RotatingLines
                         strokeColor="#e8793c"
                         strokeWidth="5"
                         animationDuration="0.75"
                         width="50"
                         visible={true}
                        />
                    </div>
                )
              }
              {
                successMsg &&(
                    <div>
                        <motion.p
                        initial={{ y: 70, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-base font-titleFont font-semibold text-blue-800 border-[1px]"
                        >
                            {successMsg}
                        </motion.p>
                    </div>
                )
              }
            </div>

            <p className="text-xs text-black leading-4 mt-4 group pb-4">
              By creating an account, you agree to Amazon's {""}
              <span className="text-blue-600 group-hover:text-orange-700 group-hover:underline underline-offset-1">
                Conditions of Use {""}
              </span>{" "}
              and {""}
              <span className="text-blue-600 group-hover:text-orange-700 group-hover:underline underline-offset-1">
                Privacy Notice.
              </span>{" "}
            </p>

            <div>
              <p className="text-xs text-black">
                Already have an account? {""}
                <Link to="/signin">
                  <span className="text-blue-600 group-hover:text-orange-700 group-hover:underline underline-offset-1">
                    {" "}
                    Sign in {""}
                    <span>
                      <ArrowRight />
                    </span>
                  </span>
                </Link>
              </p>

              <p className="text-xs text-black -mt-2">
                Buying for work? {""}
                <span className="text-blue-600 group-hover:text-orange-700 group-hover:underline underline-offset-1">
                  {" "}
                  Create a free business account{" "}
                  <span>
                    <ArrowRight />
                  </span>
                </span>{" "}
              </p>
            </div>
          </div>
        </form>
      </div>

      <div className="w-full bg-gradient-to-t from-white via-white to-zinc-200 flex flex-col gap-4 justify-center items-center py-10">
        <div className="flex items-center gap-6">
          <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline underline-offset-1 cursor-pointer duration-100">
            Conditions of Use
          </p>
          <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline underline-offset-1 cursor-pointer duration-100">
            Privacy Notice
          </p>
          <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline underline-offset-1 cursor-pointer duration-100">
            Help
          </p>
        </div>
        <p className="text-xs text-gray-600">
          © 1996-2023, Amazon.com, Inc. or its affiliates
        </p>
      </div>
    </div>
  );
};

export default Resgistration;
