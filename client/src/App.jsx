import React, { lazy, Suspense, useEffect } from "react";
import { RouteLoader } from "./components/loader/Loading";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectRoute from "./components/auth/ProtectRoute";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "./constants/config";
import { userExists, userNotExists } from "./redux/slices/auth";
import Header from "./components/layout/Header";
import { SocketProvider } from "./context/socket";

const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Event = lazy(() => import("./pages/Events"));
const Create = lazy(() => import("./pages/Create"));

const App = () => {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const { data } = await axios.get(`${server}/api/user/me`, {
          withCredentials: true,
        });

        if (data.success) {
          dispatch(userExists(data.user));
        }
      } catch (err) {
        dispatch(userNotExists());
      }
    };
    getMyProfile();
  }, [dispatch]);

  if (loader) {
    return <RouteLoader />;
  }
  return (
    <Suspense fallback={<RouteLoader />}>
      <Toaster />
      <Header />
      <Routes>
        <Route element={<ProtectRoute user={user} redirect="/login" />}>
          <Route
            path="/"
            element={
              <>
                <SocketProvider>
                  <Event />
                </SocketProvider>
              </>
            }
          />
          <Route
            path="/create"
            element={
              <>
                <SocketProvider>
                  <Create />
                </SocketProvider>
              </>
            }
          />
        </Route>

        <Route element={<ProtectRoute user={!user} redirect="/" />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
