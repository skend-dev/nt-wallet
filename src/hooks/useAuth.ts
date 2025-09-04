import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from "../store/slices/authSlice";
import { apiService } from "../services/api";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const email = "user@example.com";
      const password = "password123";

      const data = await apiService.login(email, password);
      return data;
    },
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: async (data) => {
      let token = null;
      if (data.auth && data.auth.access_token) {
        token = data.auth.access_token;
      } else if (data.accessToken) {
        token = data.accessToken;
      } else if (data.token) {
        token = data.token;
      } else if (data.access_token) {
        token = data.access_token;
      } else if (typeof data === "string") {
        token = data;
      } else {
        throw new Error("No access token found in response");
      }

      await apiService.saveToken(token);

      dispatch(loginSuccess(token));

      queryClient.invalidateQueries({ queryKey: ["balances"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      dispatch(
        loginFailure(error instanceof Error ? error.message : "Login failed")
      );
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiService.logout();
    },
    onSuccess: async () => {
      dispatch(logout());

      queryClient.clear();
    },
  });
};

export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    ...auth,
    logout: logoutUser,
  };
};
